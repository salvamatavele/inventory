import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Skip middleware for auth-related routes
    if (req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.next();
    }

    // Performance optimization: Early return for non-protected routes
    if (!req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.next();
    }

    // Handle admin routes with optimized check
    if (req.nextUrl.pathname.startsWith("/users") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Skip auth check for login page
        if (req.nextUrl.pathname.startsWith('/login')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Optimize matching patterns
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/dashboard/:path*',
    '/products/:path*',
    '/categories/:path*',
    '/suppliers/:path*',
    '/transactions/:path*',
    '/reports/:path*',
    '/users/:path*',
  ],
};