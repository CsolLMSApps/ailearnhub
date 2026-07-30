'use client'

// app/(auth)/setup-account/SetupAccountClient.tsx
// Client form: name + password. Submits to /api/auth/complete-setup,
// then signs in with the new password and redirects to /dashboard.

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  token: string
  email: string
}

type Stage = 'form' | 'saving' | 'success' | 'error'

export default function SetupAccountClient({ token, email }: Props) {
  const [stage, setStage] = useState<Stage>('form')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setStage('saving')

    try {
      // 1. Verify token + update user via our API
      const res = await fetch('/api/auth/complete-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, name: name.trim(), password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStage('form')
        return
      }

      // 2. Sign in with the new password
      const supabase = createClient()
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInErr) {
        setErrorMsg('Account set up, but auto-login failed. Please log in manually.')
        setStage('error')
        return
      }

      // 3. Success — redirect to dashboard
      setStage('success')
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 1500)

    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong.')
      setStage('form')
    }
  }

  if (stage === 'success') {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center space-y-4">
          <div className="text-5xl">🎉</div>
          <h1 className="text-xl font-bold text-gray-900">Account set up!</h1>
          <p className="text-gray-500 text-sm">Taking you to your dashboard…</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF6F00]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-[#FF6F00] text-white font-bold text-sm px-4 py-1.5 rounded-full mb-4 tracking-wide">
            AI LEARN HUB
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Set up your account</h1>
          <p className="text-gray-500 text-sm">
            Add your name and create a password to access your course anytime.
          </p>
          <p className="text-xs text-gray-400 mt-1">{email}</p>
        </div>

        {/* Form card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errorMsg}</p>
              </div>
            )}

            {/* Full name */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Full name <span className="text-[#FF6F00]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={stage === 'saving'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
              />
              <p className="text-xs text-gray-400">This will appear on your certificate of completion.</p>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Password <span className="text-[#FF6F00]">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={stage === 'saving'}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-400">At least 6 characters</p>
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Confirm password <span className="text-[#FF6F00]">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                minLength={6}
                disabled={stage === 'saving'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={stage === 'saving'}
              className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {stage === 'saving' ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Setting up your account…
                </>
              ) : (
                'Complete setup & go to dashboard →'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
