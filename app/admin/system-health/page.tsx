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

const C = {
  healthy:      '#00ff88',
  degraded:     '#fbbf24',
  down:         '#ff3b3b',
  unconfigured: '#475569',
}

const LABEL: Record<string, string> = {
  healthy: 'Healthy', degraded: 'Degraded', down: 'Down', unconfigured: 'Not Set Up',
}

const ICON: Record<string, string> = {
  'Supabase Database': '🗄️', 'Supabase Auth': '🔐',
  'Stripe API': '💳', 'Stripe Webhooks': '🔔',
  'UptimeRobot': '📡', 'Resend Email': '✉️',
  'Environment Variables': '⚙️',
}

// ── ECG scanning heartbeat (main banner) ──────────────────────────────────────
function HeartbeatCanvas({ overallStatus }: { overallStatus: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const scan = useRef(0)

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const W = c.width, H = c.height, mid = H / 2
    const color = overallStatus === 'healthy' ? C.healthy : overallStatus === 'degraded' ? C.degraded : C.down

    // Fill dark base once
    ctx.fillStyle = 'rgba(5,10,20,1)'
    ctx.fillRect(0, 0, W, H)

    // ECG waveform function: returns y offset for given x position in beat cycle
    const ecg = (t: number): number => {
      const p = t % 1
      if (p < 0.05) return 0
      if (p < 0.10) return -(p - 0.05) / 0.05 * H * 0.08   // P wave
      if (p < 0.15) return -H * 0.08 + (p - 0.10) / 0.05 * H * 0.08
      if (p < 0.20) return -(p - 0.15) / 0.05 * H * 0.4    // Q dip
      if (p < 0.22) return -H * 0.4 - (p - 0.20) / 0.02 * H * 0.25 // R spike up
      if (p < 0.24) return -H * 0.65 + (p - 0.22) / 0.02 * H * 0.75 // R spike down
      if (p < 0.28) return H * 0.1 - (p - 0.24) / 0.04 * H * 0.1   // S wave
      if (p < 0.45) return (p - 0.28) / 0.17 * H * 0.12             // ST segment rise
      if (p < 0.60) return H * 0.12 - (p - 0.45) / 0.15 * H * 0.12 // T wave
      return 0
    }

    const draw = () => {
      // Trailing fade
      ctx.fillStyle = 'rgba(5,10,20,0.18)'
      ctx.fillRect(0, 0, W, H)

      // Erase ahead of scan
      ctx.fillStyle = 'rgba(5,10,20,0.92)'
      ctx.fillRect(scan.current, 0, 50, H)

      // Grid dots
      ctx.fillStyle = 'rgba(255,255,255,0.035)'
      for (let x = 0; x < W; x += 30) for (let y = 0; y < H; y += 16) {
        ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill()
      }

      // Draw ECG line at scan head
      const x = scan.current
      const t = x / W * 4 // 4 beat cycles across width
      const dy = overallStatus === 'down' ? (Math.random() - 0.5) * H * 0.04 : ecg(t) * (overallStatus === 'degraded' ? 0.5 : 1)
      const y = mid + dy

      // Glow halo
      const g = ctx.createRadialGradient(x, y, 0, x, y, 28)
      g.addColorStop(0, color + 'aa'); g.addColorStop(1, color + '00')
      ctx.fillStyle = g
      ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill()

      // Bright dot
      ctx.fillStyle = color
      ctx.shadowColor = color; ctx.shadowBlur = 12
      ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0

      scan.current = (scan.current + 2.5) % W
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf.current)
  }, [overallStatus])

  return <canvas ref={ref} width={900} height={90} className="w-full" style={{ borderRadius: 12 }} />
}

