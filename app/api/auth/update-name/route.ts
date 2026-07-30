// app/api/auth/update-name/route.ts
// Saves a full_name to the authenticated user's Supabase metadata.
// Called from CertificateNameGate when a guest user enters their name
// before downloading their certificate.

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
    }

    const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        full_name: name.trim(),
      },
    })

    if (updateErr) {
      console.error('update-name error:', updateErr.message)
      return NextResponse.json({ error: 'Failed to save name.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('update-name error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
