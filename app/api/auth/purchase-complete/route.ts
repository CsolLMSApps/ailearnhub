// app/api/auth/purchase-complete/route.ts
// Stripe redirects guests here after payment:
//   success_url: /api/auth/purchase-complete?session_id={CHECKOUT_SESSION_ID}&slug=SLUG
//
// Strategy — no Supabase magic links, no external URLs:
//   1. Fetch Stripe session → get customer email
//   2. Create Supabase account with a random temp password
//   3. Sign our own short-lived HMAC token containing the temp credentials
//   4. Redirect to /auth/post-purchase?t=TOKEN  (our domain, our URL)
//   5. That route verifies token, signs in with temp password, lands on /dashboard

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { createHmac, randomUUID } from 'crypto'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

// ── Token helpers (self-contained, no external JWT library) ─────────────────

function signToken(payload: object): string {
  // Use service role key as signing secret — already server-only
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifyToken(token: string): { email: string; tp: string; exp: number } | null {
  try {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const [data, sig] = token.split('.')
    if (!data || !sig) return null
    const expectedSig = createHmac('sha256', secret).update(data).digest('base64url')
    if (sig !== expectedSig) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (Date.now() > payload.exp) return null // expired
    return payload
  } catch {
    return null
  }
}

// ────────────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const slug = searchParams.get('slug')
  const isBundle = searchParams.get('bundle') === 'true'

  if (!sessionId) {
    return NextResponse.redirect(`${SITE_URL}/payment-success`)
  }

  try {
    // Fetch Stripe session to get customer email
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    const email = stripeSession.customer_details?.email

    if (!email) {
      console.error('purchase-complete: no email in Stripe session', sessionId)
      return NextResponse.redirect(`${SITE_URL}/payment-success`)
    }

    const successParam = isBundle
      ? `purchase=success&bundle=true`
      : slug
      ? `purchase=success&course=${slug}`
      : `purchase=success`

    // ── Try to create a new user ─────────────────────────────────────────────
    const tempPassword = randomUUID() // random, single-use

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { password_set: false },
    })

    if (!createErr && created?.user) {
      // Brand new user — sign our own token and do the auto-login flow
      const token = signToken({
        email,
        tp: tempPassword,
        exp: Date.now() + 10 * 60 * 1000, // 10 minutes
      })

      return NextResponse.redirect(
        `${SITE_URL}/auth/post-purchase?t=${encodeURIComponent(token)}&${successParam}`
      )
    }

    // Existing user — they already have a password, just send them to login
    // Their purchase record will be created by the webhook
    return NextResponse.redirect(
      `${SITE_URL}/payment-success?${successParam}&existing=true`
    )

  } catch (err: any) {
    console.error('purchase-complete error:', err.message)
    return NextResponse.redirect(`${SITE_URL}/payment-success`)
  }
}
