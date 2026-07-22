// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Admin client for fetching published courses (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Auth is OPTIONAL — guests can check out without logging in
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await request.json()
    const { slug, isBundle = false, currency = 'usd', upgradePriceCents } = body

    // ── Bundle checkout ──────────────────────────────────────────────────────
    if (isBundle) {
      const { data: allCourses, error: coursesError } = await supabaseAdmin
        .from('courses')
        .select('id, slug')
        .eq('is_published', true)

      if (coursesError || !allCourses?.length) {
        return NextResponse.json({ error: 'No courses found' }, { status: 404 })
      }

      const courseIds = allCourses.map((c: any) => c.id).join(',')

      const BUNDLE_PRICE_CENTS = 9900
      const finalPriceCents: number =
        typeof upgradePriceCents === 'number' && upgradePriceCents > 0 && upgradePriceCents < BUNDLE_PRICE_CENTS
          ? upgradePriceCents
          : BUNDLE_PRICE_CENTS

      const isUpgrade = finalPriceCents < BUNDLE_PRICE_CENTS
      const productName = isUpgrade
        ? `AI Learn Hub — Bundle Upgrade (remaining courses)`
        : `AI Learn Hub — Complete AI Mastery Bundle (All Courses)`

      // Guest lands on payment-success page; logged-in user goes to dashboard
      const successUrl = user
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success&bundle=true`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?bundle=true`

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        // Pre-fill email only if logged in; guests enter their own
        ...(user?.email ? { customer_email: user.email } : {}),
        line_items: [{
          price_data: {
            currency: currency || 'usd',
            product_data: { name: productName },
            unit_amount: finalPriceCents,
          },
          quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?purchase=cancelled`,
        metadata: {
          ...(user ? { userId: user.id, userEmail: user.email || '' } : {}),
          isBundle: 'true',
          courseIds,
        },
      })

      return NextResponse.json({ sessionId: session.id, url: session.url })
    }

    // ── Single course checkout ───────────────────────────────────────────────
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Only check for existing purchase if user is logged in
    if (user) {
      const { data: existingPurchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .eq('status', 'completed')
        .single()

      if (existingPurchase) {
        return NextResponse.json(
          { error: 'You have already purchased this course' },
          { status: 400 }
        )
      }
    }

    const priceIdMap: Record<string, string | undefined> = {
      'chatgpt-mastery': process.env.STRIPE_PRICE_CHATGPT_MASTERY,
      'ai-for-beginners': process.env.STRIPE_PRICE_AI_BEGINNERS,
      'social-media-marketing-ai': process.env.STRIPE_PRICE_SOCIAL_MEDIA,
      'email-marketing-ai': process.env.STRIPE_PRICE_EMAIL_MARKETING,
      'prompt-engineering-mastery': process.env.STRIPE_PRICE_PROMPT_ENGINEERING,
      'ai-tools-productivity': process.env.STRIPE_PRICE_AI_PRODUCTIVITY,
    }

    const priceId = priceIdMap[slug]

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price configuration not found for this course' },
        { status: 500 }
      )
    }

    // Guest lands on payment-success page; logged-in user goes to dashboard
    const successUrl = user
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success&course=${slug}`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/payment-success?course=${slug}`

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      ...(user?.email ? { customer_email: user.email } : {}),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${slug}?purchase=cancelled`,
      metadata: {
        ...(user ? { userId: user.id, userEmail: user.email || '' } : {}),
        courseId: course.id,
        slug: slug,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })

  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
