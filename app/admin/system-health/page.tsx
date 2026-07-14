'use client'

import { useEffect, useState, useCallback } from 'react'

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

const STATUS_CONFIG = {
  healthy:      { label: 'Healthy',      dot: 'bg-green-500',  badge: 'bg-green-100 text-green-800',  icon: '✅' },
  degraded:     { label: 'Degraded',     dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
  down:         { label: 'Down',         dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',       icon: '❌' },
  unconfigured: { label: 'Not Set Up',   dot: 'bg-gray-300',   badge: 'bg-gray-100 text-gray-500',     icon: '⚙️' },
}

const OVERALL_CONFIG = {
  healthy:   { label: 'All Systems Operational', bg: 'bg-green-50',  border: 'border-green-200', text: 'text-green-800' },
  degraded:  { label: 'Partial Degradation',     bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800' },
  unhealthy: { label: 'System Issues Detected',  bg: 'bg-red-50',    border: 'border-red-200',    text: 'text-red-800' },
}

function ServiceCard({ service }: { service: ServiceResult }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[service.status]
  const hasDetails = service.details && Object.keys(service.details).length > 0

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div
        className={`flex items-center justify-between px-5 py-4 ${hasDetails ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors`}
        onClick={() => hasDetails && setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3">
          {/* Pulsing dot for down status */}
          <span className="relative flex h-3 w-3">
            <span className={`${cfg.dot} rounded-full h-3 w-3 ${service.status === 'down' ? 'animate-ping absolute inline-flex opacity-75' : ''}`} />
            <span className={`${cfg.dot} rounded-full h-3 w-3 ${service.status === 'down' ? 'relative inline-flex' : ''}`} />
          </span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{service.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{service.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {service.responseTimeMs !== undefined && (
            <span className="text-xs text-gray-400 tabular-nums">{service.responseTimeMs}ms</span>
          )}
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
            {cfg.label}
          </span>
          {hasDetails && (
            <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
          )}
        </div>
      </div>

      {/* Expanded details */}
      {expanded && service.details && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 text-xs text-gray-600 space-y-3">
          {/* Stripe account */}
          {service.name === 'Stripe API' && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(service.details).map(([k, v]) => (
                <div key={k}>
                  <span className="text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}: </span>
                  <span className="font-medium text-gray-700">{String(v)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stripe webhooks */}
          {service.name === 'Stripe Webhooks' && Array.isArray(service.details.endpoints) && (
            <div className="space-y-2">
              {service.details.endpoints.length === 0 ? (
                <p className="text-gray-400">No webhook endpoints registered in Stripe.</p>
              ) : (
                service.details.endpoints.map((ep: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-mono text-xs text-gray-700 truncate max-w-xs">{ep.url}</p>
                      <p className="text-gray-400 mt-0.5">{ep.events} events · API {ep.apiVersion}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${ep.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {ep.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* UptimeRobot monitors */}
          {service.name === 'UptimeRobot' && Array.isArray(service.details.monitors) && (
            <div className="space-y-2">
              {service.details.monitors.length === 0 ? (
                <p className="text-gray-400">No monitors configured in UptimeRobot.</p>
              ) : (
                service.details.monitors.map((m: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-medium text-gray-800">{m.name}</p>
                      <p className="font-mono text-gray-400 mt-0.5 truncate max-w-xs">{m.url}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        m.status === 'up' ? 'bg-green-100 text-green-700' :
                        m.status === 'paused' ? 'bg-gray-100 text-gray-500' :
                        'bg-red-100 text-red-600'
                      }`}>{m.status}</span>
                      <p className="text-gray-400 mt-0.5">Uptime: {m.uptimeRatio}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Resend domains */}
          {service.name === 'Resend Email' && Array.isArray(service.details.domains) && (
            <div className="space-y-2">
              {service.details.domains.map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <span className="font-medium text-gray-800">{d.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{d.region}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${d.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Supabase details */}
          {service.name === 'Supabase Database' && (
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-gray-400">Host: </span><span className="font-medium">{service.details.host}</span></div>
              <div><span className="text-gray-400">Rows returned: </span><span className="font-medium">{service.details.rowsReturned}</span></div>
            </div>
          )}

          {/* Supabase Auth */}
          {service.name === 'Supabase Auth' && (
            <div><span className="text-gray-400">Total users: </span><span className="font-medium">{service.details.totalUsers}</span></div>
          )}

          {/* Env vars */}
          {service.name === 'Environment Variables' && (
            <div className="space-y-2">
              <p className="font-semibold text-gray-700">Required</p>
              {service.details.required?.map((v: any) => (
                <div key={v.key} className="flex items-center gap-2">
                  <span className={v.set ? 'text-green-600' : 'text-red-600'}>{v.set ? '✓' : '✗'}</span>
                  <span className="font-mono">{v.key}</span>
                </div>
              ))}
              <p className="font-semibold text-gray-700 mt-3">Optional</p>
              {service.details.optional?.map((v: any) => (
                <div key={v.key} className="flex items-center gap-2">
                  <span className={v.set ? 'text-green-600' : 'text-gray-400'}>{v.set ? '✓' : '○'}</span>
                  <span className="font-mono">{v.key}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SystemHealthPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [countdown, setCountdown] = useState(30)

  const fetch_ = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/system-health', { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setData(json)
      setLastRefreshed(new Date())
      setCountdown(30)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => { fetch_() }, [fetch_])

  // Auto-refresh every 30s + countdown ticker
  useEffect(() => {
    const interval = setInterval(() => fetch_(), 30_000)
    const tick = setInterval(() => setCountdown(c => Math.max(0, c - 1)), 1_000)
    return () => { clearInterval(interval); clearInterval(tick) }
  }, [fetch_])

  const overall = data ? OVERALL_CONFIG[data.overallStatus] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-sm text-gray-500 mt-1">
            Live connectivity status for all integrated services.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefreshed && (
            <span className="text-xs text-gray-400">
              Last checked {lastRefreshed.toLocaleTimeString()} · refreshing in {countdown}s
            </span>
          )}
          <button
            onClick={fetch_}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {loading ? '⟳ Checking…' : '⟳ Refresh'}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          ❌ Failed to load health data: {error}
        </div>
      )}

      {/* Overall status banner */}
      {data && overall && (
        <div className={`rounded-xl border px-5 py-4 flex items-center justify-between ${overall.bg} ${overall.border}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {data.overallStatus === 'healthy' ? '✅' : data.overallStatus === 'degraded' ? '⚠️' : '🔴'}
            </span>
            <div>
              <p className={`font-bold text-base ${overall.text}`}>{overall.label}</p>
              <p className={`text-xs mt-0.5 ${overall.text} opacity-70`}>
                {data.services.filter(s => s.status === 'healthy').length} healthy ·{' '}
                {data.services.filter(s => s.status === 'degraded').length} degraded ·{' '}
                {data.services.filter(s => s.status === 'down').length} down ·{' '}
                {data.services.filter(s => s.status === 'unconfigured').length} not configured
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xs ${overall.text} opacity-70`}>Total check time</p>
            <p className={`text-lg font-bold tabular-nums ${overall.text}`}>{data.totalMs}ms</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !data && (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 h-16 animate-pulse" />
          ))}
        </div>
      )}

      {/* Service cards */}
      {data && (
        <div className="space-y-3">
          {data.services.map(service => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      )}

      {/* UptimeRobot setup tip */}
      {data?.services.find(s => s.name === 'UptimeRobot' && s.status === 'unconfigured') && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
          <p className="font-semibold mb-1">⚙️ Enable UptimeRobot monitoring</p>
          <p className="text-blue-700">
            Add <code className="bg-blue-100 px-1 rounded font-mono text-xs">UPTIMEROBOT_API_KEY</code> to your{' '}
            <code className="bg-blue-100 px-1 rounded font-mono text-xs">.env.local</code> file.
            Get your key from{' '}
            <a href="https://uptimerobot.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-medium">
              uptimerobot.com/dashboard
            </a>{' '}
            → My Settings → API Settings → Main API Key.
          </p>
        </div>
      )}
    </div>
  )
}
