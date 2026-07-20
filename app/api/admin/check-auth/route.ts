// app/api/admin/check-auth/route.ts
// Server-side admin auth check — reads Supabase session from cookies reliably.
// The browser Supabase client cannot always read the session (cookie format/HttpOnly issues),
// so AdminAuthGuard calls this endpoint instead of checking client-side.

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetchAll } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ status: 'unauthenticated' }, { status: 401 })
    }

    const email = user.email?.toLowerCase() ?? ''

    // Check hardcoded super-admins first
    let hasAccess = SUPER_ADMIN_EMAILS.includes(email)

    // Then check dynamic admins in the database
    if (!hasAccess) {
      const { data } = await adminFetchAll(
        'admin_users',
        `email=eq.${encodeURIComponent(email)}&select=email`
      )
      hasAccess = data.length > 0
    }

    if (!hasAccess) {
      return NextResponse.json({ status: 'unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ status: 'ok', email: user.email })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
