// app/api/auth/complete-setup/route.ts
// Called by SetupAccountClient when the user submits the name + password form.
// Verifies our signed token, then updates the user via Supabase Admin:
//   - Sets full_name in user_metadata
//   - Sets a real password
//   - Marks password_set: true
// The client then signs in with the new password and redirects to /dashboard.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifySetupToken } from '@/lib/setup-token'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { token, name, password } = await request.json()

    if (!token || !name?.trim() || !password) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    // Verify our signed token
    const result = verifySetupToken(token)

    if (result.status === 'expired') {
      return NextResponse.json({ error: 'This setup link has expired. Please log in to set up your account from your dashboard.' }, { status: 401 })
    }

    if (result.status === 'invalid') {
      return NextResponse.json({ error: 'Invalid setup link.' }, { status: 401 })
    }

    const { userId } = result

    // Update the user via Supabase Admin SDK
    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password,
      user_metadata: {
        full_name: name.trim(),
        password_set: true,
      },
    })

    if (updateErr) {
      console.error('complete-setup updateUser error:', updateErr.message)
      return NextResponse.json({ error: 'Failed to update your account. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('complete-setup error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
