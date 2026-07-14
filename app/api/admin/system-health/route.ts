// app/api/admin/system-health/route.ts
// Admin-only real-time health checks — Supabase, Stripe, UptimeRobot, Resend, env audit

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { adminFetchAll } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

async function isAuthorized(): Promise<boolean> {
  const headersList = await headers()
  const email = headersList.get('x-user-email')?.toLowerCase()
  if (!email) return false
  if (SUPER_ADMIN_EMAILS.includes(email)) return true
  const { data } = await adminFetchAll('admin_users', `email=eq.${encodeURIComponent(email)}&select=email`)
  return data.length > 0
}

interface ServiceResult {
  name: string
  status: 'healthy' | 'degraded' | 'down' | 'unconfigured'
  message: string
  responseTimeMs?: number
  details?: Record<string, any>
}

// ── Supabase DB ───────────────────────────────────────────────────────────────
async function checkSupabaseDB(): Promise<ServiceResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { name: 'Supabase Database', status: 'unconfigured', message: 'NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set' }

  const t = Date.now()
  try {
    const res = await fetch(`${url}/rest/v1/courses?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    const ms = Date.now() - t
    if (!res.ok) return { name: 'Supabase Database', status: 'down', message: `HTTP ${res.status}`, responseTimeMs: ms }
    const rows = await res.json()
    return {
      name: 'Supabase Database',
      status: ms < 2000 ? 'healthy' : 'degraded',
      message: ms < 2000 ? 'Connected — query succeeded' : 'Connected but slow response',
      responseTimeMs: ms,
      details: { rowsReturned: rows.length, host: new URL(url).hostname },
    }
  } catch (e: any) {
    return { name: 'Supabase Database', status: 'down', message: e.message, responseTimeMs: Date.now() - t }
  }
}

// ── Supabase Auth ─────────────────────────────────────────────────────────────
async function checkSupabaseAuth(): Promise<ServiceResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { name: 'Supabase Auth', status: 'unconfigured', message: 'Missing credentials' }

  const t = Date.now()
  try {
    const res = await fetch(`${url}/auth/v1/admin/users?per_page=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    const ms = Date.now() - t
    if (!res.ok) return { name: 'Supabase Auth', status: 'down', message: `HTTP ${res.status}`, responseTimeMs: ms }
    const json = await res.json()
    return {
      name: 'Supabase Auth',
      status: 'healthy',
      message: 'Auth service operational',
      responseTimeMs: ms,
      details: { totalUsers: json.total ?? '—' },
    }
  } catch (e: any) {
    return { name: 'Supabase Auth', status: 'down', message: e.message, responseTimeMs: Date.now() - t }
  }
}

