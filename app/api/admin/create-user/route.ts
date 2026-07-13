import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { adminCreateUser } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  // proxy.ts sets x-admin-email for verified admins — trust it
  const headersList = await headers()
  const adminEmail = headersList.get('x-admin-email')
  if (!adminEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, password, fullName } = await request.json()
  if (!email || !password) return NextResponse.json({ error: 'email and password required' }, { status: 400 })

  const { data, error } = await adminCreateUser(email, password, fullName)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, user: data })
}
