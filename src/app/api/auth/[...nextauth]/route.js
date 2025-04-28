import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client for direct database operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.DB_USER, // Using the service role key for admin operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Configure authentication options
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, token }) {
      // Add user ID to session for database operations
      if (session?.user) {
        session.user.id = token.sub;
        
        // If you want to add roles to the session
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('google_id', token.sub)
            .single();
            
          if (data && !error) {
            session.user.role = data.role;
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      // If we have a profile, update token with profile info
      if (profile) {
        token.name = profile.name;
        token.email = profile.email;
        token.picture = profile.picture;
      }
      
      return token;
    },
    async signIn({ user, account, profile }) {
      try {
        console.log('User trying to sign in:', user.email);
        
        // Check if user already exists
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('google_id', profile.sub)
          .maybeSingle();
          
        if (fetchError) {
          console.error('Error checking if user exists:', fetchError);
          // Allow sign in even if we can't check the database
          return true;
        }
        
        if (existingUser) {
          // User exists - update last sign in time
          const { error: updateError } = await supabase
            .from('users')
            .update({
              last_sign_in: new Date().toISOString(),
              name: user.name, // Update name in case it changed
              image: user.image, // Update image in case it changed
            })
            .eq('google_id', profile.sub);
            
          if (updateError) {
            console.error('Error updating existing user:', updateError);
          } else {
            console.log('Updated existing user:', user.email);
          }
        } else {
          // New user - create record
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: crypto.randomUUID(), // Generate a new UUID
              name: user.name,
              email: user.email,
              image: user.image,
              google_id: profile.sub,
              last_sign_in: new Date().toISOString(),
              role: 'user', // Default role
            });
            
          if (insertError) {
            console.error('Error creating new user:', insertError);
          } else {
            console.log('Created new user:', user.email);
          }
        }
        
        return true;
      } catch (error) {
        console.error('Unexpected error during sign in:', error);
        // Still return true to allow sign in even if DB operations fail
        return true;
      }
    },
  },
};

// Auth.js handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 