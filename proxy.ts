import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ?? 'srikanth@ctekksolutions.net,shuchitha@shiroapps.com'
).split(',').map(e => e.trim().toLowerCase())

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  // Mutable headers — we update the Cookie header here when Supabase refreshes
  // a token, so server components (admin layout) see the fresh token.
  const reqHeaders = new Headers(request.headers)

  let response = NextResponse.next({ request: { headers: reqHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Keep the Cookie header fresh for downstream server components
          const parts = (reqHeaders.get('cookie') ?? '')
            .split(';')
            .filter(c => !c.trim().startsWith(`${name}=`))
          parts.push(`${name}=${value}`)
          reqHeaders.set('cookie', parts.join('; '))

          response = NextResponse.next({ request: { headers: reqHeaders } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          const parts = (reqHeaders.get('cookie') ?? '')
            .split(';')
            .filter(c => !c.trim().startsWith(`${name}=`))
          reqHeaders.set('cookie', parts.join('; '))

          response = NextResponse.next({ request: { headers: reqHeaders } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Require login for protected routes
  if (
    path.startsWith('/dashboard') ||
    path.startsWith('/learn') ||
    path.startsWith('/admin')
  ) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin routes: also verify the email
  if (path.startsWith('/admin')) {
    if (!ADMIN_EMAILS.includes(user!.email?.toLowerCase() ?? '')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
