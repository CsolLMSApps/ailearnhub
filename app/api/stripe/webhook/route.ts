// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Resolve a Supabase userId from an email address.
 * - If the user already exists, returns their existing id (isNew = false).
 * - If the user does not exist, creates a new confirmed account and returns
 *   their id along with a one-time password-setup link (isNew = true).
 */
async function resolveOrCreateUser(email: string): Promise<{
  userId: string
  isNew: boolean
  passwordSetupUrl?: string
}> {
  // Try to create the user first. If they already exist Supabase returns an error.
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { password_set: false },
  })

  if (!createErr && created?.user) {
    // Brand-new user — generate a one-time password-setup (recovery) link
    const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      },
    })

    if (linkErr) {
      console.error('Failed to generate password-setup link:', linkErr.message)
    }

    return {
      userId: created.user.id,
      isNew: true,
      passwordSetupUrl: linkData?.properties?.action_link,
    }
  }

  // User already exists — find their id via listUsers (fine for typical scale)
  const { data: { users } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const existing = users.find((u) => u.email === email)

  if (!existing) {
    // Extremely unlikely: createUser failed for a reason other than duplicate
    throw new Error(`Could not resolve user for email: ${email} — createUser error: ${createErr?.message}`)
  }

  return { userId: existing.id, isNew: false }
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const isBundle  = session.metadata?.isBundle === 'true'
      const courseIds = session.metadata?.courseIds?.split(',').filter(Boolean) ?? []
      const courseId  = session.metadata?.courseId

      // ── Resolve the user (existing or auto-created) ────────────────────────
      let userId = session.metadata?.userId

      if (!userId) {
        // Guest checkout — resolve via email
        const email = session.customer_details?.email || session.metadata?.userEmail
        if (!email) {
          console.error('No userId and no customer email in webhook:', session.id)
          return NextResponse.json({ error: 'Cannot identify purchaser' }, { status: 400 })
        }

        const { userId: resolvedId, isNew } = await resolveOrCreateUser(email)
        userId = resolvedId

        if (isNew) {
          console.log(`✅ New account auto-created for: ${email} (login handled by purchase-complete route)`)
        }
      }

      // ── Bundle: insert a purchase + progress row for every course ──────────
      if (isBundle && courseIds.length > 0) {
        for (const cid of courseIds) {
          const { data: existing } = await supabase
            .from('purchases')
            .select('id')
            .eq('user_id', userId)
            .eq('course_id', cid)
            .eq('status', 'completed')
            .single()

          if (existing) continue

          const { error: purchaseErr } = await supabase.from('purchases').insert({
            user_id: userId,
            course_id: cid,
            stripe_checkout_session_id: `${session.id}_${cid}`,
            stripe_payment_intent_id: session.payment_intent as string,
            amount_paid: Math.round((session.amount_total || 0) / courseIds.length),
            currency: session.currency || 'usd',
            status: 'completed',
          })
          if (purchaseErr) console.error(`Purchase insert failed for course ${cid}:`, purchaseErr.message)

          const { error: progressErr } = await supabase.from('progress').upsert({
            user_id: userId,
            course_id: cid,
            current_module: 1,
            completion_percentage: 0,
            completed_modules: [],
          }, { onConflict: 'user_id,course_id', ignoreDuplicates: true })
          if (progressErr) console.error(`Progress upsert failed for course ${cid}:`, progressErr.message)
        }

        console.log(`✅ Bundle purchase: User ${userId} unlocked ${courseIds.length} courses`)
        return NextResponse.json({ received: true, status: 'bundle_success' })
      }

      // ── Single course ──────────────────────────────────────────────────────
      if (!courseId) {
        console.error('Missing courseId in webhook metadata:', session.metadata)
        return NextResponse.json({ error: 'Missing courseId' }, { status: 400 })
      }

      const { error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          user_id: userId,
          course_id: courseId,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          amount_paid: session.amount_total || 0,
          currency: session.currency || 'usd',
          status: 'completed',
        })

      if (purchaseError) {
        console.error('Purchase insert error:', purchaseError)
      }

      const { error: progressError } = await supabase
        .from('progress')
        .upsert({
          user_id: userId,
          course_id: courseId,
          current_module: 1,
          completion_percentage: 0,
          completed_modules: [],
        }, { onConflict: 'user_id,course_id', ignoreDuplicates: true })

      if (progressError) {
        console.error('Progress upsert error:', progressError)
      }

      console.log(`✅ Purchase completed: User ${userId} bought course ${courseId}`)
      return NextResponse.json({ received: true, status: 'success' })

    } catch (error: any) {
      console.error('Webhook processing error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
