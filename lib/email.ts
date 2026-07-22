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
  passwordSetupUrl: string,
  courseName?: string
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your AI Learn Hub account is ready! 🎉',
      text: `
Hi there!

Your payment was successful${courseName ? ` for "${courseName}"` : ''}.

Your AI Learn Hub account has been created. Click the link below to set your password and start learning:

${passwordSetupUrl}

This link expires in 24 hours. Once you set your password, you can log in any time at:
${process.env.NEXT_PUBLIC_SITE_URL}/login

If you have any questions, just reply to this email.

Best regards,
The AI Learn Hub Team
      `.trim(),
    })
  } catch (error) {
    console.error('Failed to send account setup email:', error)
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
