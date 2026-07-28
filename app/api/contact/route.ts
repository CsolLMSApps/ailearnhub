// app/api/contact/route.ts
// Handles the public contact form.
// 1. Sends notification email to support@ailearnhub.io
// 2. Sends confirmation email to the user
// 3. Saves the ticket + first message to Supabase for admin panel

import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // ── 1. Save ticket to Supabase ───────────────────────────
    const { data: ticket, error: ticketErr } = await supabaseAdmin
      .from('support_tickets')
      .insert({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject.trim() })
      .select('id, ticket_number')
      .single()

    if (ticketErr || !ticket) {
      console.error('Failed to create support ticket:', ticketErr)
      // Don't block the user — still send email even if DB fails
    }

    // Save first message
    if (ticket) {
      await supabaseAdmin.from('ticket_messages').insert({
        ticket_id:    ticket.id,
        direction:    'inbound',
        sender_name:  name.trim(),
        sender_email: email.trim().toLowerCase(),
        body:         message.trim(),
      })
    }

    const ticketRef = ticket?.ticket_number ?? ''

    // ── 2. Send notification email to support ────────────────
    await resend.emails.send({
      from:    'AI Learn Hub Contact <noreply@ailearnhub.io>',
      to:      'support@ailearnhub.io',
      replyTo: email,
      subject: `[${ticketRef}] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#FF6F00;padding:20px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0">New Support Ticket</h2>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0">${ticketRef}</p>
          </div>
          <div style="background:#f9f9f9;padding:20px;border:1px solid #e0e0e0;border-top:none">
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background:white;border:1px solid #e0e0e0;border-radius:6px;padding:16px;margin-top:8px">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr style="margin:20px 0;border:none;border-top:1px solid #e0e0e0">
            <p style="color:#757575;font-size:13px">
              Reply directly from the admin panel at <a href="https://ailearnhub.io/admin/support">ailearnhub.io/admin/support</a>
            </p>
          </div>
        </div>
      `,
    })

    // ── 3. Send confirmation email to user ───────────────────
    await resend.emails.send({
      from:    'AI Learn Hub Support <noreply@ailearnhub.io>',
      to:      email,
      subject: `We received your message${ticketRef ? ` [${ticketRef}]` : ''}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#FF6F00;padding:20px;border-radius:8px 8px 0 0">
            <h2 style="color:white;margin:0">Message Received</h2>
          </div>
          <div style="background:#f9f9f9;padding:20px;border:1px solid #e0e0e0;border-top:none">
            <p>Hi ${name},</p>
            <p>We've received your message and will get back to you within 24 hours.</p>
            ${ticketRef ? `<p style="color:#757575;font-size:13px">Reference: <strong>${ticketRef}</strong></p>` : ''}
            <p><strong>Your message:</strong></p>
            <div style="background:white;border:1px solid #e0e0e0;border-radius:6px;padding:16px">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr style="margin:20px 0;border:none;border-top:1px solid #e0e0e0">
            <p>Best regards,<br><strong>The AI Learn Hub Team</strong></p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, ticketNumber: ticketRef })

  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
