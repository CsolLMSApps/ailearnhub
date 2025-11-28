import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export async function createCheckoutSession({
  courseId,
  courseTitle,
  courseDescription,
  amount,
  currency,
  userId,
  userEmail,
}: {
  courseId: string
  courseTitle: string
  courseDescription: string
  amount: number
  currency: string
  userId: string
  userEmail: string
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: courseTitle,
            description: courseDescription,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?purchase=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/marketing/courses/${courseId}?purchase=cancelled`,
    customer_email: userEmail,
    metadata: {
      userId,
      courseId,
    },
  })

  return session
}
