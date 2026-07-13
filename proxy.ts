// proxy.ts — Next.js 16 middleware
// Calls getUser() on EVERY request to refresh the Supabase session.
// Uses a mutable headers copy so refreshed cookies are forwarded to server
// components (request.headers is immutable — request.cookies.set() alone
// does NOT update what server components see via cookies() from next/headers).

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  // Mutable copy of request headers — this is what server components will receive.
  // We update the Cookie header here when Supabase refreshes the token.
  const requestHeaders = new Headers(request.headers)

  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // 1. Update the mutable Cookie header so server components
          //    (admin layout, dashboard, etc.) receive the fresh token.
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith(`${name}=`))
          updated.push(`${name}=${value}`)
          requestHeaders.set('cookie', updated.join('; '))

          // 2. Rebuild response with updated headers — server components read these.
          response = NextResponse.next({ request: { headers: requestHeaders } })

          // 3. Send updated cookie to the browser for future requests.
          response.cookies.set(name, value, options as any)
        },
        remove(name: string, options: CookieOptions) {
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith(`${name}=`))
          requestHeaders.set('cookie', updated.join('; '))

          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set(name, '', options as any)
        },
      },
    }
  )

  // Refresh session for every request. If the access token is expired,
  // Supabase will use the refresh token to issue a new one, calling set()
  // above which properly forwards it to server components.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /dashboard and /learn
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
