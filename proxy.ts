// ============================================================
// Proxy (Next 16's renamed `middleware`) — gates the admin area.
//
// Verifies the signed session cookie on every /admin and
// /api/admin request, except the login endpoints. Unauthenticated
// page requests are redirected to the login screen; API requests
// get a 401. Runs in the Node.js runtime (proxy default).
// ============================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth'

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

const PUBLIC_PATHS = new Set(['/admin/login', '/api/admin/login'])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  const authed = await verifySessionToken(token, process.env.AUTH_SECRET)
  if (authed) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  url.search = ''
  if (pathname !== '/admin') url.searchParams.set('from', pathname)
  return NextResponse.redirect(url)
}
