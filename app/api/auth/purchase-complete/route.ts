// app/api/auth/purchase-complete/route.ts
// Stripe redirects guests here after a successful payment via:
//   success_url: /api/auth/purchase-complete?session_id={CHECKOUT_SESSION_ID}&slug=SLUG
//
// This route:
//   1. Fetches the Stripe session to get the customer's email
//   2. Creates or finds their Supabase account
//   3. Generates a magic link (one-time login URL)
//   4. Immediately redirects to that magic link → user lands on /dashboard logged in
//
// Logged-in users are never sent here (they go directly to /dashboard).

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session_id')
  const slug = searchParams.get('slug')
  const isBundle = searchParams.get('bundle') === 'true'

  if (!sessionId) {
    return NextResponse.redirect(`${SITE_URL}/payment-success`)
  }

  try {
    // Fetch the Stripe session — customer email is available here after payment
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)
    const email = stripeSession.customer_details?.email

    if (!email) {
      console.error('purchase-complete: no email in Stripe session', sessionId)
      return NextResponse.redirect(`${SITE_URL}/payment-success`)
    }

    // ── Create or find Supabase user ─────────────────────────────────────────
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { password_set: false },
    })

    // If creation failed it's because the user already exists — that's fine
    if (createErr && !createErr.message.toLowerCase().includes('already')) {
      console.error('purchase-complete: createUser error', createErr.message)
    }

    // If user wasn't just created, find their existing id (needed for magic link)
    if (!created?.user) {
      // User already exists — generateLink works on existing users too, no lookup needed
    }

    // ── Generate magic link → logs user in and sends them to /dashboard ──────
    const successParam = isBundle
      ? `purchase=success&bundle=true`
      : slug
      ? `purchase=success&course=${slug}`
      : `purchase=success`

    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${SITE_URL}/dashboard?${successParam}`,
      },
    })

    if (linkErr || !linkData?.properties?.action_link) {
      console.error('purchase-complete: generateLink error', linkErr?.message)
      return NextResponse.redirect(`${SITE_URL}/payment-success`)
    }

    // Redirect straight to the Supabase magic link URL.
    // Supabase verifies the token → creates session → redirects to /dashboard.
    return NextResponse.redirect(linkData.properties.action_link)

  } catch (err: any) {
    console.error('purchase-complete error:', err.message)
    return NextResponse.redirect(`${SITE_URL}/payment-success`)
  }
}
