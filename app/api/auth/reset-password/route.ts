// app/api/auth/reset-password/route.ts
// Verifies the OTP was previously validated, then resets the user's password.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, otpId, password } = await request.json()

    if (!email || !otpId || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Confirm the OTP was verified and not yet used
    const { data: record, error: fetchError } = await supabase
      .from('password_reset_otps')
      .select('*')
      .eq('id', otpId)
      .eq('email', email)
      .eq('verified', true)
      .eq('used', false)
      .single()

    if (fetchError || !record) {
      return NextResponse.json({ error: 'Invalid or expired reset session. Please start over.' }, { status: 400 })
    }

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Reset session expired. Please request a new code.' }, { status: 400 })
    }

    // Find the user by email
    const { data: users } = await supabase.auth.admin.listUsers({ perPage: 1000 })
    const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update the password
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, { password })

    if (updateError) {
      console.error('Password update error:', updateError)
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }

    // Mark OTP as used
    await supabase
      .from('password_reset_otps')
      .update({ used: true })
      .eq('id', otpId)

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
