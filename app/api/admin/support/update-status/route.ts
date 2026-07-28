// app/api/admin/support/update-status/route.ts
// Toggle support ticket status: open | replied | closed

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

export async function PATCH(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email')?.toLowerCase()
  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let hasAccess = SUPER_ADMIN_EMAILS.includes(userEmail)
  if (!hasAccess) {
    const { data } = await supabaseAdmin.from('admin_users').select('email').eq('email', userEmail).single()
    hasAccess = !!data
  }
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { ticketId, status } = await request.json()
  if (!ticketId || !['open', 'replied', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'Invalid ticketId or status' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('support_tickets')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ticketId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
