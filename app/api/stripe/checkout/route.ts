import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Map course slugs to Stripe Price IDs
const getPriceId = (courseSlug: string): string | undefined => {
  const priceMap: Record<string, string> = {
    'chatgpt-mastery': process.env.STRIPE_PRICE_CHATGPT_MASTERY!,
    'ai-for-beginners': process.env.STRIPE_PRICE_AI_BEGINNERS!,
    'social-media-marketing-ai': process.env.STRIPE_PRICE_SOCIAL_MEDIA!,
    'email-marketing-ai': process.env.STRIPE_PRICE_EMAIL_MARKETING!,
    'prompt-engineering-mastery': process.env.STRIPE_PRICE_PROMPT_ENGINEERING!,
    'ai-tools-productivity': process.env.STRIPE_PRICE_AI_PRODUCTIVITY!,
  }
  return priceMap[courseSlug]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL('/auth/login?redirect=/courses', request.url))
    }

    // Parse form data
    const formData = await request.formData()
    const courseSlug = formData.get('courseSlug') as string
    const courseId = formData.get('courseId') as string

    if (!courseSlug || !courseId) {
      return NextResponse.json(
        { error: 'Missing course information' },
        { status: 400 }
      )
    }

    // Get course details from database
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if user already purchased this course
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .single()

    if (existingPurchase) {
      // Already purchased - redirect to course
      return NextResponse.redirect(
        new URL(`/learn/${courseId}`, request.url)
      )
    }

    // Get Stripe Price ID
    const priceId = getPriceId(courseSlug)
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price configuration missing for this course' },
        { status: 500 }
      )
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success&course=${courseSlug}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${courseSlug}?purchase=cancelled`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        courseId: courseId,
        courseSlug: courseSlug,
      },
      allow_promotion_codes: true,
    })

    // Redirect to Stripe Checkout
    if (session.url) {
      return NextResponse.redirect(session.url)
    } else {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
