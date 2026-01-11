// app/api/stripe/webhook/route.ts
// Stripe Webhook Handler - Processes payment completions

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

// Use service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const userId = session.metadata?.userId
      const courseId = session.metadata?.courseId
      const courseSlug = session.metadata?.courseSlug
      const userEmail = session.metadata?.userEmail || session.customer_email

      if (!userId || !courseId) {
        console.error('Missing metadata in webhook:', session.metadata)
        return NextResponse.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        )
      }

      // 1. Create purchase record
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
        // Don't fail the webhook, just log it
      }

      // 2. Create initial progress record
      const { error: progressError } = await supabase
        .from('progress')
        .insert({
          user_id: userId,
          course_id: courseId,
          current_module: 1,
          completion_percentage: 0,
          completed_modules: [],
        })

      if (progressError) {
        console.error('Progress insert error:', progressError)
        // Don't fail the webhook, just log it
      }

      // 3. Send confirmation email (optional - implement with Resend)
      // await sendPurchaseConfirmationEmail(userEmail, courseSlug)

      console.log(`✅ Purchase completed: User ${userId} bought course ${courseId}`)

      return NextResponse.json({ received: true, status: 'success' })

    } catch (error: any) {
      console.error('Webhook processing error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
  }

  // Handle other event types if needed
  return NextResponse.json({ received: true })
}

// Disable body parsing, need raw body for signature verification
export const runtime = 'nodejs'
