import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminCreateUser } from '@/lib/supabase/admin'

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ?? 'srikanth@ctekksolutions.net,shuchitha@shiroapps.com'
).split(',').map(e => e.trim().toLowerCase())

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  const email = session?.user?.email?.toLowerCase() ?? ''

  if (!email || !ADMIN_EMAILS.includes(email)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email: newEmail, password, fullName } = await request.json()
  if (!newEmail || !password) {
    return NextResponse.json({ error: 'email and password required' }, { status: 400 })
  }

  const { data, error } = await adminCreateUser(newEmail, password, fullName)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, user: data })
}
