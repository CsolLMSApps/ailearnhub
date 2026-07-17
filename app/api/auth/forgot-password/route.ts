// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if this email exists in Supabase auth
    const { data: users } = await supabase.auth.admin.listUsers()
    const userExists = users?.users?.some(u => u.email === email)

    // Always return success even if user not found (security best practice)
    if (!userExists) {
      return NextResponse.json({ success: true })
    }

    // Delete any existing unused OTPs for this email
    await supabase
      .from('password_reset_otps')
      .delete()
      .eq('email', email)
      .eq('used', false)

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store OTP in DB
    const { error: insertError } = await supabase
      .from('password_reset_otps')
      .insert({ email, otp, expires_at: expiresAt.toISOString() })

    if (insertError) {
      console.error('OTP insert error:', insertError)
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 })
    }

    // Send OTP email via Resend
    const { error: emailError } = await resend.emails.send({
      from: 'AI Learn Hub <noreply@ailearnhub.io>',
      to: email,
      subject: `${otp} is your AI Learn Hub password reset code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; background: #f9fafb; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; border:1px solid #e5e7eb; overflow:hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background:#FF6F00; padding:24px 32px; text-align:center;">
                      <p style="margin:0; color:#ffffff; font-size:20px; font-weight:bold; letter-spacing:1px;">AILearnHub.IO</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:32px;">
                      <h2 style="margin:0 0 8px; color:#111827; font-size:22px;">Password Reset Code</h2>
                      <p style="color:#6b7280; margin:0 0 28px; font-size:15px;">
                        We received a request to reset the password for your account. Use the code below — it expires in <strong>10 minutes</strong>.
                      </p>

                      <!-- OTP Box -->
                      <div style="background:#fff7ed; border:2px dashed #FF6F00; border-radius:12px; padding:24px; text-align:center; margin-bottom:28px;">
                        <p style="margin:0 0 4px; color:#9ca3af; font-size:12px; text-transform:uppercase; letter-spacing:2px;">Your reset code</p>
                        <p style="margin:0; color:#FF6F00; font-size:40px; font-weight:bold; letter-spacing:12px;">${otp}</p>
                      </div>

                      <p style="color:#6b7280; font-size:14px; margin:0 0 8px;">
                        Enter this code on the AI Learn Hub website to reset your password.
                      </p>
                      <p style="color:#9ca3af; font-size:13px; margin:0;">
                        If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="padding:16px 32px; border-top:1px solid #f3f4f6; text-align:center;">
                      <p style="margin:0; color:#9ca3af; font-size:12px;">© ${new Date().getFullYear()} AILearnHub.IO · All rights reserved</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `Your AI Learn Hub password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, ignore this email.`,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
