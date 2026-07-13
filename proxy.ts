// proxy.ts — Next.js 16 middleware
// Uses getSession() instead of getUser() for route protection.
// getUser() makes a network call to Supabase on every request which
// can fail/rate-limit during client-side navigation (RSC fetches),
// causing spurious redirects to /login.
// getSession() reads the JWT directly from the cookie — no network call,
// no rate limiting, works reliably for all request types.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  const requestHeaders = new Headers(request.headers)

  // Collect cookies to write back to the browser (for token refresh).
  const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Keep the mutable Cookie header up to date for server components.
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith(`${name}=`))
          updated.push(`${name}=${value}`)
          requestHeaders.set('cookie', updated.join('; '))
          cookiesToSet.push({ name, value, options })
        },
        remove(name: string, options: CookieOptions) {
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith(`${name}=`))
          requestHeaders.set('cookie', updated.join('; '))
          cookiesToSet.push({ name, value: '', options })
        },
      },
    }
  )

  // getSession() reads the JWT from the cookie directly — no Supabase network call.
  // This avoids rate limiting and network failures that caused spurious /login redirects.
  // If the access token is expired, it automatically refreshes via the refresh token
  // and calls set() above to store the new token.
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null
  const email = user?.email?.toLowerCase() ?? ''
  const isAdmin = user != null && ADMIN_EMAILS.includes(email)

  const path = request.nextUrl.pathname

  // /admin routes: must be logged in AND have an admin email
  if (path.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    if (!isAdmin) return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /dashboard and /learn: must be logged in
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  // Build response once with all header changes applied.
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Apply all refreshed token cookies so the browser stores them.
  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options as any)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
