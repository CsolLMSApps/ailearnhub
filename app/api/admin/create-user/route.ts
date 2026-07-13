import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminCreateUser } from '@/lib/supabase/admin'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'srikanth@ctekksolutions.net,shuchitha@shiroapps.com')
  .split(',').map(e => e.trim().toLowerCase())

export async function POST(request: Request) {
  // Verify caller is an admin
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, password, fullName } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

  const { data, error } = await adminCreateUser(email, password, fullName)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, user: data })
}
