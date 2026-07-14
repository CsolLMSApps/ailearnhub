import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  // Mutable copy of request headers.
  // SECURITY: strip any incoming x-user-email so the client can't forge it.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-user-email')

  // Collect cookies that Supabase wants to set (e.g. after token refresh)
  const cookiesToSet: Array<{ name: string; value: string; options: any }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookies) {
          // Merge refreshed cookies into the mutable Cookie header so RSCs
          // (admin layout, server components) see the new tokens immediately.
          const names = new Set(cookies.map(c => c.name))
          const existing = requestHeaders.get('cookie') ?? ''
          const kept = existing
            ? existing.split(';').map(s => s.trim()).filter(s => {
                const [n] = s.split('=')
                return s && !names.has(n.trim())
              })
            : []
          cookies.forEach(({ name, value }) => kept.push(`${name}=${value}`))
          requestHeaders.set('cookie', kept.join('; '))
          cookies.forEach(c => cookiesToSet.push(c))
        },
      },
    }
  )

  // getSession() validates the JWT signature locally — no Supabase network call
  // for fresh tokens. Only calls Supabase when the token needs refreshing.
  // This avoids competing with the browser client's autoRefreshToken for the
  // same refresh token on every request (which caused the 1-hour expiry issue).
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null
  const path = request.nextUrl.pathname

  // Protect /dashboard and /learn
  if ((path.startsWith('/dashboard') || path.startsWith('/learn')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Stamp the verified email into the request so the admin layout can read it
  // via headers() without making a second Supabase call.
  if (user?.email) {
    requestHeaders.set('x-user-email', user.email)
  }

  // Build the response, forwarding the modified request headers (updated Cookie
  // header + x-user-email) to all server components and route handlers.
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Write any refreshed cookies to the response so the browser updates them.
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
