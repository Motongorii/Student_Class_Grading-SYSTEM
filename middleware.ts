import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login and API routes
        if (pathname.startsWith('/login') || pathname.startsWith('/api')) {
          return true;
        }

        // Check role-based access
        if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
          return false;
        }
        if (pathname.startsWith('/instructor') && token?.role !== 'INSTRUCTOR') {
          return false;
        }
        if (pathname.startsWith('/registrar') && token?.role !== 'REGISTRAR') {
          return false;
        }
        if (pathname.startsWith('/student') && token?.role !== 'STUDENT') {
          return false;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};