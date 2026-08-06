// app/api/auth/forgot-password/route.ts
// Uses Supabase's built-in resetPasswordForEmail.
// Sends a recovery link → /auth/callback?next=/set-password → user sets new password.
// No custom OTP table needed.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailearnhub.io'
    const redirectTo = `${siteUrl}/auth/callback?next=/set-password`

    // Supabase sends the reset email — always returns success for security
    await supabase.auth.resetPasswordForEmail(email, { redirectTo })

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
