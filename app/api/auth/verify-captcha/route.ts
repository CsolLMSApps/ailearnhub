// app/api/auth/verify-captcha/route.ts
// Verifies a Cloudflare Turnstile token server-side before allowing login.

import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/turnstile'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const ok = await verifyTurnstile(token)

    if (!ok) {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: 'Verification error. Please try again.' },
      { status: 500 }
    )
  }
}
