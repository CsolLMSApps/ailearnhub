import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = `AI Learn Hub <noreply@ailearnhub.io>`

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to AI Learn Hub! 🚀',
      text: `
Hi ${name},

Welcome to AI Learn Hub! We're excited to have you join our community of AI learners.

Start exploring our courses and begin your AI journey today:
${process.env.NEXT_PUBLIC_SITE_URL}/marketing/courses

If you have any questions, just reply to this email.

Best regards,
The AI Learn Hub Team
      `,
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

export async function sendPurchaseConfirmation(
  email: string,
  name: string,
  courseTitle: string,
  courseId: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Your course is ready: ${courseTitle}`,
      text: `
Hi ${name},

Thank you for your purchase! You now have lifetime access to "${courseTitle}".

Start learning now:
${process.env.NEXT_PUBLIC_SITE_URL}/learn/${courseId}

Your purchase includes:
✓ Lifetime access to all course materials
✓ Downloadable resources and templates
✓ Certificate of completion

If you have any questions, just reply to this email.

Best regards,
The AI Learn Hub Team
      `,
    })
  } catch (error) {
    console.error('Failed to send purchase confirmation:', error)
  }
}

export async function sendAccountSetupEmail(
  email: string,
  accessUrl: string,
  courseName?: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your AI Learn Hub course is ready! 🎉',
      text: `
Hi there!

Your payment was successful${courseName ? ` for "${courseName}"` : ''}. Your account has been created.

Click the link below to access your course — no password needed, you'll be logged in automatically:

${accessUrl}

This link expires in 24 hours. Once you're in your dashboard, you'll see a notification to set a password so you can log in anytime.

If you have any questions, just reply to this email.

Best regards,
The AI Learn Hub Team
      `.trim(),
    })
  } catch (error) {
    console.error('Failed to send account setup email:', error)
  }
}

export async function sendPasswordSetupEmail(email: string, setupUrl: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Set your AI Learn Hub password',
      text: `
Hi there!

You requested a link to set your password for AI Learn Hub.

Click the link below to create your password:

${setupUrl}

This link expires in 24 hours.

If you didn't request this, you can ignore this email.

Best regards,
The AI Learn Hub Team
      `.trim(),
    })
  } catch (error) {
    console.error('Failed to send password setup email:', error)
  }
}

export async function sendSetupReminderEmail(email: string, setupUrl: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Set up your AI Learn Hub account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #212121;">
          <div style="background: #FF6F00; padding: 24px 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">
              AI LEARN HUB
            </h1>
          </div>
          <div style="background: #ffffff; padding: 32px; border: 1px solid #E0E0E0; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 20px; font-weight: 700; color: #212121; margin: 0 0 12px;">
              Your course is waiting for you 🎓
            </h2>
            <p style="color: #616161; line-height: 1.6; margin: 0 0 20px;">
              You purchased a course on AI Learn Hub but haven't set up your account yet.
              It only takes 2 minutes — add your name and create a password so you can
              log in anytime and pick up where you left off.
            </p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${setupUrl}"
                 style="display: inline-block; background: #FF6F00; color: #ffffff;
                        text-decoration: none; font-weight: 700; font-size: 15px;
                        padding: 14px 32px; border-radius: 8px;">
                Set Up My Account →
              </a>
            </div>
            <p style="color: #9E9E9E; font-size: 12px; line-height: 1.5; margin: 20px 0 0; text-align: center;">
              This link expires in 24 hours. After that, visit
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/login" style="color: #FF6F00;">ailearnhub.io</a>
              and log in with this email address to set up your account from your dashboard.
            </p>
          </div>
        </div>
      `,
      text: `
Your course is waiting for you!

You purchased a course on AI Learn Hub but haven't set up your account yet.
It only takes 2 minutes — add your name and create a password.

Set up your account here:
${setupUrl}

This link expires in 24 hours. After that, go to ${process.env.NEXT_PUBLIC_SITE_URL}/login and log in with this email address.

Best regards,
The AI Learn Hub Team
      `.trim(),
    })
  } catch (error) {
    console.error('Failed to send setup reminder email:', error)
  }
}

export async function sendCertificateEmail(
  email: string,
  name: string,
  courseTitle: string,
  certificateUrl: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🎉 Congratulations! Your certificate is ready`,
      text: `
Hi ${name},

Congratulations on completing "${courseTitle}"!

Your certificate of completion is ready. Download it here:
${certificateUrl}

Share your achievement on LinkedIn to showcase your new skills!

Keep learning,
The AI Learn Hub Team
      `,
    })
  } catch (error) {
    console.error('Failed to send certificate email:', error)
  }
}
