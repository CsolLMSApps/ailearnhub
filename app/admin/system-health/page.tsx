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

// ── Per-service brand identity ─────────────────────────────────────────────────
const BRAND: Record<string, { color: string; glow: string; label: string; icon: string }> = {
  'Supabase Database': { color: '#3ECF8E', glow: '#3ECF8E40', label: 'Supabase DB',    icon: '🗄️' },
  'Supabase Auth':     { color: '#3ECF8E', glow: '#3ECF8E40', label: 'Supabase Auth',  icon: '🔐' },
  'Stripe API':        { color: '#635BFF', glow: '#635BFF40', label: 'Stripe API',     icon: '💳' },
  'Stripe Webhooks':   { color: '#7C5BF7', glow: '#7C5BF740', label: 'Stripe Hooks',  icon: '🔔' },
  'UptimeRobot':       { color: '#38BDF8', glow: '#38BDF840', label: 'UptimeRobot',   icon: '📡' },
  'Resend Email':      { color: '#FF6C37', glow: '#FF6C3740', label: 'Resend Email',  icon: '✉️' },
  'Environment Variables': { color: '#F59E0B', glow: '#F59E0B40', label: 'Env Vars', icon: '⚙️' },
}

const STATUS_COLOR = { healthy: '#22c55e', degraded: '#f59e0b', down: '#ef4444', unconfigured: '#475569' }
const STATUS_LABEL = { healthy: 'Healthy', degraded: 'Degraded', down: 'Down', unconfigured: 'Not Set Up' }

