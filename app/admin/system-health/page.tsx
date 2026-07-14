'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

/* ─────────────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────────
   Constants
───────────────────────────────────────────────────────────────────────────── */
const BRAND: Record<string, { color: string; label: string; icon: string }> = {
  'Supabase Database':     { color: '#3ECF8E', label: 'Supabase DB',   icon: '🗄️' },
  'Supabase Auth':         { color: '#3ECF8E', label: 'Supabase Auth', icon: '🔐' },
  'Stripe API':            { color: '#635BFF', label: 'Stripe API',    icon: '💳' },
  'Stripe Webhooks':       { color: '#7C5BF7', label: 'Stripe Hooks',  icon: '🔔' },
  'UptimeRobot':           { color: '#38BDF8', label: 'UptimeRobot',   icon: '📡' },
  'Resend Email':          { color: '#FF6C37', label: 'Resend Email',  icon: '✉️' },
  'Environment Variables': { color: '#F59E0B', label: 'Env Vars',      icon: '⚙️' },
}
const STATUS_COLOR = { healthy: '#22c55e', degraded: '#f59e0b', down: '#ef4444', unconfigured: '#475569' }
const STATUS_LABEL = { healthy: 'Healthy', degraded: 'Degraded', down: 'Down', unconfigured: 'Not Set Up' }

/* ─────────────────────────────────────────────────────────────────────────────
   Waveform canvas — one loop per card, safe initialization
───────────────────────────────────────────────────────────────────────────── */
function SignalWave({ status, latencyMs, color }: {
  status: ServiceResult['status']
  latencyMs?: number
  color: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const phaseRef  = useRef<number>(Math.random() * Math.PI * 2)
  // pre-generate noise so we never access undefined
  const noiseRef  = useRef<number[]>(Array.from({ length: 512 }, () => (Math.random() - 0.5)))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cy = H / 2

    const latFactor = latencyMs != null ? Math.max(0.2, 1 - latencyMs / 1400) : 0.6
    const amp =
      status === 'healthy'      ? H * 0.36 * latFactor :
      status === 'degraded'     ? H * 0.20              :
      status === 'unconfigured' ? H * 0.07              :
      H * 0.025  // down = flatline

    const speed =
      status === 'healthy'  ? 0.065 :
      status === 'degraded' ? 0.028 : 0.01

    const computeY = (x: number, phase: number): number | null => {
      const noise = noiseRef.current[Math.floor(x) % 512] ?? 0
      if (status === 'down') {
        const spike = W * 0.5
        const d = Math.abs(x - spike)
        return d < 16
          ? cy - H * 0.44 * Math.exp(-(d * d) / 12) + (d > 6 ? H * 0.18 * Math.exp(-((d - 10) ** 2) / 5) : 0)
          : cy + noise * H * 0.025
      }
      if (status === 'unconfigured') {
        // dashed — return null for "even" segments so caller skips them
        return Math.floor(x / 10) % 2 === 0 ? null : cy
      }
      const t = (x / W) * Math.PI * 2 * 3.2
      const noiseAmt = status === 'degraded' ? noise * amp * 0.55 : noise * amp * 0.04
      return cy - Math.sin(t + phase) * amp - Math.sin(t * 1.9 + phase * 0.6) * amp * 0.22 - noiseAmt
    }

    const drawPass = (alpha: number, lw: number, blur: number) => {
      ctx.globalAlpha = alpha
      ctx.lineWidth   = lw
      ctx.shadowBlur  = blur
      ctx.shadowColor = color
      ctx.strokeStyle = color
      ctx.beginPath()
      let penDown = false
      for (let x = 0; x <= W; x += 1.5) {
        const y = computeY(x, phaseRef.current)
        if (y === null) { penDown = false; continue }
        if (!penDown) { ctx.moveTo(x, y); penDown = true }
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      ctx.globalAlpha = 1
      ctx.shadowBlur  = 0

      // subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'
      ctx.lineWidth = 1
      for (let gx = 0; gx < W; gx += 32) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke()
      }
      for (let gy = H * 0.25; gy < H; gy += H * 0.25) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke()
      }

      drawPass(0.18, 8, 24)  // glow halo
      drawPass(0.35, 4, 10)  // mid bloom
      drawPass(1,  1.2,  4)  // crisp line

      ctx.globalAlpha = 1
      ctx.shadowBlur  = 0
      phaseRef.current += speed

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(rafRef.current) }
  }, [status, latencyMs, color])  // safe deps — all stable or controlled

  return <canvas ref={canvasRef} width={420} height={70} className="w-full" />
}

