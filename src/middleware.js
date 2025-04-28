import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/', '/api/auth', '/auth'];
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
  
  // Check if the path is api/github-summarizer route, which requires API key not login
  const isApiRoute = path.startsWith('/api/github-summarizer');
  
  if (isPublicPath || isApiRoute) {
    return NextResponse.next();
  }
  
  // Check if the user is authenticated
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Redirect to login if not authenticated and trying to access protected route
  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/signin', request.url));
  }
  
  // Continue if authenticated
  return NextResponse.next();
}

// Configure which paths should be checked
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/api/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
}; 