// ── Canvas: Live signal wave per service ──────────────────────────────────────
function SignalWave({ status, latencyMs, color, glow }: {
  status: ServiceResult['status']; latencyMs?: number; color: string; glow: string
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const phase = useRef(Math.random() * Math.PI * 2)
  const noise = useRef(Array.from({ length: 512 }, () => (Math.random() - 0.5)))

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const W = c.width, H = c.height, cy = H / 2

    const latFactor = latencyMs ? Math.max(0.2, 1 - latencyMs / 1400) : 0.6
    const amp = status === 'healthy' ? H * 0.36 * latFactor
              : status === 'degraded' ? H * 0.2
              : status === 'unconfigured' ? H * 0.07
              : H * 0.025
    const speed = status === 'healthy' ? 0.065 : status === 'degraded' ? 0.028 : 0.01

    const drawLine = (alpha: number, lw: number, blur: number) => {
      ctx.globalAlpha = alpha
      ctx.lineWidth = lw
      ctx.shadowBlur = blur
      ctx.shadowColor = color
      ctx.strokeStyle = color
      ctx.beginPath()
      for (let x = 0; x <= W; x += 1.5) {
        const n = noise.current[Math.floor(x) % 512]!
        let y: number
        if (status === 'down') {
          const s = W * 0.5, d = Math.abs(x - s)
          y = d < 16 ? cy - H * 0.44 * Math.exp(-(d * d) / 12) + (d > 6 ? H * 0.18 * Math.exp(-((d - 10) ** 2) / 5) : 0) : cy + n * H * 0.025
        } else if (status === 'unconfigured') {
          if (Math.floor(x / 10) % 2 === 0) { ctx.moveTo(x, cy); continue }
          y = cy
        } else {
          const t = (x / W) * Math.PI * 2 * 3.2
          const noiseAmt = status === 'degraded' ? n * amp * 0.55 : n * amp * 0.04
          y = cy - Math.sin(t + phase.current) * amp - Math.sin(t * 1.9 + phase.current * 0.6) * amp * 0.22 - noiseAmt
        }
        x <= 1.5 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Fine grid
      ctx.globalAlpha = 1
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      ctx.shadowBlur = 0
      for (let x = 0; x < W; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      for (let y = 0; y < H; y += H / 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke() }

      // Glow halo
      drawLine(0.18, 8, 24)
      // Mid glow
      drawLine(0.35, 4, 10)
      // Sharp line
      drawLine(1, 1.2, 4)

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      phase.current += speed
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf.current)
  }, [status, latencyMs, color])

  return <canvas ref={ref} width={420} height={70} className="w-full" />
}

// ── Canvas: ECG master display ────────────────────────────────────────────────
function MasterECG({ services }: { services: ServiceResult[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const raf = useRef(0)
  const head = useRef(0)
  const phaseRef = useRef(0)

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const W = c.width, H = c.height, cy = H / 2

    // Build a colored gradient across services
    const colorStops = services
      .filter(s => s.status !== 'unconfigured')
      .map((s, i, arr) => ({ pos: i / Math.max(arr.length - 1, 1), color: BRAND[s.name]?.color ?? '#22c55e' }))

    ctx.fillStyle = '#0D0D0D'
    ctx.fillRect(0, 0, W, H)

    const ecg = (t: number) => {
      const p = ((t % 1) + 1) % 1
      if (p < 0.06) return 0
      if (p < 0.12) return -(p - 0.06) / 0.06 * H * 0.07
      if (p < 0.17) return -H * 0.07 + (p - 0.12) / 0.05 * H * 0.07
      if (p < 0.22) return -(p - 0.17) / 0.05 * H * 0.38
      if (p < 0.245) return -H * 0.38 - (p - 0.22) / 0.025 * H * 0.22
      if (p < 0.27) return -H * 0.60 + (p - 0.245) / 0.025 * H * 0.70
      if (p < 0.32) return H * 0.10 - (p - 0.27) / 0.05 * H * 0.10
      if (p < 0.50) return (p - 0.32) / 0.18 * H * 0.10
      if (p < 0.64) return H * 0.10 - (p - 0.50) / 0.14 * H * 0.10
      return 0
    }

    const draw = () => {
      // Fade tail
      ctx.fillStyle = 'rgba(13,13,13,0.16)'
      ctx.fillRect(0, 0, W, H)

      // Erase ahead
      ctx.fillStyle = '#0D0D0D'
      ctx.fillRect(head.current, 0, 55, H)

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1; ctx.shadowBlur = 0
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke() }
      ;[0.25, 0.5, 0.75].forEach(r => { ctx.beginPath(); ctx.moveTo(0, H * r); ctx.lineTo(W, H * r); ctx.stroke() })

      const x = head.current
      const t = x / W * 5
      const dy = ecg(t)
      const y = cy + dy

      // Build gradient color at this x position
      const prog = x / W
      let col = '#22c55e'
      if (colorStops.length >= 2) {
        for (let i = 0; i < colorStops.length - 1; i++) {
          const a = colorStops[i]!, b = colorStops[i + 1]!
          if (prog >= a.pos && prog <= b.pos) {
            const t2 = (prog - a.pos) / (b.pos - a.pos)
            const c1 = parseInt(a.color.slice(1), 16), c2 = parseInt(b.color.slice(1), 16)
            const r = Math.round(((c1 >> 16) & 255) * (1 - t2) + ((c2 >> 16) & 255) * t2)
            const g = Math.round(((c1 >> 8) & 255) * (1 - t2) + ((c2 >> 8) & 255) * t2)
            const b2 = Math.round((c1 & 255) * (1 - t2) + (c2 & 255) * t2)
            col = `rgb(${r},${g},${b2})`
            break
          }
        }
      }

      // Radial glow at head
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, 32)
      g2.addColorStop(0, col + 'cc'); g2.addColorStop(1, col + '00')
      ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(x, y, 32, 0, Math.PI * 2); ctx.fill()

      // Trail line
      ctx.strokeStyle = col; ctx.lineWidth = 2
      ctx.shadowColor = col; ctx.shadowBlur = 10
      ctx.beginPath(); ctx.moveTo(Math.max(0, x - 3), cy + ecg((Math.max(0, x - 3)) / W * 5))
      ctx.lineTo(x, y); ctx.stroke()

      // Bright dot
      ctx.fillStyle = '#fff'; ctx.shadowColor = col; ctx.shadowBlur = 16
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur = 0

      // Side labels
      ctx.fillStyle = 'rgba(255,255,255,0.12)'
      ctx.font = '10px monospace'
      ctx.fillText('mV', 6, 14)
      ctx.fillText('0', 6, cy + 4)

      head.current = (head.current + 2.2) % W
      phaseRef.current += 0.01
      raf.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf.current)
  }, [services])

  return <canvas ref={ref} width={900} height={110} className="w-full" style={{ borderRadius: 12 }} />
}

// ── History sparkline (stores real latency over time) ─────────────────────────
const latencyHistory: Record<string, number[]> = {}

