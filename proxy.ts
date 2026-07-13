// proxy.ts — Next.js 16 middleware
// Calls getUser() on EVERY request to validate + refresh the Supabase session.
// This is required so that ALL server components (dashboard, admin, learn, etc.)
// receive correctly-formatted, fresh cookies — not just protected routes.
// Without this global refresh, createServerClient in server components cannot
// read the raw browser-set cookies from createBrowserClient.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  let response = NextResponse.next({
    request: { headers: request.headers },
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
          // Update the request's cookie jar so server components see refreshed token
          request.cookies.set({ name, value, ...options } as any)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options } as any)
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options } as any)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options } as any)
        },
      },
    }
  )

  // Validate + refresh session for every request.
  // The returned user is used for route protection below.
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Protect /dashboard and /learn — server-redirect if not authenticated
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  // /admin auth is handled server-side in app/admin/layout.tsx
  // (email allowlist check in addition to authentication)

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
