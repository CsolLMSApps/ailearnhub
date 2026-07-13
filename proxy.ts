import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'srikanth@ctekksolutions.net,shuchitha@shiroapps.com')
  .split(',').map(e => e.trim().toLowerCase())

export async function proxy(request: NextRequest) {
  // Legal page redirects for SEO/compatibility
  if (request.nextUrl.pathname === '/terms-of-service') {
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  }
  if (request.nextUrl.pathname === '/privacy-policy') {
    return NextResponse.redirect(new URL('/privacy', request.url), 301)
  }

  // Build mutable request headers so server components can read proxy-set values
  const requestHeaders = new Headers(request.headers)

  let response = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          requestHeaders.set('cookie', `${name}=${value}`)
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: requestHeaders } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes — redirect to login if not authenticated
  if (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/learn') ||
    request.nextUrl.pathname.startsWith('/admin')
  ) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Admin routes — redirect non-admins silently to dashboard
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!ADMIN_EMAILS.includes(user!.email?.toLowerCase() ?? '')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // Pass verified email to admin layout via request header
    requestHeaders.set('x-admin-email', user!.email ?? '')
    response = NextResponse.next({ request: { headers: requestHeaders } })
    // Copy any refreshed auth cookies to response
    request.cookies.getAll().forEach(({ name, value }) => {
      response.cookies.set(name, value)
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