function Sparkline({ name, current, color }: { name: string; current?: number; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (current === undefined) return
    if (!latencyHistory[name]) latencyHistory[name] = []
    latencyHistory[name]!.push(current)
    if (latencyHistory[name]!.length > 20) latencyHistory[name]!.shift()
  }, [name, current])

  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')!
    const W = c.width, H = c.height
    const hist = latencyHistory[name] ?? []
    if (hist.length < 2) { ctx.clearRect(0, 0, W, H); return }

    const max = Math.max(...hist, 100)
    ctx.clearRect(0, 0, W, H)

    // Fill under line
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, color + '40')
    grad.addColorStop(1, color + '00')

    ctx.beginPath()
    hist.forEach((v, i) => {
      const x = (i / (hist.length - 1)) * W
      const y = H - (v / max) * H * 0.85 - 2
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()

    // Line
    ctx.beginPath()
    hist.forEach((v, i) => {
      const x = (i / (hist.length - 1)) * W
      const y = H - (v / max) * H * 0.85 - 2
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.strokeStyle = color; ctx.lineWidth = 1.5
    ctx.shadowColor = color; ctx.shadowBlur = 5
    ctx.stroke(); ctx.shadowBlur = 0
  })

  return <canvas ref={ref} width={80} height={28} />
}

// ── Latency ring ──────────────────────────────────────────────────────────────
function LatencyRing({ ms, color }: { ms: number; color: string }) {
  const pct = Math.min(100, (ms / 1000) * 100)
  const r = 18, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      <svg width={48} height={48} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle cx={24} cy={24} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 0.7s ease' }} />
      </svg>
      <span className="absolute text-xs font-bold tabular-nums" style={{ color, fontSize: 9 }}>{ms}ms</span>
    </div>
  )
}

