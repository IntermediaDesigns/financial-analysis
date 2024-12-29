import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of routes that don't require authentication
const publicRoutes = ['/login', '/register']

// List of routes that require authentication
const protectedRoutes = ['/']

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('sessionId')
  const { pathname } = request.nextUrl

  // Check if the route requires authentication
  if (protectedRoutes.includes(pathname)) {
    if (!currentUser) {
      // Redirect to login if user is not authenticated
      const response = NextResponse.redirect(new URL('/login', request.url))
      return response
    }
  }

  // Prevent authenticated users from accessing login/register pages
  if (publicRoutes.includes(pathname)) {
    if (currentUser) {
      // Redirect to home if user is already authenticated
      const response = NextResponse.redirect(new URL('/', request.url))
      return response
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [...publicRoutes, ...protectedRoutes]
}
