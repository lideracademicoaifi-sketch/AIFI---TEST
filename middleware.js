import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname

  const protectedRoutes = ['/admin']

  const isProtected = protectedRoutes.some(route =>
    path.startsWith(route)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
