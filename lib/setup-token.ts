// lib/setup-token.ts
// Self-contained HMAC token for the account setup email link.
// Uses the service role key as the signing secret (already server-only).
// 24-hour expiry. Distinguishes expired vs invalid so the UI can show the right message.

import { createHmac } from 'crypto'

const secret = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

export type TokenResult =
  | { status: 'valid'; userId: string; email: string }
  | { status: 'expired' }
  | { status: 'invalid' }

export function generateSetupToken(userId: string, email: string): string {
  const payload = {
    userId,
    email,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = createHmac('sha256', secret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

export function verifySetupToken(token: string): TokenResult {
  try {
    const [data, sig] = token.split('.')
    if (!data || !sig) return { status: 'invalid' }
    const expectedSig = createHmac('sha256', secret()).update(data).digest('base64url')
    if (sig !== expectedSig) return { status: 'invalid' }
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString())
    if (!payload.userId || !payload.email || !payload.exp) return { status: 'invalid' }
    if (Date.now() > payload.exp) return { status: 'expired' }
    return { status: 'valid', userId: payload.userId, email: payload.email }
  } catch {
    return { status: 'invalid' }
  }
}
