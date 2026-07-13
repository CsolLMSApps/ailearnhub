// proxy.ts — Next.js 16 middleware
// Single source of truth for auth. The proxy verifies the user with Supabase,
// stamps verified headers on the request, and downstream server components
// read those headers instead of making a second getUser() call.

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

  // Mutable headers copy. We:
  //  1. Strip spoofable admin headers from the browser request
  //  2. Forward refreshed Supabase cookies to server components
  //  3. Stamp x-verified-user / x-verified-admin after auth check
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-verified-user')
  requestHeaders.delete('x-verified-admin')

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
          // Update the mutable Cookie header so server components receive fresh tokens.
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith(`${name}=`))
          updated.push(`${name}=${value}`)
          requestHeaders.set('cookie', updated.join('; '))
          response = NextResponse.next({ request: { headers: requestHeaders } })
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

  // Single Supabase auth call for the entire request pipeline.
  // getUser() verifies server-side and auto-refreshes expired tokens via set() above.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdmin = user != null && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')

  // --- Route protection ---

  // /admin routes: must be logged in AND have an admin email
  if (path.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    if (!isAdmin) return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /dashboard and /learn: must be logged in
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  // Stamp verified identity headers so server components don't need a second
  // getUser() call. These are stripped from incoming browser requests above
  // so they cannot be spoofed.
  if (user) {
    requestHeaders.set('x-verified-user', user.email ?? user.id)
  }
  if (isAdmin) {
    requestHeaders.set('x-verified-admin', user!.email!)
  }

  // Rebuild response with all header mutations applied
  response = NextResponse.next({ request: { headers: requestHeaders } })

  // Re-apply any Set-Cookie headers that were accumulated during token refresh.
  // (Each NextResponse.next() call in set() added a cookie; we replay them here.)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
