import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply protection to URLs that start with /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }

    try {
      const authValue = authHeader.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      // Set preferred credentials from user
      const VALID_USER = "promptsuman"
      const VALID_PWD = "promptme@2026"

      if (user === VALID_USER && pwd === VALID_PWD) {
        return NextResponse.next()
      }
    } catch (e) {
      // Fall through to unauthorized if decoding fails
    }

    return new NextResponse('Invalid Credentials', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  return NextResponse.next()
}

// Only execute this middleware on /admin routes to optimize site speed
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
