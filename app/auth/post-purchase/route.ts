// app/auth/post-purchase/route.ts
// Second leg of the guest purchase auto-login flow.
// Called by purchase-complete with a short-lived HMAC-signed token.
//
// Steps:
//   1. Verify our own token (no Supabase magic links involved)
//   2. Sign in with the temp password using createServerClient
//      → this sets proper server-side session cookies
//   3. Redirect to /dashboard

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { verifyToken } from '@/app/api/auth/purchase-complete/route'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawToken = searchParams.get('t')
  const purchase = searchParams.get('purchase')
  const bundle = searchParams.get('bundle')
  const course = searchParams.get('course')

  // Build the dashboard redirect URL with purchase params
  const dashParams = new URLSearchParams()
  if (purchase) dashParams.set('purchase', purchase)
  if (bundle) dashParams.set('bundle', bundle)
  if (course) dashParams.set('course', course)
  const dashboardUrl = `${SITE_URL}/dashboard${dashParams.size ? `?${dashParams}` : ''}`

  if (!rawToken) {
    return NextResponse.redirect(`${SITE_URL}/payment-success`)
  }

  // Verify our HMAC token
  const payload = verifyToken(decodeURIComponent(rawToken))
  if (!payload) {
    console.error('post-purchase: invalid or expired token')
    return NextResponse.redirect(`${SITE_URL}/login?error=Your+access+link+has+expired.+Please+log+in.`)
  }

  try {
    const cookieStore = await cookies()

    // Use createServerClient so signInWithPassword sets cookies properly
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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.tp,
    })

    if (signInError) {
      console.error('post-purchase: signIn failed', signInError.message)
      return NextResponse.redirect(
        `${SITE_URL}/login?error=Could+not+sign+in+automatically.+Please+log+in+manually.`
      )
    }

    // Signed in successfully — go straight to dashboard
    return NextResponse.redirect(dashboardUrl)

  } catch (err: any) {
    console.error('post-purchase error:', err.message)
    return NextResponse.redirect(`${SITE_URL}/payment-success`)
  }
}
