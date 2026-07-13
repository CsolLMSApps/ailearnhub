import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { adminDeleteUser } from '@/lib/supabase/admin'

export async function DELETE(request: Request) {
  // proxy.ts sets x-admin-email for verified admins — trust it
  const headersList = await headers()
  const adminEmail = headersList.get('x-admin-email')
  if (!adminEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { userId } = await request.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { error } = await adminDeleteUser(userId)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