// ── Service card ──────────────────────────────────────────────────────────────
function ServiceCard({ svc, idx }: { svc: ServiceResult; idx: number }) {
  const [open, setOpen] = useState(false)
  const brand = BRAND[svc.name] ?? { color: '#94a3b8', glow: '#94a3b820', label: svc.name, icon: '🔧' }
  const statusColor = STATUS_COLOR[svc.status]
  const hasDetails = !!svc.details && Object.keys(svc.details).length > 0

  return (
    <div
      onClick={() => hasDetails && setOpen(v => !v)}
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${hasDetails ? 'cursor-pointer' : ''}`}
      style={{
        background: 'linear-gradient(145deg, #111116 0%, #0D0D12 100%)',
        border: `1px solid rgba(255,255,255,0.07)`,
        boxShadow: open ? `0 0 0 1px ${brand.color}30, 0 8px 32px ${brand.glow}` : `0 1px 0 rgba(255,255,255,0.05)`,
        opacity: 0,
        animation: `cardIn 0.4s ${idx * 60}ms cubic-bezier(0.16,1,0.3,1) both`,
      }}
    >
      {/* Colored top edge */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${brand.color}00, ${brand.color}, ${brand.color}00)` }} />

      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-1">
        <div className="flex items-center gap-3">
          {/* Icon bubble */}
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: brand.glow, boxShadow: `inset 0 0 0 1px ${brand.color}25` }}>
            {brand.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{brand.label}</p>
            <p className="text-xs mt-0.5 truncate max-w-[180px]" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {svc.message}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
          {/* Status pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: `${statusColor}15`, border: `1px solid ${statusColor}30` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusColor, boxShadow: `0 0 4px ${statusColor}` }} />
            <span className="text-xs font-semibold" style={{ color: statusColor }}>{STATUS_LABEL[svc.status]}</span>
          </div>
          {hasDetails && (
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{open ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {/* Waveform */}
      <div className="px-3 py-2">
        <SignalWave status={svc.status} latencyMs={svc.responseTimeMs} color={brand.color} glow={brand.glow} />
      </div>

      {/* Footer: latency ring + sparkline + bar */}
      {svc.responseTimeMs !== undefined && (
        <div className="flex items-center gap-3 px-4 pb-4">
          <LatencyRing ms={svc.responseTimeMs} color={brand.color} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Response time</span>
              <Sparkline name={svc.name} current={svc.responseTimeMs} color={brand.color} />
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (svc.responseTimeMs / 800) * 100)}%`,
                  background: `linear-gradient(90deg, ${brand.color}, ${brand.color}88)`,
                  boxShadow: `0 0 8px ${brand.color}80`,
                }} />
            </div>
          </div>
        </div>
      )}

      {/* Expanded */}
      {open && svc.details && (
        <div className="border-t text-xs px-4 py-4 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
          <Row details={svc.details} name={svc.name} color={brand.color} />
        </div>
      )}
    </div>
  )
}

function Row({ details, name, color }: { details: Record<string, any>; name: string; color: string }) {
  const pill = (text: string, good: boolean) => (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: good ? '#22c55e18' : '#ef444418', color: good ? '#22c55e' : '#ef4444' }}>
      {text}
    </span>
  )
  const box = (label: string, val: string) => (
    <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
      <p className="text-white font-semibold mt-0.5">{val}</p>
    </div>
  )

  if (name === 'Stripe Webhooks' && Array.isArray(details.endpoints)) return (
    <div className="space-y-2">
      {details.endpoints.length === 0
        ? <p style={{ color: 'rgba(255,255,255,0.3)' }}>No webhooks registered.</p>
        : details.endpoints.map((ep: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div>
                <p className="font-mono text-white truncate max-w-[260px]">{ep.url}</p>
                <p style={{ color: 'rgba(255,255,255,0.3)' }} className="mt-0.5">{ep.events} events · API {ep.apiVersion}</p>
              </div>
              {pill(ep.status, ep.status === 'enabled')}
            </div>
          ))}
    </div>
  )
  if (name === 'Stripe API') return (
    <div className="grid grid-cols-2 gap-2">
      {Object.entries(details).map(([k, v]) => box(k.replace(/([A-Z])/g, ' $1').trim(), String(v)))}
    </div>
  )
  if (name === 'UptimeRobot' && Array.isArray(details.monitors)) return (
    <div className="space-y-2">
      {details.monitors.length === 0
        ? <p style={{ color: 'rgba(255,255,255,0.3)' }}>No monitors configured.</p>
        : details.monitors.map((m: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div><p className="font-semibold text-white">{m.name}</p><p className="font-mono mt-0.5 truncate max-w-[220px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.url}</p></div>
              <div className="text-right ml-3">{pill(m.status, m.status === 'up')}<p className="mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>↑ {m.uptimeRatio}</p></div>
            </div>
          ))}
    </div>
  )
  if (name === 'Resend Email' && Array.isArray(details.domains)) return (
    <div className="space-y-2">
      {details.domains.map((d: any, i: number) => (
        <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <span className="text-white font-medium">{d.name}</span>
          {pill(d.status, d.status === 'verified')}
        </div>
      ))}
    </div>
  )
  if (name === 'Supabase Database') return (
    <div className="grid grid-cols-2 gap-2">
      {box('Host', details.host ?? '—')}
      {box('Rows', String(details.rowsReturned ?? 0))}
    </div>
  )
  if (name === 'Supabase Auth') return box('Total users', String(details.totalUsers ?? '—'))
  if (name === 'Environment Variables') return (
    <div className="space-y-1.5">
      <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Required</p>
      {details.required?.map((v: any) => (
        <div key={v.key} className="flex items-center gap-2">
          <span style={{ color: v.set ? '#22c55e' : '#ef4444' }}>{v.set ? '✓' : '✗'}</span>
          <span className="font-mono text-white opacity-70">{v.key}</span>
        </div>
      ))}
      <p className="text-xs uppercase tracking-widest mt-3 mb-2" style={{ color: 'rgba(255,255,255,0.2)' }}>Optional</p>
      {details.optional?.map((v: any) => (
        <div key={v.key} className="flex items-center gap-2">
          <span style={{ color: v.set ? '#22c55e' : '#475569' }}>{v.set ? '✓' : '○'}</span>
          <span className="font-mono opacity-50 text-white">{v.key}</span>
        </div>
      ))}
    </div>
  )
  return null
}

// ── Counter ───────────────────────────────────────────────────────────────────
function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let cur = 0; const step = Math.max(1, Math.ceil(to / 30))
    const id = setInterval(() => { cur = Math.min(cur + step, to); setN(cur); if (cur >= to) clearInterval(id) }, 20)
    return () => clearInterval(id)
  }, [to])
  return <>{n}{suffix}</>
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SystemHealthPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(30)

  const doFetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/system-health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status}`)
      setData(await res.json())
      setLastChecked(new Date())
      setCountdown(30)
    } catch { /* retry next tick */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { doFetch() }, [doFetch])
  useEffect(() => {
    const r = setInterval(doFetch, 30_000)
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
    return () => { clearInterval(r); clearInterval(t) }
  }, [doFetch])

  const overall = data?.overallStatus ?? 'healthy'
  const mainColor = overall === 'healthy' ? '#22c55e' : overall === 'degraded' ? '#f59e0b' : '#ef4444'
  const overallLabel = overall === 'healthy' ? 'All Systems Operational'
    : overall === 'degraded' ? 'Partial Degradation'
    : 'Issues Detected'

  const statCards = data ? [
    { label: 'Healthy',   n: data.services.filter(s => s.status === 'healthy').length,      color: '#22c55e', icon: '●' },
    { label: 'Degraded',  n: data.services.filter(s => s.status === 'degraded').length,     color: '#f59e0b', icon: '◐' },
    { label: 'Down',      n: data.services.filter(s => s.status === 'down').length,         color: '#ef4444', icon: '○' },
    { label: 'Scan time', n: data.totalMs,                                                  color: '#818cf8', icon: '◷', suffix: 'ms' },
  ] : []

  return (
    <>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D0D0D', minHeight: '88vh' }}>

        {/* ── Top bar ──────────────────────────────────────────────────── */}
        <div style={{ background: '#111116', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="relative w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: mainColor, opacity: 0.5 }} />
              <span className="relative block w-2.5 h-2.5 rounded-full" style={{ background: mainColor, boxShadow: `0 0 8px ${mainColor}` }} />
            </div>
            <span className="text-sm font-bold text-white">System Health</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{ background: `${mainColor}18`, color: mainColor, border: `1px solid ${mainColor}30` }}>
              {loading ? 'Scanning…' : overallLabel}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {lastChecked && (
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {lastChecked.toLocaleTimeString()} · <span className="font-mono">{countdown}s</span>
              </span>
            )}
            <button onClick={doFetch} disabled={loading}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-30"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {loading ? '⟳ Scanning' : '⟳ Refresh'}
            </button>
          </div>
        </div>

        {/* ── ECG + stats ───────────────────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4">
          {/* ECG */}
          <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <MasterECG services={data?.services ?? []} />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-3">
            {statCards.map(s => (
              <div key={s.label} className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xl" style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}>{s.icon}</span>
                <div>
                  <p className="text-xl font-black tabular-nums text-white leading-none">
                    <Count to={s.n} suffix={'suffix' in s ? (s as any).suffix : ''} />
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider label ─────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 mb-4">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>
            Live Service Signals
          </span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* ── Service grid ──────────────────────────────────────────────── */}
        <div className="px-6 pb-6">
          {loading && !data ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-2xl animate-pulse"
                  style={{ background: '#111116', animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {data?.services.map((svc, i) => <ServiceCard key={svc.name} svc={svc} idx={i} />)}
            </div>
          )}

          {/* UptimeRobot nudge */}
          {data?.services.find(s => s.name === 'UptimeRobot' && s.status === 'unconfigured') && (
            <div className="mt-4 rounded-2xl px-5 py-4 text-xs"
              style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', animation: 'fadeIn 0.4s 500ms ease both', opacity: 0 }}>
              <p className="font-semibold mb-1" style={{ color: '#38BDF8' }}>📡 Connect UptimeRobot</p>
              <p style={{ color: 'rgba(56,189,248,0.6)' }}>
                Add <code className="bg-sky-900/30 px-1 rounded font-mono">UPTIMEROBOT_API_KEY</code> to{' '}
                <code className="bg-sky-900/30 px-1 rounded font-mono">.env.local</code> —{' '}
                <a href="https://uptimerobot.com/dashboard" target="_blank" rel="noopener" className="underline" style={{ color: '#38BDF8' }}>
                  get your key here
                </a>
              </p>
            </div>
          )}

          {/* Scrolling ticker */}
          <div className="mt-6 overflow-hidden rounded-xl py-2" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex gap-8 whitespace-nowrap text-xs" style={{ animation: 'tickerScroll 24s linear infinite', color: 'rgba(255,255,255,0.18)' }}>
              {[...(data?.services ?? []), ...(data?.services ?? [])].map((s, i) => {
                const b = BRAND[s.name]
                return (
                  <span key={i} className="flex items-center gap-1.5 shrink-0">
                    <span style={{ color: b?.color ?? '#94a3b8', fontSize: 10 }}>●</span>
                    <span className="font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{b?.label ?? s.name}</span>
                    <span style={{ color: STATUS_COLOR[s.status] }}>{STATUS_LABEL[s.status]}</span>
                    {s.responseTimeMs !== undefined && <span>{s.responseTimeMs}ms</span>}
                    <span className="opacity-30 mx-2">·</span>
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
