import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  // Build a mutable copy of request headers.
  // SECURITY: strip any incoming x-user-email so callers can't forge it.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-user-email')

  // Track any cookies that Supabase wants to set (e.g. token refresh)
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
          // Update the mutable Cookie header so the refreshed token reaches RSCs
          const parts: string[] = []
          const existing = requestHeaders.get('cookie') ?? ''
          if (existing) {
            const names = new Set(cookies.map(c => c.name))
            existing.split(';').map(s => s.trim()).filter(Boolean).forEach(part => {
              const [name] = part.split('=')
              if (!names.has(name.trim())) parts.push(part)
            })
          }
          cookies.forEach(({ name, value }) => parts.push(`${name}=${value}`))
          requestHeaders.set('cookie', parts.join('; '))
          cookies.forEach(c => cookiesToSet.push(c))
        },
      },
    }
  )

  // getUser() verifies the JWT server-side (one network call).
  // This is the single source of truth — we stamp the result into a request
  // header so the admin layout can trust it without a second Supabase call.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /dashboard and /learn
  if ((path.startsWith('/dashboard') || path.startsWith('/learn')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Stamp verified user email into request headers.
  // Admin layout reads this instead of calling Supabase again.
  if (user?.email) {
    requestHeaders.set('x-user-email', user.email)
  }

  // Build response with modified request headers (includes refreshed cookies
  // in the Cookie header + custom x-user-email)
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Also set refreshed cookies on the response so the browser gets them
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options)
  })

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
