// app/api/auth/send-setup-link/route.ts
// Called when a logged-in user clicks "Send me a setup link" in the
// dashboard bell notification. Generates a Supabase recovery link and
// sends it to the user's email via Resend.

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { sendPasswordSetupEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    // Must be authenticated
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Generate a recovery (password reset) link
    const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: user.email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/set-password`,
      },
    })

    if (linkErr || !linkData?.properties?.action_link) {
      console.error('Failed to generate setup link:', linkErr?.message)
      return NextResponse.json({ error: 'Failed to generate link' }, { status: 500 })
    }

    await sendPasswordSetupEmail(user.email, linkData.properties.action_link)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('send-setup-link error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