// ── Stripe Account ────────────────────────────────────────────────────────────
async function checkStripeAccount(): Promise<ServiceResult> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return { name: 'Stripe API', status: 'unconfigured', message: 'STRIPE_SECRET_KEY not set' }

  const t = Date.now()
  try {
    const res = await fetch('https://api.stripe.com/v1/account', {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    const ms = Date.now() - t
    if (!res.ok) {
      const err = await res.json()
      return { name: 'Stripe API', status: 'down', message: err?.error?.message ?? `HTTP ${res.status}`, responseTimeMs: ms }
    }
    const account = await res.json()
    return {
      name: 'Stripe API',
      status: 'healthy',
      message: 'Authenticated successfully',
      responseTimeMs: ms,
      details: {
        accountId: account.id,
        displayName: account.display_name ?? account.business_profile?.name ?? '—',
        country: account.country,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
      },
    }
  } catch (e: any) {
    return { name: 'Stripe API', status: 'down', message: e.message, responseTimeMs: Date.now() - t }
  }
}

// ── Stripe Webhooks ───────────────────────────────────────────────────────────
async function checkStripeWebhooks(): Promise<ServiceResult> {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return { name: 'Stripe Webhooks', status: 'unconfigured', message: 'STRIPE_SECRET_KEY not set' }

  const t = Date.now()
  try {
    const res = await fetch('https://api.stripe.com/v1/webhook_endpoints?limit=10', {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    const ms = Date.now() - t
    if (!res.ok) {
      const err = await res.json()
      return { name: 'Stripe Webhooks', status: 'down', message: err?.error?.message ?? `HTTP ${res.status}`, responseTimeMs: ms }
    }
    const json = await res.json()
    const webhooks: any[] = json.data ?? []
    const enabled = webhooks.filter((w: any) => w.status === 'enabled')
    const disabled = webhooks.filter((w: any) => w.status !== 'enabled')

    return {
      name: 'Stripe Webhooks',
      status: webhooks.length === 0 ? 'degraded' : disabled.length > 0 ? 'degraded' : 'healthy',
      message: webhooks.length === 0
        ? 'No webhooks registered'
        : `${enabled.length} enabled, ${disabled.length} disabled`,
      responseTimeMs: ms,
      details: {
        total: webhooks.length,
        endpoints: webhooks.map((w: any) => ({
          url: w.url,
          status: w.status,
          events: w.enabled_events?.length ?? 0,
          apiVersion: w.api_version,
        })),
      },
    }
  } catch (e: any) {
    return { name: 'Stripe Webhooks', status: 'down', message: e.message, responseTimeMs: Date.now() - t }
  }
}

// ── UptimeRobot ───────────────────────────────────────────────────────────────
async function checkUptimeRobot(): Promise<ServiceResult> {
  const apiKey = process.env.UPTIMEROBOT_API_KEY
  if (!apiKey) return {
    name: 'UptimeRobot',
    status: 'unconfigured',
    message: 'Add UPTIMEROBOT_API_KEY to .env.local to enable',
  }

  const t = Date.now()
  try {
    const res = await fetch('https://api.uptimerobot.com/v2/getMonitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ api_key: apiKey, format: 'json', response_times: '0' }).toString(),
      cache: 'no-store',
    })
    const ms = Date.now() - t
    const json = await res.json()
    if (json.stat !== 'ok') return { name: 'UptimeRobot', status: 'down', message: json.error?.message ?? 'API error', responseTimeMs: ms }

    const monitors: any[] = json.monitors ?? []
    // status: 0=paused, 1=not checked, 2=up, 8=seems down, 9=down
    const statusLabel: Record<number, string> = { 0: 'paused', 1: 'not checked', 2: 'up', 8: 'seems down', 9: 'down' }
    const up = monitors.filter((m: any) => m.status === 2)
    const down = monitors.filter((m: any) => m.status === 9 || m.status === 8)

    return {
      name: 'UptimeRobot',
      status: down.length > 0 ? 'down' : monitors.length === 0 ? 'degraded' : 'healthy',
      message: monitors.length === 0 ? 'No monitors configured' : `${up.length}/${monitors.length} monitors up`,
      responseTimeMs: ms,
      details: {
        total: monitors.length,
        monitors: monitors.map((m: any) => ({
          name: m.friendly_name,
          url: m.url,
          status: statusLabel[m.status] ?? `status ${m.status}`,
          uptimeRatio: m.all_time_uptime_ratio ? `${m.all_time_uptime_ratio}%` : '—',
        })),
      },
    }
  } catch (e: any) {
    return { name: 'UptimeRobot', status: 'down', message: e.message, responseTimeMs: Date.now() - t }
  }
}

// ── Resend Email ──────────────────────────────────────────────────────────────
async function checkResend(): Promise<ServiceResult> {
  const key = process.env.RESEND_API_KEY
  if (!key) return { name: 'Resend Email', status: 'unconfigured', message: 'RESEND_API_KEY not set' }

  const t = Date.now()
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
      cache: 'no-store',
    })
    const ms = Date.now() - t
    if (!res.ok) {
      const err = await res.json()
      return { name: 'Resend Email', status: 'down', message: err?.message ?? `HTTP ${res.status}`, responseTimeMs: ms }
    }
    const json = await res.json()
    const domains: any[] = json.data ?? []
    const verified = domains.filter((d: any) => d.status === 'verified')
    return {
      name: 'Resend Email',
      status: 'healthy',
      message: `${verified.length}/${domains.length} domains verified`,
      responseTimeMs: ms,
      details: {
        domains: domains.map((d: any) => ({ name: d.name, status: d.status, region: d.region })),
      },
    }
  } catch (e: any) {
    return { name: 'Resend Email', status: 'down', message: e.message, responseTimeMs: Date.now() - t }
  }
}

// ── Environment Audit ─────────────────────────────────────────────────────────
function checkEnvVars(): ServiceResult {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ]
  const optional = ['RESEND_API_KEY', 'UPTIMEROBOT_API_KEY', 'NEXT_PUBLIC_SITE_URL']

  const missing = required.filter(k => !process.env[k])
  const optionalStatus = optional.map(k => ({ key: k, set: !!process.env[k] }))

  return {
    name: 'Environment Variables',
    status: missing.length === 0 ? 'healthy' : 'down',
    message: missing.length === 0 ? 'All required variables present' : `Missing: ${missing.join(', ')}`,
    details: {
      required: required.map(k => ({ key: k, set: !!process.env[k] })),
      optional: optionalStatus,
    },
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const started = Date.now()

  // Run all checks in parallel
  const [supabaseDB, supabaseAuth, stripeAccount, stripeWebhooks, uptimeRobot, resend] =
    await Promise.all([
      checkSupabaseDB(),
      checkSupabaseAuth(),
      checkStripeAccount(),
      checkStripeWebhooks(),
      checkUptimeRobot(),
      checkResend(),
    ])

  const envVars = checkEnvVars()

  const services = [supabaseDB, supabaseAuth, stripeAccount, stripeWebhooks, uptimeRobot, resend, envVars]

  const overallStatus =
    services.some(s => s.status === 'down') ? 'unhealthy' :
    services.some(s => s.status === 'degraded') ? 'degraded' : 'healthy'

  return NextResponse.json({
    overallStatus,
    checkedAt: new Date().toISOString(),
    totalMs: Date.now() - started,
    services,
  })
}
