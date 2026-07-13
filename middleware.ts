// middleware.ts
// Required by @supabase/ssr to refresh auth tokens on every request.
// Without this, getSession() returns null after the access token expires
// (default: 1 hour), causing the admin guard to redirect to /login.

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          // Update request cookies so server components see the refreshed token
          request.cookies.set({ name, value, ...options } as any)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          // Write refreshed token to the response so the browser gets updated cookies
          response.cookies.set({ name, value, ...options } as any)
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options } as any)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options } as any)
        },
      },
    }
  )

  // Refresh the session — this is the key call.
  // If the access token is expired, Supabase will use the refresh token to get a new one
  // and write updated cookies to the response.
  await supabase.auth.getUser()

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
