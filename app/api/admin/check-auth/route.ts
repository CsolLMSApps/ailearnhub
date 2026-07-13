// app/api/admin/check-auth/route.ts
// Server-side admin auth check — reads Supabase session from cookies reliably.
// The browser Supabase client cannot always read the session (cookie format/HttpOnly issues),
// so AdminAuthGuard calls this endpoint instead of checking client-side.

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const ADMIN_EMAILS = [
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

    if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
      return NextResponse.json({ status: 'unauthorized' }, { status: 403 })
    }

    return NextResponse.json({ status: 'ok', email: user.email })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
