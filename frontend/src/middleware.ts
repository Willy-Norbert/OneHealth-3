import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl

  const isAuthRoute = url.pathname.startsWith('/auth')
  const isProtected = ['/dashboard', '/patient', '/doctor', '/hospital', '/admin'].some(p => url.pathname.startsWith(p))

  if (!token && isProtected) {
    const loginUrl = new URL('/auth/login', url.origin)
    loginUrl.searchParams.set('redirect', url.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (token) {
    // decode role from token (no heavy lib in middleware)
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      const role = payload.role as string
      if (url.pathname.startsWith('/patient') && role !== 'patient') return NextResponse.redirect(new URL('/', url.origin))
      if (url.pathname.startsWith('/doctor') && role !== 'doctor') return NextResponse.redirect(new URL('/', url.origin))
      if (url.pathname.startsWith('/hospital') && role !== 'hospital') return NextResponse.redirect(new URL('/', url.origin))
      if (url.pathname.startsWith('/admin') && role !== 'admin') return NextResponse.redirect(new URL('/', url.origin))
      if (isAuthRoute) return NextResponse.redirect(new URL('/dashboard', url.origin))
    } catch {
      // invalid token -> clear cookie and redirect to login
      const res = NextResponse.redirect(new URL('/auth/login', url.origin))
      res.cookies.delete('token')
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|public).*)']
}