/* ─────────────────────────────────────────────────────────────────────────────
   ECG master heartbeat — stable, only restarts when overallStatus changes
───────────────────────────────────────────────────────────────────────────── */
function MasterECG({ overallStatus, brandColors }: { overallStatus: string; brandColors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const headRef   = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cy = H / 2

    // fill once
    ctx.fillStyle = '#0D0D0D'
    ctx.fillRect(0, 0, W, H)

    const ecgDy = (x: number): number => {
      const p = ((x / W * 5) % 1 + 1) % 1
      if (p < 0.06)  return 0
      if (p < 0.12)  return -((p - 0.06) / 0.06) * H * 0.07
      if (p < 0.17)  return -H * 0.07 + ((p - 0.12) / 0.05) * H * 0.07
      if (p < 0.22)  return -((p - 0.17) / 0.05) * H * 0.38
      if (p < 0.245) return -H * 0.38 - ((p - 0.22) / 0.025) * H * 0.22
      if (p < 0.27)  return -H * 0.60 + ((p - 0.245) / 0.025) * H * 0.70
      if (p < 0.32)  return H * 0.10 - ((p - 0.27) / 0.05) * H * 0.10
      if (p < 0.50)  return ((p - 0.32) / 0.18) * H * 0.10
      if (p < 0.64)  return H * 0.10 - ((p - 0.50) / 0.14) * H * 0.10
      return 0
    }

    const lerpColor = (x: number): string => {
      if (brandColors.length < 2) return brandColors[0] ?? '#22c55e'
      const prog = x / W
      const seg  = Math.min(brandColors.length - 2, Math.floor(prog * (brandColors.length - 1)))
      const t    = prog * (brandColors.length - 1) - seg
      const a    = parseInt((brandColors[seg] ?? '#22c55e').slice(1), 16)
      const b    = parseInt((brandColors[seg + 1] ?? '#22c55e').slice(1), 16)
      const r    = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t)
      const g    = Math.round(((a >>  8) & 255) * (1 - t) + ((b >>  8) & 255) * t)
      const bl   = Math.round(( a        & 255) * (1 - t) + ( b        & 255) * t)
      return '#' + [r, g, bl].map(v => v.toString(16).padStart(2, '0')).join('')
    }

    const draw = () => {
      // fade trail
      ctx.fillStyle = 'rgba(13,13,13,0.17)'
      ctx.fillRect(0, 0, W, H)

      // erase ahead
      ctx.fillStyle = '#0D0D0D'
      ctx.fillRect(headRef.current, 0, 55, H)

      // dot grid
      ctx.fillStyle = 'rgba(255,255,255,0.03)'
      for (let gx = 0; gx < W; gx += 40) {
        for (let gy = 0; gy < H; gy += 16) {
          ctx.beginPath(); ctx.arc(gx, gy, 0.7, 0, Math.PI * 2); ctx.fill()
        }
      }

      const x  = headRef.current
      const dy = overallStatus === 'down' ? (Math.random() - 0.5) * H * 0.06 : ecgDy(x)
      const y  = cy + dy
      const col = lerpColor(x)

      // halo
      const grd = ctx.createRadialGradient(x, y, 0, x, y, 30)
      grd.addColorStop(0, col + 'bb')
      grd.addColorStop(1, col + '00')
      ctx.fillStyle = grd
      ctx.beginPath(); ctx.arc(x, y, 30, 0, Math.PI * 2); ctx.fill()

      // line segment
      const prevX = Math.max(0, x - 2.5)
      const prevY = cy + (overallStatus === 'down' ? 0 : ecgDy(prevX))
      ctx.strokeStyle = col
      ctx.lineWidth   = 2
      ctx.shadowColor = col
      ctx.shadowBlur  = 10
      ctx.beginPath(); ctx.moveTo(prevX, prevY); ctx.lineTo(x, y); ctx.stroke()

      // bright dot
      ctx.fillStyle   = '#ffffff'
      ctx.shadowColor = col
      ctx.shadowBlur  = 16
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill()
      ctx.shadowBlur  = 0

      // axis labels
      ctx.fillStyle = 'rgba(255,255,255,0.1)'
      ctx.font      = '9px monospace'
      ctx.fillText('mV', 4, 13)
      ctx.fillText('0', 4, cy + 3)

      headRef.current = (headRef.current + 2.2) % W
      rafRef.current  = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(rafRef.current) }
  }, [overallStatus, brandColors])

  return <canvas ref={canvasRef} width={900} height={110} className="w-full" style={{ borderRadius: 12 }} />
}

