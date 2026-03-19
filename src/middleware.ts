import { NextRequest, NextResponse } from 'next/server';

// 定义需要保护的路由
const protectedRoutes = [
  '/dashboard',
  '/api/auth/protected',
];

export function middleware(request: NextRequest) {
  // 检查是否访问受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // 检查是否有Supabase会话cookie
    const supabaseSession = request.cookies.get('sb-dhkgfdllgtmbkwcbubqt-auth-token');
    
    if (!supabaseSession) {
      // 未登录用户访问受保护路由，重定向到登录页面
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

// 配置中间件适用的路径
export const config = {
  matcher: [
    /*
     * 匹配需要保护的路由：
     * - /dashboard (dashboard routes)
     * - /api/auth/protected (protected API routes)
     */
    '/dashboard/:path*',
    '/api/auth/protected',
  ],
};
