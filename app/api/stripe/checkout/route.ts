// app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { courseSlug, currency = 'usd' } = body

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', courseSlug)
      .eq('is_published', true)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

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

    const priceIdMap: Record<string, string | undefined> = {
      'chatgpt-mastery': process.env.STRIPE_PRICE_CHATGPT_MASTERY,
      'ai-for-beginners': process.env.STRIPE_PRICE_AI_BEGINNERS,
      'social-media-marketing-ai': process.env.STRIPE_PRICE_SOCIAL_MEDIA,
      'email-marketing-ai': process.env.STRIPE_PRICE_EMAIL_MARKETING,
      'prompt-engineering-mastery': process.env.STRIPE_PRICE_PROMPT_ENGINEERING,
      'ai-tools-productivity': process.env.STRIPE_PRICE_AI_PRODUCTIVITY,
    }

    const priceId = priceIdMap[courseSlug]

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price configuration not found for this course' },
        { status: 500 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success&course=${courseSlug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${courseSlug}?purchase=cancelled`,
      metadata: {
        userId: user.id,
        courseId: course.id,
        courseSlug: courseSlug,
        userEmail: user.email || '',
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })

  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
