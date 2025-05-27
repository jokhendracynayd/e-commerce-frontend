import { NextRequest, NextResponse } from 'next/server';

// This array would typically come from an environment variable or config
// NOTE: Temporarily removing '/checkout' from protected routes for testing
const PROTECTED_ROUTES = ['/dashboard', '/admin', '/profile', '/orders']; // removed '/checkout' for testing

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // When using localStorage for auth state, we can't check it in middleware
  // because middleware runs on the server. Instead, we'll handle redirects
  // on the client side by checking localStorage in the protected page components.
  
  // However, we can still check cookies if available
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';

  // If the path is protected and there's no authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    // Save the original URL to redirect back after login
    return NextResponse.redirect(
      new URL(`/login?returnUrl=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  // For multi-tenant functionality, you would typically:
  // 1. Extract tenant info from subdomain or path
  // 2. Validate tenant exists
  // 3. Set tenant context in headers or request

  // Example: Extract tenant from subdomain (tenant.example.com)
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // Skip tenant extraction for localhost development
  if (hostname !== 'localhost:3000' && hostname !== '127.0.0.1:3000') {
    // Add tenant info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', subdomain);
    
    // Return the response with the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 