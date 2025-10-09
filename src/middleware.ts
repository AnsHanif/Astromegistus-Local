import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tkGr = request.cookies.get('astro-tk');
  const adminToken = request.cookies.get('adminToken');

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Define route categories
  const publicRoutes = [
    '/',
    '/auth-selection',
    '/signup',
    '/login',
    '/reset-password',
    '/pricing-plans',
    '/order-summary',
    '/products',
    '/coaching',
    '/about-us',
    '/contact',
    '/career',
    '/shopping-cart',
    '/astrology-news',
    '/admin/login',
  ];

  // Check if route is public
  let isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (pathname.startsWith('/products/flow')) {
    isPublicRoute = false;
  }

  // Special handling for admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Admin token exists, allow access to admin routes
    return NextResponse.next();
  }

  // If no token and accessing protected route
  if (!tkGr && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists, verify and check role (for regular users, NOT admin)
  if (tkGr && !isPublicRoute && !pathname.startsWith('/admin')) {
    try {
      const secret = new TextEncoder().encode(
        process.env.NEXT_PUBLIC_TOKEN_SECRET ||
          'Astromegistus@2025!aRt91Qv7Zx!mLdE#4pHs'
      );
      const { payload } = await jwtVerify(tkGr.value, secret);
      const userRole = payload.role as string;

      // Role-based access control for regular users
      if (pathname.startsWith('/dashboard/astrologers')) {
        if (
          userRole !== 'ASTROMEGISTUS' &&
          userRole !== 'ASTROMEGISTUS_COACH'
        ) {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
      } else if (pathname.startsWith('/dashboard')) {
        if (userRole === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url));
        } else if (
          userRole === 'ASTROMEGISTUS' ||
          userRole === 'ASTROMEGISTUS_COACH'
        ) {
          return NextResponse.redirect(
            new URL('/dashboard/astrologers', request.url)
          );
        }
        // GUEST and PAID users can access /dashboard
      }

      if (pathname.startsWith('/products/flow')) {
        if (userRole !== 'GUEST' && userRole !== 'PAID') {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      // Invalid token - redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('astro-tk');
      return response;
    }
  }

  // If logged in user tries to access public auth routes, redirect to dashboard
  if (
    tkGr &&
    (pathname === '/auth-selection' ||
      pathname === '/signup' ||
      pathname === '/login' ||
      pathname === '/reset-password' ||
      pathname === '/pricing-plans' ||
      pathname === '/admin/login')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If admin is logged in and tries to access regular login, redirect to admin
  if (adminToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
