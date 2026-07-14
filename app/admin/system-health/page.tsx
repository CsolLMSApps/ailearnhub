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

const STATUS = {
  healthy:      { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)',   label: 'Healthy',       glow: '0 0 20px rgba(34,197,94,0.3)' },
  degraded:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  label: 'Degraded',      glow: '0 0 20px rgba(245,158,11,0.3)' },
  down:         { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   label: 'Down',          glow: '0 0 20px rgba(239,68,68,0.3)' },
  unconfigured: { color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.2)', label: 'Not Set Up',    glow: 'none' },
}

const SERVICE_ICONS: Record<string, string> = {
  'Supabase Database': '🗄️',
  'Supabase Auth': '🔐',
  'Stripe API': '💳',
  'Stripe Webhooks': '🔔',
  'UptimeRobot': '📡',
  'Resend Email': '✉️',
  'Environment Variables': '⚙️',
}

// ── Animated SVG wave ─────────────────────────────────────────────────────────
function Wave({ color, opacity = 0.15, delay = 0, duration = 8 }: { color: string; opacity?: number; delay?: number; duration?: number }) {
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full absolute inset-0" style={{ animationDelay: `${delay}s` }}>
      <path
        d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
        fill={color}
        fillOpacity={opacity}
        style={{
          animation: `wave ${duration}s ease-in-out infinite alternate`,
          transformOrigin: 'center bottom',
        }}
      />
    </svg>
  )
}

// ── Pulsing status ring ───────────────────────────────────────────────────────
function StatusRing({ status, size = 48 }: { status: keyof typeof STATUS; size?: number }) {
  const cfg = STATUS[status]
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {status !== 'unconfigured' && (
        <>
          <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: cfg.color, opacity: 0.2 }} />
          <div className="absolute inset-1 rounded-full animate-pulse" style={{ backgroundColor: cfg.color, opacity: 0.15 }} />
        </>
      )}
      <div className="relative rounded-full flex items-center justify-center" style={{ width: size * 0.6, height: size * 0.6, backgroundColor: cfg.color, boxShadow: cfg.glow }}>
        <div className="rounded-full bg-white" style={{ width: size * 0.22, height: size * 0.22 }} />
      </div>
    </div>
  )
}

// ── Latency bar ───────────────────────────────────────────────────────────────
function LatencyBar({ ms, maxMs = 1000 }: { ms: number; maxMs?: number }) {
  const pct = Math.min(100, (ms / maxMs) * 100)
  const color = ms < 200 ? '#22c55e' : ms < 500 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-mono tabular-nums" style={{ color }}>{ms}ms</span>
    </div>
  )
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (ref.current) clearInterval(ref.current)
    const step = Math.ceil(value / 20)
    let cur = 0
    ref.current = setInterval(() => {
      cur = Math.min(cur + step, value)
      setDisplay(cur)
      if (cur >= value && ref.current) clearInterval(ref.current)
    }, 30)
    return () => { if (ref.current) clearInterval(ref.current) }
  }, [value])
  return <>{display}</>
}

// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({ service, index }: { service: ServiceResult; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS[service.status]
  const hasDetails = !!service.details && Object.keys(service.details).length > 0
  const icon = SERVICE_ICONS[service.name] ?? '🔧'

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: `linear-gradient(135deg, ${cfg.bg} 0%, rgba(255,255,255,0.03) 100%)`,
        border: `1px solid ${cfg.border}`,
        boxShadow: expanded ? cfg.glow : 'none',
        animationDelay: `${index * 80}ms`,
      }}
    >
      <div
        className={`flex items-center gap-4 px-5 py-4 ${hasDetails ? 'cursor-pointer' : ''}`}
        onClick={() => hasDetails && setExpanded(v => !v)}
      >
        {/* Icon + ring */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cfg.color}18` }}>
            {icon}
          </div>
          <div className="absolute -bottom-1 -right-1">
            <StatusRing status={service.status} size={18} />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm">{service.name}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: `${cfg.color}cc` }}>{service.message}</p>
        </div>

        {/* Right side */}
        <div className="shrink-0 flex flex-col items-end gap-1.5">
          {service.responseTimeMs !== undefined && (
            <LatencyBar ms={service.responseTimeMs} />
          )}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}>
              {cfg.label}
            </span>
            {hasDetails && (
              <span className="text-xs" style={{ color: `${cfg.color}88` }}>{expanded ? '▲' : '▼'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && service.details && (
        <div className="border-t px-5 py-4 space-y-3 text-xs" style={{ borderColor: cfg.border, background: 'rgba(0,0,0,0.2)' }}>

          {/* Stripe webhooks */}
          {service.name === 'Stripe Webhooks' && Array.isArray(service.details.endpoints) && (
            <div className="space-y-2">
              {service.details.endpoints.length === 0 ? (
                <p className="text-gray-400">No webhook endpoints registered.</p>
              ) : service.details.endpoints.map((ep: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <p className="font-mono text-gray-200 truncate max-w-xs">{ep.url}</p>
                    <p className="text-gray-500 mt-0.5">{ep.events} events · API {ep.apiVersion}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold ml-3" style={{ background: ep.status === 'enabled' ? '#22c55e22' : '#ef444422', color: ep.status === 'enabled' ? '#22c55e' : '#ef4444' }}>
                    {ep.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Stripe API */}
          {service.name === 'Stripe API' && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(service.details).map(([k, v]) => (
                <div key={k} className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-gray-500 capitalize text-xs">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-white font-semibold mt-0.5">{String(v)}</p>
                </div>
              ))}
            </div>
          )}

          {/* UptimeRobot */}
          {service.name === 'UptimeRobot' && Array.isArray(service.details.monitors) && (
            <div className="space-y-2">
              {service.details.monitors.length === 0 ? (
                <p className="text-gray-400">No monitors configured.</p>
              ) : service.details.monitors.map((m: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <p className="font-semibold text-gray-200">{m.name}</p>
                    <p className="font-mono text-gray-500 mt-0.5 truncate max-w-xs">{m.url}</p>
                  </div>
                  <div className="text-right ml-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: m.status === 'up' ? '#22c55e22' : '#ef444422', color: m.status === 'up' ? '#22c55e' : '#ef4444' }}>{m.status}</span>
                    <p className="text-gray-500 mt-1">↑ {m.uptimeRatio}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resend */}
          {service.name === 'Resend Email' && Array.isArray(service.details.domains) && (
            <div className="space-y-2">
              {service.details.domains.map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="font-semibold text-gray-200">{d.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{d.region}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: d.status === 'verified' ? '#22c55e22' : '#f59e0b22', color: d.status === 'verified' ? '#22c55e' : '#f59e0b' }}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Supabase DB */}
          {service.name === 'Supabase Database' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-gray-500">Host</p>
                <p className="text-white font-semibold mt-0.5 text-xs font-mono">{service.details.host}</p>
              </div>
              <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className="text-gray-500">Rows returned</p>
                <p className="text-white font-semibold mt-0.5">{service.details.rowsReturned}</p>
              </div>
            </div>
          )}

          {/* Supabase Auth */}
          {service.name === 'Supabase Auth' && (
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-gray-500">Total registered users</p>
              <p className="text-white font-bold text-lg mt-0.5">{service.details.totalUsers}</p>
            </div>
          )}

          {/* Env vars */}
          {service.name === 'Environment Variables' && (
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 font-semibold mb-2 uppercase tracking-wider text-xs">Required</p>
                <div className="space-y-1">
                  {service.details.required?.map((v: any) => (
                    <div key={v.key} className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span style={{ color: v.set ? '#22c55e' : '#ef4444' }}>{v.set ? '✓' : '✗'}</span>
                      <span className="font-mono text-gray-300">{v.key}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-gray-400 font-semibold mb-2 uppercase tracking-wider text-xs">Optional</p>
                <div className="space-y-1">
                  {service.details.optional?.map((v: any) => (
                    <div key={v.key} className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <span style={{ color: v.set ? '#22c55e' : '#64748b' }}>{v.set ? '✓' : '○'}</span>
                      <span className="font-mono text-gray-400">{v.key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SystemHealthPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(30)

  const doFetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/system-health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
      setLastRefreshed(new Date())
      setCountdown(30)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { doFetch() }, [doFetch])
  useEffect(() => {
    const refresh = setInterval(doFetch, 30_000)
    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
    return () => { clearInterval(refresh); clearInterval(tick) }
  }, [doFetch])

  const overallColor =
    !data ? '#64748b' :
    data.overallStatus === 'healthy' ? '#22c55e' :
    data.overallStatus === 'degraded' ? '#f59e0b' : '#ef4444'

  const overallLabel =
    !data ? 'Checking…' :
    data.overallStatus === 'healthy' ? 'All Systems Operational' :
    data.overallStatus === 'degraded' ? 'Partial Degradation' : 'System Issues Detected'

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes wave {
          0% { d: path("M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"); }
          100% { d: path("M0,40 C240,20 480,100 720,40 C960,20 1200,100 1440,40 L1440,120 L0,120 Z"); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .fade-in-up { animation: fadeInUp 0.5s ease both; }
      `}</style>

      <div className="min-h-screen rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

        {/* ── Hero banner with waves ──────────────────────────────────────── */}
        <div className="relative overflow-hidden px-8 pt-10 pb-16">
          {/* Animated wave layers */}
          <div className="absolute inset-0 overflow-hidden">
            <Wave color={overallColor} opacity={0.12} delay={0}   duration={7} />
            <Wave color={overallColor} opacity={0.08} delay={1.5} duration={10} />
            <Wave color="#6366f1"      opacity={0.06} delay={0.5} duration={13} />
          </div>

          {/* Radial glow behind status */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl opacity-20 transition-colors duration-1000" style={{ background: overallColor }} />

          <div className="relative z-10 text-center">
            {/* Big pulsing ring */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-ping" style={{ background: overallColor, opacity: 0.2, scale: '1.4' }} />
                <div className="absolute inset-0 rounded-full animate-pulse" style={{ background: overallColor, opacity: 0.1, scale: '1.7' }} />
                <div className="relative w-20 h-20 rounded-full flex items-center justify-center text-4xl" style={{ background: `${overallColor}22`, border: `2px solid ${overallColor}55` }}>
                  {loading ? '⟳' : data?.overallStatus === 'healthy' ? '✅' : data?.overallStatus === 'degraded' ? '⚠️' : '🔴'}
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight">System Health</h1>
            <p className="mt-2 text-lg font-semibold transition-colors duration-500" style={{ color: overallColor }}>
              {overallLabel}
            </p>

            {/* Stats row */}
            {data && (
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {[
                  { label: 'Healthy',         val: data.services.filter(s => s.status === 'healthy').length,      color: '#22c55e' },
                  { label: 'Degraded',        val: data.services.filter(s => s.status === 'degraded').length,     color: '#f59e0b' },
                  { label: 'Down',            val: data.services.filter(s => s.status === 'down').length,         color: '#ef4444' },
                  { label: 'Not Configured',  val: data.services.filter(s => s.status === 'unconfigured').length, color: '#64748b' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl font-black tabular-nums" style={{ color: stat.color }}>
                      <AnimatedNumber value={stat.val} />
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
                <div className="text-center">
                  <p className="text-2xl font-black tabular-nums text-indigo-400">
                    <AnimatedNumber value={data.totalMs} />ms
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Total check time</p>
                </div>
              </div>
            )}

            {/* Refresh controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              {lastRefreshed && (
                <span className="text-xs text-gray-500">
                  Last checked {lastRefreshed.toLocaleTimeString()} · next in{' '}
                  <span className="font-mono text-gray-400">{countdown}s</span>
                </span>
              )}
              <button
                onClick={doFetch}
                disabled={loading}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{ background: `${overallColor}22`, color: overallColor, border: `1px solid ${overallColor}44` }}
              >
                {loading ? '⟳ Checking…' : '⟳ Refresh Now'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Service cards ─────────────────────────────────────────────── */}
        <div className="px-8 pb-10 -mt-4 space-y-3">
          {error && (
            <div className="rounded-2xl px-5 py-4 text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
              ❌ Failed to load: {error}
            </div>
          )}

          {/* Loading skeletons */}
          {loading && !data && [...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', animationDelay: `${i * 100}ms` }} />
          ))}

          {data?.services.map((service, i) => (
            <div key={service.name} className="fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
              <ServiceCard service={service} index={i} />
            </div>
          ))}

          {/* UptimeRobot setup tip */}
          {data?.services.find(s => s.name === 'UptimeRobot' && s.status === 'unconfigured') && (
            <div className="rounded-2xl px-5 py-4 text-sm fade-in-up" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', animationDelay: '500ms' }}>
              <p className="font-semibold text-indigo-300 mb-1">📡 Enable UptimeRobot monitoring</p>
              <p className="text-indigo-400 text-xs">
                Add <code className="bg-indigo-900/50 px-1 rounded font-mono">UPTIMEROBOT_API_KEY</code> to your{' '}
                <code className="bg-indigo-900/50 px-1 rounded font-mono">.env.local</code>.
                Get it from{' '}
                <a href="https://uptimerobot.com/dashboard" target="_blank" rel="noopener" className="underline text-indigo-300">
                  uptimerobot.com → My Settings → API Settings → Main API Key
                </a>
              </p>
            </div>
          )}

          {/* Live indicator footer */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            <span className="text-xs text-gray-600">Live monitoring · auto-refreshes every 30 seconds</span>
          </div>
        </div>
      </div>
    </>
  )
}