// ── Per-service animated waveform ─────────────────────────────────────────────
function SignalCanvas({ status, latencyMs }: { status: keyof typeof C, latencyMs?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const phase = useRef(Math.random() * Math.PI * 2)
  const noiseCache = useRef(Array.from({ length: 400 }, () => (Math.random() - 0.5)))

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const W = c.width, H = c.height, mid = H / 2
    const color = C[status]

    // Drive amplitude from real latency: lower ms = taller wave
    const latFactor = latencyMs ? Math.max(0.2, 1 - latencyMs / 1200) : 0.65
    const amp = status === 'healthy' ? H * 0.4 * latFactor
              : status === 'degraded' ? H * 0.22
              : status === 'unconfigured' ? H * 0.06
              : H * 0.03   // flatline

    const speed = status === 'healthy' ? 0.075
                : status === 'degraded' ? 0.03
                : status === 'unconfigured' ? 0.012
                : 0.005

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Subtle dot grid
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      for (let x = 0; x < W; x += 20) for (let y = H * 0.25; y < H; y += H * 0.25) {
        ctx.beginPath(); ctx.arc(x, y, 0.6, 0, Math.PI * 2); ctx.fill()
      }

      // Glow pass
      ctx.save()
      ctx.shadowColor = color; ctx.shadowBlur = 14
      ctx.strokeStyle = color + '40'; ctx.lineWidth = 5
      ctx.beginPath()
      for (let x = 0; x <= W; x += 2) {
        const noise = status === 'degraded' ? noiseCache.current[x % noiseCache.current.length]! * amp * 0.45 : 0
        let y: number
        if (status === 'down') {
          const spike = W * 0.5
          const d = Math.abs(x - spike)
          y = d < 14 ? mid - H * 0.48 * Math.exp(-(d * d) / 10) : mid + (noiseCache.current[x % 400]! * H * 0.02)
        } else if (status === 'unconfigured') {
          y = mid + Math.sin(x * 0.03 + phase.current) * amp
        } else {
          const t = (x / W) * Math.PI * 2 * 3.5
          y = mid - Math.sin(t + phase.current) * amp - Math.sin(t * 2 + phase.current * 0.7) * amp * 0.18 - noise
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.restore()

      // Sharp line pass
      ctx.strokeStyle = color; ctx.lineWidth = 1.5
      ctx.shadowColor = color; ctx.shadowBlur = 5
      ctx.beginPath()
      for (let x = 0; x <= W; x += 2) {
        const noise = status === 'degraded' ? noiseCache.current[x % noiseCache.current.length]! * amp * 0.45 : 0
        let y: number
        if (status === 'down') {
          const spike = W * 0.5, d = Math.abs(x - spike)
          y = d < 14 ? mid - H * 0.48 * Math.exp(-(d * d) / 10) : mid + (noiseCache.current[x % 400]! * H * 0.02)
        } else if (status === 'unconfigured') {
          y = mid + Math.sin(x * 0.03 + phase.current) * amp
        } else {
          const t = (x / W) * Math.PI * 2 * 3.5
          y = mid - Math.sin(t + phase.current) * amp - Math.sin(t * 2 + phase.current * 0.7) * amp * 0.18 - noise
        }
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0

      // Dashed style for unconfigured
      if (status === 'unconfigured') {
        ctx.setLineDash([6, 10])
        ctx.strokeStyle = color; ctx.lineWidth = 1
        ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke()
        ctx.setLineDash([])
      }

      phase.current += speed
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf.current)
  }, [status, latencyMs])

  return <canvas ref={ref} width={380} height={56} className="w-full" />
}

// ── Animated stat counter ─────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let cur = 0; const step = Math.max(1, Math.ceil(to / 28))
    const id = setInterval(() => { cur = Math.min(cur + step, to); setN(cur); if (cur >= to) clearInterval(id) }, 22)
    return () => clearInterval(id)
  }, [to])
  return <>{n}{suffix}</>
}

