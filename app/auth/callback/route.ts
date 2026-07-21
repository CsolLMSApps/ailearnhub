// app/auth/callback/route.ts
// Handles Supabase email confirmation and OAuth redirects.
// Supabase sends ?code=... here — we exchange it for a session, then redirect.

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Successfully confirmed — send to dashboard
      return NextResponse.redirect(new URL(next, origin))
    }

    // Code invalid or expired
    return NextResponse.redirect(
      new URL('/login?error=Email+link+expired.+Please+sign+in+again.', origin)
    )
  }

  // No code — just go to login
  return NextResponse.redirect(new URL('/login', origin))
}
