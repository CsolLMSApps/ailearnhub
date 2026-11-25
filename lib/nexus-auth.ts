// lib/nexus-auth.ts
//
// Auth + audit for the Application Nexus Support API (see
// "Application Nexus: Integration Spec for App Teams", §2 and §7).
//
// Key design:
//  - The Nexus sends  Authorization: Bearer <key>  and  X-Nexus-Agent: <support person id>
//  - We never store the plaintext key — only sha256(key) in nexus_api_keys.key_hash.
//  - Every call is logged to nexus_audit_log with the agent id, so actions can
//    be traced to a person (spec §7).
//  - Scope is checked against the 'support' scope; the key cannot be used for
//    anything else because no other route reads nexus_api_keys.

import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminFetch, adminFetchAll } from '@/lib/supabase/admin'

const KEY_BYTES = 32 // 256 bits of entropy

export type NexusEnvironment = 'staging' | 'production'

/** Generates a new plaintext key + its hash. Call once per key; show the
 *  plaintext to the operator exactly once, then discard it — only the hash
 *  is ever persisted. */
export function generateNexusApiKey(environment: NexusEnvironment) {
  const envTag = environment === 'production' ? 'live' : 'test'
  const secret = randomBytes(KEY_BYTES).toString('base64url')
  const plaintext = `nexus_${envTag}_${secret}`
  const keyHash = hashNexusApiKey(plaintext)
  const keyPrefix = plaintext.slice(0, 16) // safe to log/display, not reversible to the secret
  return { plaintext, keyHash, keyPrefix }
}

export function hashNexusApiKey(plaintext: string): string {
  return createHash('sha256').update(plaintext).digest('hex')
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'hex')
  const bufB = Buffer.from(b, 'hex')
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export interface NexusAuthResult {
  ok: boolean
  status: number
  error?: { code: string; message: string }
  apiKeyId?: string
  environment?: NexusEnvironment
  agentId?: string
}

/**
 * Validates the Authorization header + X-Nexus-Agent header against
 * nexus_api_keys. Does NOT write the audit row itself — call
 * logNexusRequest() after the response is known, from the route handler,
 * so the real status code is recorded.
 */
export async function verifyNexusAuth(request: NextRequest): Promise<NexusAuthResult> {
  const authHeader = request.headers.get('authorization') || ''
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!match) {
    return { ok: false, status: 401, error: { code: 'unauthorized', message: 'Missing Authorization: Bearer <key> header' } }
  }
  const plaintext = match[1].trim()

  const agentId = request.headers.get('x-nexus-agent')
  if (!agentId) {
    return { ok: false, status: 400, error: { code: 'bad_request', message: 'Missing X-Nexus-Agent header' } }
  }

  const keyHash = hashNexusApiKey(plaintext)

  // Look up by hash. We still compare with timingSafeEqual below in case a
  // future lookup strategy ever returns more than an exact match.
  const { data: row, error } = await adminFetch(
    'nexus_api_keys',
    `key_hash=eq.${keyHash}&select=id,key_hash,environment,scopes,revoked_at&limit=1`
  )

  if (error || !row || !safeEqualHex(row.key_hash, keyHash)) {
    return { ok: false, status: 401, error: { code: 'bad_key', message: 'Invalid API key' } }
  }

  if (row.revoked_at) {
    return { ok: false, status: 401, error: { code: 'bad_key', message: 'This API key has been revoked' } }
  }

  const scopes: string[] = row.scopes ?? []
  if (!scopes.includes('support')) {
    return { ok: false, status: 403, error: { code: 'forbidden', message: 'Key is not scoped for support access' } }
  }

  return { ok: true, status: 200, apiKeyId: row.id, environment: row.environment, agentId }
}

/** Fire-and-forget audit log write + best-effort last_used_at bump. */
export async function logNexusRequest(params: {
  apiKeyId?: string
  agentId?: string
  method: string
  path: string
  statusCode: number
  ip?: string | null
}) {
  const { adminInsert } = await import('@/lib/supabase/admin')
  try {
    await adminInsert('nexus_audit_log', {
      api_key_id: params.apiKeyId ?? null,
      agent_id: params.agentId ?? null,
      method: params.method,
      path: params.path,
      status_code: params.statusCode,
      ip: params.ip ?? null,
    })
    if (params.apiKeyId) {
      // best-effort — not critical if this fails
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/nexus_api_keys?id=eq.${params.apiKeyId}`, {
        method: 'PATCH',
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ last_used_at: new Date().toISOString() }),
      })
    }
  } catch {
    // Audit logging must never break the actual request.
  }
}

/** Standard error body shape required by spec §6. */
export function nexusError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status })
}

/**
 * Wraps a Support API route handler with auth + audit logging in one call.
 * Usage:
 *   export const GET = withNexusAuth(async (req, auth) => { ... })
 */
export function withNexusAuth<Ctx = unknown>(
  handler: (request: NextRequest, auth: NexusAuthResult, context: Ctx) => Promise<NextResponse>
) {
  return async (request: NextRequest, context: Ctx) => {
    const auth = await verifyNexusAuth(request)
    let response: NextResponse

    if (!auth.ok) {
      response = NextResponse.json({ error: auth.error }, { status: auth.status })
    } else {
      response = await handler(request, auth, context)
    }

    await logNexusRequest({
      apiKeyId: auth.apiKeyId,
      agentId: auth.agentId,
      method: request.method,
      path: request.nextUrl.pathname,
      statusCode: response.status,
      ip: request.headers.get('x-forwarded-for'),
    })

    return response
  }
}