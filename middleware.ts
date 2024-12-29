import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of routes that don't require authentication
const publicRoutes = ['/login', '/register']

// List of routes that require authentication
const protectedRoutes = ['/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get Appwrite session cookie
  const appwriteSession = request.cookies.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  const isAuthenticated = !!appwriteSession?.value

  // Check if the route requires authentication
  if (protectedRoutes.includes(pathname)) {
    if (!isAuthenticated) {
      // Store the original URL to redirect back after login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.set('redirectTo', pathname)
      return response
    }
  }

  // Prevent authenticated users from accessing login/register pages
  if (publicRoutes.includes(pathname)) {
    if (isAuthenticated) {
      // Get stored redirect path or default to home
      const redirectTo = request.cookies.get('redirectTo')?.value || '/'
      const response = NextResponse.redirect(new URL(redirectTo, request.url))
      // Clear the redirect cookie
      response.cookies.delete('redirectTo')
      return response
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [...publicRoutes, ...protectedRoutes]
}
