import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const isApiAdmin = request.nextUrl.pathname.startsWith('/api/admin')
  const isAdmin = request.nextUrl.pathname.startsWith('/admin')

  if (isAdmin || isApiAdmin) {
    const authHeader = request.headers.get('authorization')
    const VALID_USER = 'promptsuman'
    const VALID_PWD = 'promptme@2026'
    
    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      })
    }

    try {
      const authValue = authHeader.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      if (user === VALID_USER && pwd === VALID_PWD) {
        return NextResponse.next()
      }
    } catch (err) {
      // silent fail to unauthorized
    }

    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
