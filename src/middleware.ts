import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/api/auth/protected',
];

function getSupabaseCookieName(): string {
  const cookieName = process.env.NEXT_PUBLIC_SUPABASE_COOKIE_NAME;
  if (cookieName) {
    return cookieName;
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const match = supabaseUrl.match(/https:\/\/([a-z0-9-]+)\.supabase\.co/);
    if (match && match[1]) {
      return `sb-${match[1]}-auth-token`;
    }
  }
  
  return 'sb-auth-token';
}

export function middleware(request: NextRequest) {
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    const cookieName = getSupabaseCookieName();
    const supabaseSession = request.cookies.get(cookieName);
    
    if (!supabaseSession) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/auth/protected',
  ],
};