/* ─────────────────────────────────────────────────────────────────────────────
   Latency ring (SVG — no canvas, no crash risk)
───────────────────────────────────────────────────────────────────────────── */
function LatencyRing({ ms, color }: { ms: number; color: string }) {
  const r     = 17
  const circ  = 2 * Math.PI * r
  const pct   = Math.min(1, ms / 900)
  const dash  = pct * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 48, height: 48 }}>
      <svg width={48} height={48} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={24} cy={24} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
        <circle cx={24} cy={24} r={r} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color})`, transition: 'stroke-dasharray 0.7s ease' }} />
      </svg>
      <span className="absolute font-bold tabular-nums" style={{ color, fontSize: 9 }}>{ms}ms</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Sparkline — accumulates history across refreshes, safe canvas draw
───────────────────────────────────────────────────────────────────────────── */
function Sparkline({ history, color }: { history: number[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const W = canvas.width, H = canvas.height

    ctx.clearRect(0, 0, W, H)
    if (history.length < 2) return

    const max = Math.max(...history, 1)
    const pts = history.map((v, i) => ({
      x: (i / (history.length - 1)) * W,
      y: H - (v / max) * H * 0.85 - 1,
    }))

    // fill
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, color + '44')
    grad.addColorStop(1, color + '00')
    ctx.beginPath()
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath()
    ctx.fillStyle = grad; ctx.fill()

    // line
    ctx.beginPath()
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
    ctx.strokeStyle = color; ctx.lineWidth = 1.5
    ctx.shadowColor = color; ctx.shadowBlur = 4
    ctx.stroke(); ctx.shadowBlur = 0
  }, [history, color])

  return <canvas ref={canvasRef} width={80} height={28} />
}

/* ─────────────────────────────────────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────────────────────────────────────── */
function Count({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let cur = 0
    const step = Math.max(1, Math.ceil(to / 30))
    const id = setInterval(() => {
      cur = Math.min(cur + step, to)
      setN(cur)
      if (cur >= to) clearInterval(id)
    }, 20)
    return () => clearInterval(id)
  }, [to])
  return <>{n}{suffix}</>
}

/* ─────────────────────────────────────────────────────────────────────────────
   Detail rows (no hooks — pure render)
───────────────────────────────────────────────────────────────────────────── */
function DetailPill({ text, good }: { text: string; good: boolean }) {
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: good ? '#22c55e18' : '#ef444418', color: good ? '#22c55e' : '#ef4444' }}>
      {text}
    </span>
  )
}
function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
      <p className="text-white font-semibold mt-0.5 text-xs">{value}</p>
    </div>
  )
}
function ServiceDetails({ svc }: { svc: ServiceResult }) {
  const d = svc.details
  if (!d) return null

  if (svc.name === 'Stripe Webhooks' && Array.isArray(d.endpoints)) {
    if (d.endpoints.length === 0) return <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No webhooks registered.</p>
    return (
      <div className="space-y-2">
        {d.endpoints.map((ep: any, i: number) => (
          <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div>
              <p className="font-mono text-white text-xs truncate max-w-[220px]">{ep.url}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{ep.events} events · v{ep.apiVersion}</p>
            </div>
            <DetailPill text={ep.status} good={ep.status === 'enabled'} />
          </div>
        ))}
      </div>
    )
  }

  if (svc.name === 'Stripe API') {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(d).map(([k, v]) => (
          <DetailBox key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={String(v)} />
        ))}
      </div>
    )
  }

  if (svc.name === 'UptimeRobot' && Array.isArray(d.monitors)) {
    if (d.monitors.length === 0) return <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>No monitors configured.</p>
    return (
      <div className="space-y-2">
        {d.monitors.map((m: any, i: number) => (
          <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div>
              <p className="font-semibold text-white text-xs">{m.name}</p>
              <p className="font-mono text-xs mt-0.5 truncate max-w-[200px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{m.url}</p>
            </div>
            <div className="text-right ml-3">
              <DetailPill text={m.status} good={m.status === 'up'} />
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>↑ {m.uptimeRatio}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (svc.name === 'Resend Email' && Array.isArray(d.domains)) {
    return (
      <div className="space-y-2">
        {d.domains.map((dm: any, i: number) => (
          <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="text-white font-medium text-xs">{dm.name}</span>
            <DetailPill text={dm.status} good={dm.status === 'verified'} />
          </div>
        ))}
      </div>
    )
  }

  if (svc.name === 'Supabase Database') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <DetailBox label="Host" value={d.host ?? '—'} />
        <DetailBox label="Rows returned" value={String(d.rowsReturned ?? 0)} />
      </div>
    )
  }

  if (svc.name === 'Supabase Auth') {
    return <DetailBox label="Total registered users" value={String(d.totalUsers ?? '—')} />
  }

  if (svc.name === 'Environment Variables') {
    return (
      <div className="space-y-1.5">
        <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>Required</p>
        {(d.required ?? []).map((v: any) => (
          <div key={v.key} className="flex items-center gap-2 text-xs">
            <span style={{ color: v.set ? '#22c55e' : '#ef4444' }}>{v.set ? '✓' : '✗'}</span>
            <span className="font-mono text-white opacity-60">{v.key}</span>
          </div>
        ))}
        <p className="text-xs uppercase tracking-widest mt-2.5 mb-1.5" style={{ color: 'rgba(255,255,255,0.2)' }}>Optional</p>
        {(d.optional ?? []).map((v: any) => (
          <div key={v.key} className="flex items-center gap-2 text-xs">
            <span style={{ color: v.set ? '#22c55e' : '#475569' }}>{v.set ? '✓' : '○'}</span>
            <span className="font-mono text-white opacity-40">{v.key}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}

/* ─────────────────────────────────────────────────────────────────────────────
   Service card
───────────────────────────────────────────────────────────────────────────── */
function ServiceCard({ svc, idx, history }: { svc: ServiceResult; idx: number; history: number[] }) {
  const [open, setOpen] = useState(false)
  const brand      = BRAND[svc.name] ?? { color: '#94a3b8', label: svc.name, icon: '🔧' }
  const statusColor = STATUS_COLOR[svc.status]
  const hasDetails  = !!svc.details && Object.keys(svc.details).length > 0

  return (
    <div
      onClick={() => hasDetails && setOpen(v => !v)}
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${hasDetails ? 'cursor-pointer' : ''}`}
      style={{
        background: 'linear-gradient(145deg,#111116 0%,#0D0D12 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: open ? `0 0 0 1px ${brand.color}28, 0 8px 32px rgba(0,0,0,0.4)` : '0 1px 0 rgba(255,255,255,0.04)',
        opacity: 0,
        animation: `cardIn 0.45s ${idx * 60}ms cubic-bezier(0.16,1,0.3,1) both`,
      }}
    >
      {/* top accent line */}
      <div style={{ height: 2, background: `linear-gradient(90deg,transparent,${brand.color},transparent)` }} />

      {/* header */}
      <div className="flex items-start justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: brand.color + '18', boxShadow: `inset 0 0 0 1px ${brand.color}22` }}>
            {brand.icon}
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">{brand.label}</p>
            <p className="text-xs mt-0.5 max-w-[190px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{svc.message}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{ background: statusColor + '15', border: `1px solid ${statusColor}30` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: statusColor, boxShadow: `0 0 4px ${statusColor}` }} />
            <span className="text-xs font-semibold" style={{ color: statusColor }}>{STATUS_LABEL[svc.status]}</span>
          </div>
          {hasDetails && <span className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>{open ? '▲' : '▼'}</span>}
        </div>
      </div>

      {/* waveform */}
      <div className="px-3 py-1">
        <SignalWave status={svc.status} latencyMs={svc.responseTimeMs} color={brand.color} />
      </div>

      {/* footer: ring + sparkline + latency bar */}
      {svc.responseTimeMs != null && (
        <div className="flex items-center gap-3 px-4 pb-4">
          <LatencyRing ms={svc.responseTimeMs} color={brand.color} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>Response time</span>
              <Sparkline history={history} color={brand.color} />
            </div>
            <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min(100, (svc.responseTimeMs / 800) * 100)}%`,
                  background: `linear-gradient(90deg,${brand.color},${brand.color}88)`,
                  boxShadow: `0 0 8px ${brand.color}80`,
                }} />
            </div>
          </div>
        </div>
      )}

      {/* expanded details */}
      {open && svc.details && (
        <div className="border-t px-4 py-3 space-y-2"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
          <ServiceDetails svc={svc} />
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */
export default function SystemHealthPage() {
  const [data,        setData]        = useState<HealthData | null>(null)
  const [loading,     setLoading]     = useState(true)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [countdown,   setCountdown]   = useState(30)

  // Per-service latency history stored in a ref (no re-render on push)
  const historyRef = useRef<Record<string, number[]>>({})

  const doFetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/system-health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`${res.status}`)
      const json: HealthData = await res.json()
      // accumulate latency history
      json.services.forEach(s => {
        if (s.responseTimeMs == null) return
        if (!historyRef.current[s.name]) historyRef.current[s.name] = []
        historyRef.current[s.name]!.push(s.responseTimeMs)
        if (historyRef.current[s.name]!.length > 20) historyRef.current[s.name]!.shift()
      })
      setData(json)
      setLastChecked(new Date())
      setCountdown(30)
    } catch { /* silent — keep last data */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { doFetch() }, [doFetch])
  useEffect(() => {
    const r = setInterval(doFetch, 30_000)
    const t = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
    return () => { clearInterval(r); clearInterval(t) }
  }, [doFetch])

  const overall    = data?.overallStatus ?? 'healthy'
  const mainColor  = overall === 'healthy' ? '#22c55e' : overall === 'degraded' ? '#f59e0b' : '#ef4444'
  const mainLabel  = overall === 'healthy' ? 'All Systems Operational'
    : overall === 'degraded' ? 'Partial Degradation' : 'Issues Detected'

  // stable array of brand colors for ECG gradient — only changes when services change
  const brandColors = (data?.services ?? [])
    .filter(s => s.status !== 'unconfigured')
    .map(s => BRAND[s.name]?.color ?? '#22c55e')

  const stats = data ? [
    { label: 'Healthy',   n: data.services.filter(s => s.status === 'healthy').length,      color: '#22c55e', icon: '●' },
    { label: 'Degraded',  n: data.services.filter(s => s.status === 'degraded').length,     color: '#f59e0b', icon: '◐' },
    { label: 'Down',      n: data.services.filter(s => s.status === 'down').length,         color: '#ef4444', icon: '○' },
    { label: 'Scan time', n: data.totalMs,                                                  color: '#818cf8', icon: '◷', sfx: 'ms' },
  ] : []

  return (
    <>
      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(12px) scale(0.98); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes ticker {
          from { transform:translateX(0); }
          to   { transform:translateX(-50%); }
        }
      `}</style>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0D0D0D', minHeight: '88vh' }}>

        {/* ── top bar ── */}
        <div className="flex items-center justify-between px-6 py-3"
          style={{ background: '#111116', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="relative w-2.5 h-2.5">
              <span className="absolute inset-0 rounded-full animate-ping" style={{ background: mainColor, opacity: 0.5 }} />
              <span className="relative block w-2.5 h-2.5 rounded-full" style={{ background: mainColor, boxShadow: `0 0 8px ${mainColor}` }} />
            </div>
            <span className="text-sm font-bold text-white">System Health</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
              style={{ background: mainColor + '18', color: mainColor, border: `1px solid ${mainColor}30` }}>
              {loading ? 'Scanning…' : mainLabel}
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

        {/* ── ECG + stats ── */}
        <div className="px-6 pt-5 pb-4">
          <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            <MasterECG overallStatus={overall} brandColors={brandColors} />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {stats.map(s => (
              <div key={s.label} className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-xl" style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}>{s.icon}</span>
                <div>
                  <p className="text-xl font-black tabular-nums text-white leading-none">
                    <Count to={s.n} suffix={'sfx' in s ? (s as any).sfx : ''} />
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── section label ── */}
        <div className="flex items-center gap-3 px-6 mb-4">
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
          <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>Live Service Signals</span>
          <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>

        {/* ── cards ── */}
        <div className="px-6 pb-6">
          {loading && !data ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl animate-pulse"
                  style={{ background: '#111116', animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {(data?.services ?? []).map((svc, i) => (
                <ServiceCard
                  key={svc.name}
                  svc={svc}
                  idx={i}
                  history={historyRef.current[svc.name] ?? []}
                />
              ))}
            </div>
          )}

          {/* UptimeRobot nudge */}
          {data?.services.find(s => s.name === 'UptimeRobot' && s.status === 'unconfigured') && (
            <div className="mt-4 rounded-2xl px-5 py-4 text-xs"
              style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.18)' }}>
              <p className="font-semibold mb-1" style={{ color: '#38BDF8' }}>📡 Connect UptimeRobot</p>
              <p style={{ color: 'rgba(56,189,248,0.6)' }}>
                Add <code className="rounded px-1 font-mono" style={{ background: 'rgba(56,189,248,0.1)' }}>UPTIMEROBOT_API_KEY</code> to{' '}
                <code className="rounded px-1 font-mono" style={{ background: 'rgba(56,189,248,0.1)' }}>.env.local</code>. Get it from{' '}
                <a href="https://uptimerobot.com/dashboard" target="_blank" rel="noopener" className="underline" style={{ color: '#38BDF8' }}>
                  uptimerobot.com → My Settings → Main API Key
                </a>
              </p>
            </div>
          )}

          {/* scrolling ticker */}
          {data && (
            <div className="mt-5 overflow-hidden rounded-xl py-2"
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex gap-8 whitespace-nowrap text-xs"
                style={{ animation: 'ticker 26s linear infinite', width: 'max-content' }}>
                {[...data.services, ...data.services].map((s, i) => {
                  const b = BRAND[s.name]
                  return (
                    <span key={i} className="flex items-center gap-1.5 shrink-0">
                      <span style={{ color: b?.color ?? '#94a3b8', fontSize: 9 }}>●</span>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>{b?.label ?? s.name}</span>
                      <span style={{ color: STATUS_COLOR[s.status] }}>{STATUS_LABEL[s.status]}</span>
                      {s.responseTimeMs != null && <span style={{ color: 'rgba(255,255,255,0.18)' }}>{s.responseTimeMs}ms</span>}
                      <span style={{ color: 'rgba(255,255,255,0.08)' }} className="mx-2">·</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 mt-6">
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
