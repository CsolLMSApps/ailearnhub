import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminDeleteUser } from '@/lib/supabase/admin'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? 'srikanth@ctekksolutions.net,shuchitha@shiroapps.com')
  .split(',').map(e => e.trim().toLowerCase())

export async function DELETE(request: Request) {
  // Verify caller is an admin
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user || !ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { error } = await adminDeleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
