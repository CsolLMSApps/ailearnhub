// proxy.ts — Next.js 16 middleware (alternative to middleware.ts)
// Handles: SEO redirects, auth protection for /dashboard + /learn,
// and session token refresh for /admin (so AdminAuthGuard always gets a valid token).

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

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

  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    // Refresh session cookies so AdminAuthGuard's onAuthStateChange
    // always receives a valid (non-expired) token. No redirect here —
    // the client-side guard handles the admin email check.
    await supabase.auth.getUser()
    return response
  }

  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
