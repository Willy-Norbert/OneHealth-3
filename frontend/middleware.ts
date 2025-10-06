import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple role redirect logic using cookie token + role cookie if present
const DASHBOARD_BY_ROLE: Record<string, string> = {
  patient: '/patient',
  doctor: '/doctor',
  hospital: '/hospital',
  admin: '/admin',
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value
  const role = req.cookies.get('role')?.value

  const isMarketing = pathname === '/' || pathname.startsWith('/(marketing)') || ['/_next','/api','/favicon.ico','/hero-health.svg','/logo.png'].some(p => pathname.startsWith(p))
  const isAuth = pathname.startsWith('/auth')
  const isDashboard = pathname.startsWith('/patient') || pathname.startsWith('/doctor') || pathname.startsWith('/hospital') || pathname.startsWith('/admin')

  // Unauthenticated users trying dashboard -> go to login
  if (!token && isDashboard) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated user on marketing or auth -> redirect to role dashboard if known
  if (token && (isMarketing || isAuth)) {
    const dash = role && DASHBOARD_BY_ROLE[role] ? DASHBOARD_BY_ROLE[role] : '/patient'
    const url = req.nextUrl.clone()
    url.pathname = dash
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/',
    '/auth/:path*',
    '/patient/:path*',
    '/doctor/:path*',
    '/hospital/:path*',
    '/admin/:path*',
  ],
}



