'use client'

import { useState, Suspense, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import TurnstileWidget from '@/components/TurnstileWidget'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const redirectTo = searchParams?.get('redirect') || '/dashboard'
  const action = searchParams?.get('action')

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token)
  }, [])

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken(null)
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!captchaToken) {
      setError('Please complete the security check before signing in.')
      return
    }

    setLoading(true)

    try {
      const captchaRes = await fetch('/api/auth/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: captchaToken }),
      })
      if (!captchaRes.ok) {
        const d = await captchaRes.json()
        setError(d.error || 'CAPTCHA verification failed. Please try again.')
        setLoading(false)
        setCaptchaToken(null)
        return
      }

      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        window.location.href = redirectTo
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  return (
    <div className="flex min-h-screen">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #FF6F00 0%, #E65100 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/[0.06] pointer-events-none" />
        <div className="absolute top-1/2 -right-8 w-32 h-32 rounded-full bg-white/[0.05] pointer-events-none" />

        {/* Brand */}
        <div className="relative z-10">
          <Link href="/" className="text-white text-2xl font-extrabold tracking-tight">
            AI Learn Hub<span className="font-light opacity-70">.IO</span>
          </Link>
        </div>

        {/* Headline + stats */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-white text-3xl font-bold leading-snug">
              Advance your career<br />
              <span className="opacity-80 font-normal">with AI skills</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { icon: '🎓', label: 'Courses', value: '6 Expert-Led AI Courses' },
              { icon: '📜', label: 'On Completion', value: 'Verified Certificate' },
              { icon: '⚡', label: 'Access', value: 'Lifetime · Learn at Your Pace' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-white/60 text-[10px] uppercase tracking-widest">{label}</p>
                  <p className="text-white text-sm font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/40 text-xs">© 2026 AI Learn Hub LLC</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col justify-center bg-white px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">

          <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] text-sm font-semibold mb-8">
            ← Back to Home
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-8">
            {action === 'enroll' ? 'Sign in to enroll in the course' : 'Sign in to continue your learning journey'}
          </p>

          {/* Alerts */}
          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {redirectTo !== '/dashboard' && action === 'enroll' && (
            <div className="mb-5 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-700">Please sign in to continue with enrollment</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 focus:border-[#FF6F00] disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#FF6F00] hover:text-[#E65100] font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 focus:border-[#FF6F00] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Turnstile CAPTCHA */}
            <div>
              <TurnstileWidget
                onVerify={handleCaptchaVerify}
                onExpire={handleCaptchaExpire}
              />
              {!captchaToken && (
                <p className="text-xs text-gray-400 mt-1">Security check required to sign in</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !captchaToken}
              className="w-full bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link
              href={redirectTo !== '/dashboard' ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup'}
              className="text-[#FF6F00] hover:text-[#E65100] font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6F00]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
