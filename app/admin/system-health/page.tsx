'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

interface ServiceResult {
  name: string
  status: 'healthy' | 'degraded' | 'down' | 'unconfigured'
  message: string
  responseTimeMs?: number
  details?: Record<string, any>
}
interface HealthData {
  overallStatus: 'healthy' | 'degraded' | 'unhealthy'
  checkedAt: string
  totalMs: number
  services: ServiceResult[]
}

const SERVICE_META: Record<string, { icon: string; color: string; bg: string }> = {
  'Supabase Database': { icon: '🗄️', color: '#3ECF8E', bg: '#f0fdf8' },
  'Supabase Auth':     { icon: '🔐', color: '#3ECF8E', bg: '#f0fdf8' },
  'Stripe API':        { icon: '💳', color: '#635BFF', bg: '#f5f4ff' },
  'Stripe Webhooks':   { icon: '🔔', color: '#7C5BF7', bg: '#f7f5ff' },
  'UptimeRobot':       { icon: '📡', color: '#0ea5e9', bg: '#f0f9ff' },
  'Resend Email':      { icon: '✉️', color: '#FF6C37', bg: '#fff6f3' },
  'Environment Variables': { icon: '⚙️', color: '#f59e0b', bg: '#fffbeb' },
}

const STATUS = {
  healthy:      { label: 'Healthy',    color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', dot: '#22c55e' },
  degraded:     { label: 'Degraded',   color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b' },
  down:         { label: 'Down',       color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '#ef4444' },
  unconfigured: { label: 'Not Set Up', color: '#64748b', bg: '#f8fafc', border: '#e2e8f0', dot: '#94a3b8' },
}

/* ── Latency bar ── */
function LatencyBar({ ms, color }: { ms: number; color: string }) {
  const pct = Math.min(100, Math.round((ms / 1000) * 100))
  const label = ms < 300 ? 'Fast' : ms < 700 ? 'Moderate' : 'Slow'
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">Response time</span>
        <span className="text-xs font-semibold" style={{ color }}>{ms}ms · {label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
    </div>
  )
}

/* ── Sparkline ── */
function Sparkline({ history, color }: { history: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d'); if (!ctx) return
    const W = c.width, H = c.height
    ctx.clearRect(0, 0, W, H)
    if (history.length < 2) return
    const max = Math.max(...history, 1)
    const pts = history.map((v, i) => ({ x: (i / (history.length - 1)) * W, y: H - (v / max) * H * 0.85 }))
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, color + '33'); grad.addColorStop(1, color + '00')
    ctx.beginPath()
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()
    ctx.beginPath()
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke()
  }, [history, color])
  return <canvas ref={ref} width={72} height={24} className="opacity-80" />
}

