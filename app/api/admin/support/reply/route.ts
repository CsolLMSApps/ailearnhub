// app/api/admin/support/reply/route.ts
// Admin sends a reply to a support ticket.
// Saves the outbound message to ticket_messages and sends via Resend.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  // Admin auth via x-user-email header
  const userEmail = request.headers.get('x-user-email')?.toLowerCase()
  if (!userEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let hasAccess = SUPER_ADMIN_EMAILS.includes(userEmail)
  if (!hasAccess) {
    const { data } = await supabaseAdmin
      .from('admin_users')
      .select('email')
      .eq('email', userEmail)
      .single()
    hasAccess = !!data
  }
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { ticketId, body } = await request.json()
  if (!ticketId || !body?.trim()) {
    return NextResponse.json({ error: 'ticketId and body are required' }, { status: 400 })
  }

  // Fetch the ticket
  const { data: ticket, error: ticketErr } = await supabaseAdmin
    .from('support_tickets')
    .select('id, ticket_number, name, email, subject, status')
    .eq('id', ticketId)
    .single()

  if (ticketErr || !ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 })
  }

  // Send reply email to the user
  const { error: emailErr } = await resend.emails.send({
    from:    'AI Learn Hub Support <noreply@ailearnhub.io>',
    to:      ticket.email,
    replyTo: 'support@ailearnhub.io',
    subject: `Re: [${ticket.ticket_number}] ${ticket.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#FF6F00;padding:20px;border-radius:8px 8px 0 0">
          <h2 style="color:white;margin:0">AI Learn Hub Support</h2>
          <p style="color:rgba(255,255,255,0.8);margin:4px 0 0">${ticket.ticket_number}</p>
        </div>
        <div style="background:#f9f9f9;padding:20px;border:1px solid #e0e0e0;border-top:none">
          <p>Hi ${ticket.name},</p>
          <div style="background:white;border:1px solid #e0e0e0;border-radius:6px;padding:16px;margin:12px 0">
            ${body.trim().replace(/\n/g, '<br>')}
          </div>
          <hr style="margin:20px 0;border:none;border-top:1px solid #e0e0e0">
          <p>Best regards,<br><strong>The AI Learn Hub Support Team</strong></p>
          <p style="color:#9e9e9e;font-size:12px">Reference: ${ticket.ticket_number}</p>
        </div>
      </div>
    `,
  })

  if (emailErr) {
    console.error('Reply email error:', emailErr)
    return NextResponse.json({ error: 'Failed to send reply email' }, { status: 500 })
  }

  // Save outbound message to thread
  const { data: message, error: msgErr } = await supabaseAdmin
    .from('ticket_messages')
    .insert({
      ticket_id:    ticket.id,
      direction:    'outbound',
      sender_name:  'AI Learn Hub Support',
      sender_email: 'support@ailearnhub.io',
      body:         body.trim(),
    })
    .select()
    .single()

  if (msgErr) {
    console.error('Failed to save reply message:', msgErr)
  }

  // Update ticket status to 'replied' and bump updated_at
  await supabaseAdmin
    .from('support_tickets')
    .update({ status: 'replied', updated_at: new Date().toISOString() })
    .eq('id', ticket.id)

  return NextResponse.json({ success: true, message })
}
