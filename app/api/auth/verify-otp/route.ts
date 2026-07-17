// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const { data: record, error } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('email', email)
      .eq('otp', otp)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !record) {
      return NextResponse.json({ error: 'Invalid code. Please check and try again.' }, { status: 400 })
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This code has expired. Please request a new one.' }, { status: 400 })
    }

    // Mark as verified so reset-password endpoint can trust it
    await supabase
      .from('password_reset_otps')
      .update({ verified: true })
      .eq('id', record.id)

    return NextResponse.json({ success: true, otpId: record.id })

  } catch (error: any) {
    console.error('Verify OTP error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
