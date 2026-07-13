// proxy.ts — Next.js 16 middleware
// Single source of truth for auth. The proxy verifies the user with Supabase,
// refreshes the session if needed, stamps x-verified-admin on the request,
// and downstream server components read that header instead of calling Supabase again.

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

  // Mutable copy of incoming request headers.
  // Strip any spoofed admin headers from the browser before we set our own.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-verified-user')
  requestHeaders.delete('x-verified-admin')

  // Collect cookies that Supabase wants to write to the browser during token refresh.
  // We apply them all at the end on a single response — doing it inside set() was
  // creating a new NextResponse each time, which wiped the previous Set-Cookie headers.
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
          // Update the mutable Cookie header so server components get the fresh token.
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing
            .split(';')
            .map(s => s.trim())
            .filter(s => s && !s.startsWith(`${name}=`))
          updated.push(`${name}=${value}`)
          requestHeaders.set('cookie', updated.join('; '))

          // Queue this cookie to be written to the browser at the end.
          // Do NOT create a new NextResponse here — that was wiping previous cookies.
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

  // Single Supabase auth call. Verifies server-side and auto-refreshes expired tokens.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdmin = user != null && ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')

  // --- Route protection ---

  // /admin: must be logged in AND have an admin email
  if (path.startsWith('/admin')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
    if (!isAdmin) return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // /dashboard and /learn: must be logged in
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  // Stamp verified identity on request headers for downstream server components.
  // These headers are stripped from browser requests above so they cannot be spoofed.
  if (user) requestHeaders.set('x-verified-user', user.email ?? user.id)
  if (isAdmin) requestHeaders.set('x-verified-admin', user!.email!)

  // Build the final response ONCE with all accumulated header changes.
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Apply all queued Set-Cookie headers to the response so the browser gets
  // refreshed tokens and doesn't trigger a Supabase refresh on every request.
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