/* ── Detail section ── */
function ServiceDetails({ svc }: { svc: ServiceResult }) {
  const d = svc.details
  if (!d) return null

  if (svc.name === 'Environment Variables') {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Required</p>
          <div className="space-y-1">
            {(d.required ?? []).map((v: any) => (
              <div key={v.key} className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-600">{v.key}</span>
                <span className={`font-semibold ${v.set ? 'text-green-600' : 'text-red-500'}`}>
                  {v.set ? '✓ Set' : '✗ Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Optional</p>
          <div className="space-y-1">
            {(d.optional ?? []).map((v: any) => (
              <div key={v.key} className="flex items-center justify-between text-xs">
                <span className="font-mono text-gray-500">{v.key}</span>
                <span className={`font-semibold ${v.set ? 'text-green-600' : 'text-gray-400'}`}>
                  {v.set ? '✓ Set' : '○ Not set'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (svc.name === 'Supabase Database') {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Host</p>
          <p className="text-xs font-semibold text-gray-700 truncate">{d.host ?? '—'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Rows returned</p>
          <p className="text-xs font-semibold text-gray-700">{d.rowsReturned ?? 0}</p>
        </div>
      </div>
    )
  }

  if (svc.name === 'Supabase Auth') {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-xs text-gray-400">Total registered users</p>
          <p className="text-sm font-bold text-gray-800">{d.totalUsers ?? '—'}</p>
        </div>
      </div>
    )
  }

  if (svc.name === 'Stripe API') {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        {Object.entries(d).map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-400">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-xs font-semibold text-gray-700">{String(v)}</p>
          </div>
        ))}
      </div>
    )
  }

  if (svc.name === 'Stripe Webhooks' && Array.isArray(d.endpoints)) {
    if (d.endpoints.length === 0) return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">No webhooks registered.</p>
      </div>
    )
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        {d.endpoints.map((ep: any, i: number) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
            <div className="min-w-0">
              <p className="font-mono text-xs text-gray-700 truncate">{ep.url}</p>
              <p className="text-xs text-gray-400 mt-0.5">{ep.events} events · v{ep.apiVersion}</p>
            </div>
            <span className={`ml-2 shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${ep.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {ep.status}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (svc.name === 'UptimeRobot' && Array.isArray(d.monitors)) {
    if (d.monitors.length === 0) return (
      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-400">No monitors configured.</p>
      </div>
    )
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        {d.monitors.map((m: any, i: number) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-700">{m.name}</p>
              <p className="font-mono text-xs text-gray-400 truncate">{m.url}</p>
            </div>
            <div className="text-right shrink-0">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${m.status === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {m.status}
              </span>
              <p className="text-xs text-gray-400 mt-1">↑ {m.uptimeRatio}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (svc.name === 'Resend Email' && Array.isArray(d.domains)) {
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        {d.domains.map((dm: any, i: number) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700">{dm.name}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${dm.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {dm.status}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

/* ── Service card ── */
function ServiceCard({ svc, history }: { svc: ServiceResult; history: number[] }) {
  const [open, setOpen] = useState(false)
  const meta   = SERVICE_META[svc.name] ?? { icon: '🔧', color: '#94a3b8', bg: '#f8fafc' }
  const st     = STATUS[svc.status]
  const hasDetails = !!svc.details && Object.keys(svc.details).length > 0

  return (
    <div
      onClick={() => hasDetails && setOpen(v => !v)}
      className={`bg-white rounded-2xl border p-5 transition-all duration-200 ${hasDetails ? 'cursor-pointer hover:shadow-md' : ''}`}
      style={{ borderColor: open ? meta.color + '40' : '#e5e7eb', boxShadow: open ? `0 0 0 2px ${meta.color}20` : undefined }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: meta.bg }}>
            {meta.icon}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-tight">{svc.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">{svc.message}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{ color: st.color, background: st.bg, borderColor: st.border }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.dot }} />
            {st.label}
          </span>
          {hasDetails && (
            <span className="text-xs text-gray-300">{open ? '▲ less' : '▼ more'}</span>
          )}
        </div>
      </div>

      {/* Latency + sparkline */}
      {svc.responseTimeMs != null && (
        <div className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <LatencyBar ms={svc.responseTimeMs} color={meta.color} />
          </div>
          {history.length >= 2 && <Sparkline history={history} color={meta.color} />}
        </div>
      )}

      {/* Details */}
      {open && <ServiceDetails svc={svc} />}
    </div>
  )
}

/* ── Page ── */
export default function SystemHealthPage() {
  const [data,        setData]        = useState<HealthData | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [countdown,   setCountdown]   = useState(30)
  const historyRef = useRef<Record<string, number[]>>({})

  const doFetch = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/admin/system-health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status}`)
      const json: HealthData = await res.json()
      json.services.forEach(s => {
        if (s.responseTimeMs == null) return
        if (!historyRef.current[s.name]) historyRef.current[s.name] = []
        historyRef.current[s.name]!.push(s.responseTimeMs)
        if (historyRef.current[s.name]!.length > 20) historyRef.current[s.name]!.shift()
      })
      setData(json)
      setLastChecked(new Date())
      setCountdown(30)
    } catch { /* keep last */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { doFetch() }, [doFetch])
  useEffect(() => {
    const r = setInterval(doFetch, 30_000)
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
    return () => { clearInterval(r); clearInterval(t) }
  }, [doFetch])

  const overall   = data?.overallStatus ?? 'healthy'
  const ost       = overall === 'healthy' ? STATUS.healthy : overall === 'degraded' ? STATUS.degraded : STATUS.down
  const mainLabel = overall === 'healthy' ? 'All Systems Operational' : overall === 'degraded' ? 'Partial Degradation' : 'Issues Detected'

  const healthy      = data?.services.filter(s => s.status === 'healthy').length ?? 0
  const degraded     = data?.services.filter(s => s.status === 'degraded').length ?? 0
  const down         = data?.services.filter(s => s.status === 'down').length ?? 0
  const unconfigured = data?.services.filter(s => s.status === 'unconfigured').length ?? 0

  const needsUptimeRobot = data?.services.find(s => s.name === 'UptimeRobot' && s.status === 'unconfigured')

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time status of all connected services</p>
        </div>
        <div className="flex items-center gap-3">
          {lastChecked && (
            <span className="text-xs text-gray-400">
              Last checked {lastChecked.toLocaleTimeString()} · refresh in <span className="font-mono font-semibold text-gray-600">{countdown}s</span>
            </span>
          )}
          <button
            onClick={doFetch}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors shadow-sm"
          >
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Scanning…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Overall status banner ── */}
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        style={{ background: ost.bg, border: `1.5px solid ${ost.border}` }}
      >
        <div className="flex items-center gap-3">
          <div className="relative w-3 h-3 shrink-0">
            <span className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ background: ost.dot }} />
            <span className="relative block w-3 h-3 rounded-full" style={{ background: ost.dot }} />
          </div>
          <div>
            <p className="font-bold text-base" style={{ color: ost.color }}>{loading ? 'Scanning services…' : mainLabel}</p>
            {data && <p className="text-xs mt-0.5" style={{ color: ost.color + 'aa' }}>Scan completed in {data.totalMs}ms · {data.services.length} services checked</p>}
          </div>
        </div>

        {/* Summary pills */}
        {data && (
          <div className="flex items-center gap-2 flex-wrap">
            {healthy > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />{healthy} Healthy
              </span>
            )}
            {degraded > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />{degraded} Degraded
              </span>
            )}
            {down > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-red-100 text-red-700">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />{down} Down
              </span>
            )}
            {unconfigured > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />{unconfigured} Not Set Up
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── UptimeRobot setup guide ── */}
      {needsUptimeRobot && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
          <div className="flex items-start gap-3">
            <span className="text-xl shrink-0">📡</span>
            <div>
              <p className="font-semibold text-sky-800 text-sm">Connect UptimeRobot for uptime monitoring</p>
              <p className="text-xs text-sky-600 mt-1 mb-3">
                UptimeRobot monitors your site 24/7 and alerts you when it goes down. Add your API key to see live monitor data here.
              </p>
              <ol className="text-xs text-sky-700 space-y-1.5 list-decimal list-inside">
                <li>Go to <a href="https://uptimerobot.com" target="_blank" rel="noopener" className="underline font-semibold">uptimerobot.com</a> and sign in (free account)</li>
                <li>Click <strong>My Settings</strong> → scroll to <strong>API Settings</strong></li>
                <li>Copy your <strong>Main API Key</strong></li>
                <li>In Vercel → Project → Settings → Environment Variables, add: <code className="bg-sky-100 px-1.5 py-0.5 rounded font-mono">UPTIMEROBOT_API_KEY</code></li>
                <li>Redeploy — UptimeRobot data will appear here automatically</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* ── Service cards ── */}
      {loading && !data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse h-28" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-2.5 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(data?.services ?? []).map(svc => (
            <ServiceCard
              key={svc.name}
              svc={svc}
              history={historyRef.current[svc.name] ?? []}
            />
          ))}
        </div>
      )}

      {/* ── Footer note ── */}
      {data && (
        <div className="flex items-center justify-center gap-2 pt-2 pb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">
            Live monitoring · auto-refreshes every 30s · {data.services.length} services
          </span>
        </div>
      )}
    </div>
  )
}
