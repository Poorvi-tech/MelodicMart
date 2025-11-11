import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/api',
  '/_next',
  '/favicon.ico',
  '/images',
  '/static'
];

// Helper function to check if a path is public
const isPublicPath = (pathname: string) => {
  return publicPaths.some(path => 
    pathname === path || 
    pathname.startsWith(`${path}/`) ||
    pathname.match(new RegExp(`^${path.replace(/\//g, '\\/').replace(/\*/g, '.*')}$`))
  );
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // For all other paths, check authentication
  // First check for token in cookies
  const token = request.cookies.get('token');
  
  // If no token in cookies, check for authorization header (for API requests)
  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // We have a bearer token in the header, which is valid for API requests
      return NextResponse.next();
    }
    
    // No valid authentication found, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};