// ── Latency signal-strength bars (like WiFi indicator) ────────────────────────
function SignalBars({ ms }: { ms: number }) {
  const bars = 5
  const lit = ms < 100 ? 5 : ms < 250 ? 4 : ms < 500 ? 3 : ms < 800 ? 2 : 1
  const color = ms < 250 ? C.healthy : ms < 600 ? C.degraded : C.down
  return (
    <div className="flex items-end gap-0.5 h-4">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm transition-all"
          style={{
            height: `${40 + i * 15}%`,
            background: i < lit ? color : 'rgba(255,255,255,0.1)',
            boxShadow: i < lit ? `0 0 4px ${color}` : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({ svc, index }: { svc: ServiceResult; index: number }) {
  const [open, setOpen] = useState(false)
  const color = C[svc.status]
  const hasDetails = !!svc.details && Object.keys(svc.details).length > 0

  return (
    <div
      onClick={() => hasDetails && setOpen(v => !v)}
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${hasDetails ? 'cursor-pointer' : ''}`}
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${color}28`,
        boxShadow: open ? `0 0 40px ${color}12, inset 0 1px 0 ${color}15` : `inset 0 1px 0 rgba(255,255,255,0.05)`,
        transform: open ? 'scale(1.005)' : 'scale(1)',
        opacity: 0, animation: `fadeUp 0.4s ${index * 65}ms ease both`,
      }}
    >
      {/* Top bar — colored glow line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${color}88, transparent)` }} />

      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${color}15` }}>
            {ICON[svc.name] ?? '🔧'}
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">{svc.name}</p>
            <p className="text-xs truncate max-w-[160px]" style={{ color: `${color}80` }}>{svc.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {svc.responseTimeMs !== undefined && <SignalBars ms={svc.responseTimeMs} />}
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}18`, color, border: `1px solid ${color}35` }}>
            {LABEL[svc.status]}
          </span>
          {hasDetails && <span className="text-xs opacity-40 text-white">{open ? '▲' : '▼'}</span>}
        </div>
      </div>

      {/* Live waveform */}
      <div className="px-3 py-1">
        <SignalCanvas status={svc.status} latencyMs={svc.responseTimeMs} />
      </div>

      {/* Latency gradient bar */}
      {svc.responseTimeMs !== undefined && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Latency</span>
            <span className="text-xs font-mono tabular-nums" style={{ color }}>{svc.responseTimeMs}ms</span>
          </div>
          <div className="h-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (svc.responseTimeMs / 800) * 100)}%`,
                background: `linear-gradient(90deg, ${color}, ${color}66)`,
                boxShadow: `0 0 6px ${color}`,
                transition: 'width 0.7s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Expanded details */}
      {open && svc.details && (
        <div className="border-t px-4 py-3 space-y-2 text-xs" style={{ borderColor: `${color}18`, background: 'rgba(0,0,0,0.3)' }}>
          {svc.name === 'Stripe Webhooks' && Array.isArray(svc.details.endpoints) && (
            svc.details.endpoints.length === 0
              ? <p className="text-gray-500">No webhooks registered.</p>
              : svc.details.endpoints.map((ep: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <span className="font-mono text-gray-300 truncate max-w-[260px]">{ep.url}</span>
                    <span className="ml-3 font-bold" style={{ color: ep.status === 'enabled' ? C.healthy : C.down }}>{ep.status}</span>
                  </div>
                ))
          )}
          {svc.name === 'Stripe API' && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(svc.details).map(([k, v]) => (
                <div key={k} className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <p className="text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-white font-semibold">{String(v)}</p>
                </div>
              ))}
            </div>
          )}
          {svc.name === 'UptimeRobot' && Array.isArray(svc.details.monitors) && (
            svc.details.monitors.length === 0
              ? <p className="text-gray-500">No monitors configured.</p>
              : svc.details.monitors.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div><p className="text-white font-medium">{m.name}</p><p className="text-gray-500 font-mono truncate max-w-[220px]">{m.url}</p></div>
                    <div className="text-right ml-3">
                      <p className="font-bold" style={{ color: m.status === 'up' ? C.healthy : C.down }}>{m.status}</p>
                      <p className="text-gray-500">↑ {m.uptimeRatio}</p>
                    </div>
                  </div>
                ))
          )}
          {svc.name === 'Resend Email' && Array.isArray(svc.details.domains) && svc.details.domains.map((d: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <span className="text-white font-medium">{d.name}</span>
              <span className="font-bold" style={{ color: d.status === 'verified' ? C.healthy : C.degraded }}>{d.status}</span>
            </div>
          ))}
          {svc.name === 'Supabase Database' && (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}><p className="text-gray-500">Host</p><p className="text-white font-mono text-xs">{svc.details.host}</p></div>
              <div className="rounded-lg px-2 py-1.5" style={{ background: 'rgba(255,255,255,0.04)' }}><p className="text-gray-500">Rows</p><p className="text-white font-bold">{svc.details.rowsReturned}</p></div>
            </div>
          )}
          {svc.name === 'Supabase Auth' && (
            <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <p className="text-gray-500">Total registered users</p>
              <p className="text-3xl font-black text-white mt-0.5">{svc.details.totalUsers}</p>
            </div>
          )}
          {svc.name === 'Environment Variables' && (
            <div className="space-y-1.5">
              <p className="text-gray-500 uppercase tracking-widest text-xs mb-2">Required</p>
              {svc.details.required?.map((v: any) => (
                <div key={v.key} className="flex items-center gap-2">
                  <span style={{ color: v.set ? C.healthy : C.down }}>{v.set ? '✓' : '✗'}</span>
                  <span className="font-mono text-gray-300">{v.key}</span>
                </div>
              ))}
              <p className="text-gray-500 uppercase tracking-widest text-xs mt-3 mb-2">Optional</p>
              {svc.details.optional?.map((v: any) => (
                <div key={v.key} className="flex items-center gap-2">
                  <span style={{ color: v.set ? C.healthy : '#475569' }}>{v.set ? '✓' : '○'}</span>
                  <span className="font-mono text-gray-400">{v.key}</span>
                </div>
              ))}
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
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(30)

  const doFetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/system-health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
      setLastChecked(new Date())
      setCountdown(30)
    } catch { /* silently retry */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { doFetch() }, [doFetch])
  useEffect(() => {
    const r = setInterval(doFetch, 30_000)
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
    return () => { clearInterval(r); clearInterval(t) }
  }, [doFetch])

  const overall = data?.overallStatus ?? 'healthy'
  const mainColor = overall === 'healthy' ? C.healthy : overall === 'degraded' ? C.degraded : C.down
  const overallLabel = overall === 'healthy' ? 'All Systems Operational'
    : overall === 'degraded' ? 'Partial Degradation Detected'
    : 'System Issues Detected'

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .pulse-ring::before {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 9999px;
          border: 2px solid currentColor;
          animation: pulse-ring 1.8s ease-out infinite;
        }
        .pulse-ring::after {
          content: '';
          position: absolute;
          inset: -18px;
          border-radius: 9999px;
          border: 1px solid currentColor;
          animation: pulse-ring 1.8s 0.4s ease-out infinite;
        }
      `}</style>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(155deg, #050a14 0%, #0a0f1e 40%, #060b18 100%)', minHeight: '80vh' }}>

        {/* ── Hero — ECG banner ─────────────────────────────────────────── */}
        <div className="px-6 pt-8 pb-6 relative">
          {/* Ambient radial glow behind ECG */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 120%, ${mainColor}12 0%, transparent 70%)`,
            transition: 'background 1s ease',
          }} />

          {/* Title row */}
          <div className="flex items-center justify-between mb-5 relative z-10">
            <div>
              <div className="flex items-center gap-3">
                {/* Pulsing orb */}
                <div className="relative flex items-center justify-center pulse-ring" style={{ color: mainColor }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: mainColor, boxShadow: `0 0 12px ${mainColor}` }} />
                </div>
                <h1 className="text-xl font-black text-white tracking-tight">System Health</h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${mainColor}18`, color: mainColor, border: `1px solid ${mainColor}35` }}>
                  {loading ? 'Checking…' : overallLabel}
                </span>
              </div>
              {lastChecked && (
                <p className="text-xs text-gray-600 mt-1.5 ml-6">
                  Last scan {lastChecked.toLocaleTimeString()} · next in <span className="font-mono text-gray-500">{countdown}s</span>
                </p>
              )}
            </div>
            <button
              onClick={doFetch}
              disabled={loading}
              className="text-xs font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-40"
              style={{ background: `${mainColor}12`, color: mainColor, border: `1px solid ${mainColor}30` }}
            >
              {loading ? '⟳ Scanning…' : '⟳ Scan Now'}
            </button>
          </div>

          {/* ECG canvas */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${mainColor}18` }}>
            <HeartbeatCanvas overallStatus={overall} />
          </div>

          {/* Stats strip */}
          {data && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[
                { label: 'Healthy',   val: data.services.filter(s => s.status === 'healthy').length,      color: C.healthy,      suffix: '' },
                { label: 'Degraded',  val: data.services.filter(s => s.status === 'degraded').length,     color: C.degraded,     suffix: '' },
                { label: 'Down',      val: data.services.filter(s => s.status === 'down').length,         color: C.down,         suffix: '' },
                { label: 'Not Set',   val: data.services.filter(s => s.status === 'unconfigured').length, color: C.unconfigured, suffix: '' },
                { label: 'Scan time', val: data.totalMs,                                                  color: '#818cf8',      suffix: 'ms' },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl px-3 py-2.5 text-center" style={{ background: `${stat.color}0c`, border: `1px solid ${stat.color}20` }}>
                  <p className="text-xl font-black tabular-nums" style={{ color: stat.color, textShadow: `0 0 12px ${stat.color}88` }}>
                    <Counter to={stat.val} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Service grid ──────────────────────────────────────────────── */}
        <div className="px-6 pb-8">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }} />
            <span className="text-xs text-gray-600 uppercase tracking-widest font-semibold">Live Service Signals</span>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06))' }} />
          </div>

          {/* Skeleton */}
          {loading && !data && (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-36 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          )}

          {/* Cards */}
          {data && (
            <div className="grid grid-cols-2 gap-3">
              {data.services.map((svc, i) => (
                <ServiceCard key={svc.name} svc={svc} index={i} />
              ))}
            </div>
          )}

          {/* UptimeRobot nudge */}
          {data?.services.find(s => s.name === 'UptimeRobot' && s.status === 'unconfigured') && (
            <div className="mt-4 rounded-2xl px-5 py-4 text-xs" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', animation: 'fadeUp 0.4s 450ms ease both', opacity: 0 }}>
              <p className="text-indigo-300 font-semibold mb-1">📡 Connect UptimeRobot for monitor signals</p>
              <p className="text-indigo-500">
                Add <code className="bg-indigo-900/40 px-1 rounded font-mono">UPTIMEROBOT_API_KEY</code> to <code className="bg-indigo-900/40 px-1 rounded font-mono">.env.local</code>.
                Get it from{' '}
                <a href="https://uptimerobot.com/dashboard" target="_blank" rel="noopener" className="text-indigo-300 underline">uptimerobot.com → My Settings → Main API Key</a>.
              </p>
            </div>
          )}

          {/* Live ticker */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ background: mainColor }} />
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
              Live · auto-scan every 30s · {data?.services.length ?? 0} services monitored
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
