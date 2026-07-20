import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminDeleteUser } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/supabase/is-admin'

export async function DELETE(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  const email = session?.user?.email ?? ''

  if (!email || !(await isAdmin(email))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { error } = await adminDeleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
