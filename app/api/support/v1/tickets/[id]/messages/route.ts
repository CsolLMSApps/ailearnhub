// app/api/support/v1/tickets/[id]/messages/route.ts
// POST — send a reply to the user, or add an internal note (type: reply | note)
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'
import { withNexusAuth, nexusError } from '@/lib/nexus-auth'
import { adminFetch, adminInsert } from '@/lib/supabase/admin'
import { toNexusMessage } from '@/lib/nexus-mappers'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type RouteContext = { params: Promise<{ id: string }> }

export const POST = withNexusAuth<RouteContext>(async (request, auth, context) => {
  const { id } = await context.params
  const idempotencyKey = request.headers.get('idempotency-key')
  const path = request.nextUrl.pathname

  // ── Idempotent replay (spec §6) ─────────────────────────────────────────
  if (idempotencyKey && auth.apiKeyId) {
    const { data: existing } = await adminFetch(
      'nexus_idempotency_keys',
      `api_key_id=eq.${auth.apiKeyId}&idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&path=eq.${encodeURIComponent(path)}&select=status_code,response_body&limit=1`
    )
    if (existing) {
      return NextResponse.json(existing.response_body, { status: existing.status_code })
    }
  }

  const body = await request.json().catch(() => ({}))
  const { type, body_text } = body as { type?: string; body_text?: string }

  if (!body_text?.trim()) return nexusError(400, 'bad_request', 'body_text is required')
  if (!type || !['reply', 'note'].includes(type)) {
    return nexusError(400, 'bad_request', "type must be 'reply' or 'note'")
  }

  const { data: ticket, error: ticketErr } = await adminFetch(
    'support_tickets',
    `id=eq.${id}&select=id,ticket_number,name,email,subject&limit=1`
  )
  if (ticketErr) return nexusError(500, 'server_error', ticketErr.message)
  if (!ticket) return nexusError(404, 'not_found', 'Ticket not found')

  // 'reply' is sent to the user by email, in the existing ticket thread;
  // 'note' is internal-only and never emailed (per spec's Message shape).
  if (type === 'reply') {
    const { error: emailErr } = await resend.emails.send({
      from: 'AI Learn Hub Support <noreply@ailearnhub.io>',
      to: ticket.email,
      replyTo: 'support@ailearnhub.io',
      subject: `Re: [${ticket.ticket_number}] ${ticket.subject}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <p>Hi ${ticket.name},</p>
        <div style="background:#f9f9f9;border:1px solid #e0e0e0;border-radius:6px;padding:16px">
          ${body_text.trim().replace(/\n/g, '<br>')}
        </div>
        <p style="color:#9e9e9e;font-size:12px">Reference: ${ticket.ticket_number} · via Application Nexus (agent ${auth.agentId})</p>
      </div>`,
    })
    if (emailErr) return nexusError(502, 'server_error', 'Failed to send reply email')
  }

  const { data: message, error: msgErr } = await adminInsert('ticket_messages', {
    ticket_id: ticket.id,
    direction: type === 'reply' ? 'outbound' : 'outbound', // notes are also staff-authored
    type,
    sender_name: `Nexus agent ${auth.agentId}`,
    sender_email: 'support@ailearnhub.io',
    body: body_text.trim(),
  })
  if (msgErr) return nexusError(500, 'server_error', msgErr.message)

  if (type === 'reply') {
    await supabaseAdmin
      .from('support_tickets')
      .update({ status: 'replied', updated_at: new Date().toISOString() })
      .eq('id', ticket.id)
  }

  const responseBody = { message: toNexusMessage(message) }

  if (idempotencyKey && auth.apiKeyId) {
    await adminInsert('nexus_idempotency_keys', {
      api_key_id: auth.apiKeyId,
      idempotency_key: idempotencyKey,
      path,
      status_code: 201,
      response_body: responseBody,
    }).catch(() => {}) // best-effort; a duplicate race just means both succeed once each
  }

  return NextResponse.json(responseBody, { status: 201 })
})