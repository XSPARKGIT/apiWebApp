import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from '@/src/app/lib/supabaseClient';

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
      }
      return session;
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          google_id: profile.sub,
          last_sign_in: new Date().toISOString(),
        })
        .select();
      
      if (error) {
        console.error('Error storing user in database:', error);
      }
      
      return true;
    },
  },
};

// Auth.js handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 