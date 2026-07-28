// app/api/admin/support/messages/route.ts
// Returns all messages for a given ticket (admin only)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email')?.toLowerCase()
  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let hasAccess = SUPER_ADMIN_EMAILS.includes(userEmail)
  if (!hasAccess) {
    const { data } = await supabaseAdmin.from('admin_users').select('email').eq('email', userEmail).single()
    hasAccess = !!data
  }
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const ticketId = request.nextUrl.searchParams.get('ticketId')
  if (!ticketId) return NextResponse.json({ error: 'ticketId required' }, { status: 400 })

  const { data: messages, error } = await supabaseAdmin
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ messages })
}
