import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    const correctPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    if (!authHeader) {
      return new NextResponse('Authentication required', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
      })
    }

    const authValue = authHeader.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    if (user === 'admin' && pwd === correctPassword) {
      return NextResponse.next()
    }

    return new NextResponse('Invalid credentials', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
