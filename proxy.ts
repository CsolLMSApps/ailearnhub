import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'srikanth@ctekksolutions.net,shuchitha@shiroapps.com')
  .split(',').map(e => e.trim().toLowerCase())

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service') {
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  }
  if (request.nextUrl.pathname === '/privacy-policy') {
    return NextResponse.redirect(new URL('/privacy', request.url), 301)
  }

  // Standard Supabase session refresh (unchanged from original)
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdminPage = path.startsWith('/admin')
  const isAdminApi = path.startsWith('/api/admin')
  const isAdminArea = isAdminPage || isAdminApi
  const isProtected = path.startsWith('/dashboard') || path.startsWith('/learn') || isAdminArea

  // Not authenticated
  if (isProtected && !user) {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin area — verify email, then inject x-admin-email header for server components + API routes
  if (isAdminArea && user) {
    if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
      if (isAdminApi) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Build new request headers with x-admin-email added
    const reqHeaders = new Headers(request.headers)
    reqHeaders.set('x-admin-email', user.email ?? '')

    // Build response with updated request headers
    const adminResponse = NextResponse.next({ request: { headers: reqHeaders } })

    // Copy ONLY the refreshed auth cookies (with all their original attributes)
    // from the supabase-updated `response` — do NOT copy raw request cookies
    response.cookies.getAll().forEach((cookie) => {
      adminResponse.cookies.set(cookie)
    })

    return adminResponse
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
