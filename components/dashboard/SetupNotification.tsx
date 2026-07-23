'use client'

// components/dashboard/SetupNotification.tsx
// Bell icon shown to users who purchased without signing up.
// Shows a mini account-setup form directly in the dropdown —
// name, email (read-only), password, confirm password.
// On submit updates the Supabase user in-place; bell disappears permanently.

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface SetupNotificationProps {
  passwordSet: boolean
  userEmail: string
  userName?: string
}

type Stage = 'form' | 'saving' | 'done' | 'error'

export default function SetupNotification({ passwordSet, userEmail, userName = '' }: SetupNotificationProps) {
  const [open, setOpen] = useState(false)
  const [stage, setStage] = useState<Stage>('form')
  const [name, setName] = useState(userName)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [validationError, setValidationError] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Bell disappears once setup is done
  if (passwordSet || stage === 'done') return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!name.trim()) {
      setValidationError('Please enter your name.')
      return
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setValidationError('Passwords do not match.')
      return
    }

    setStage('saving')

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.updateUser({
        password,
        data: {
          full_name: name.trim(),
          password_set: true,
        },
      })

      if (error) {
        setValidationError(error.message)
        setStage('form')
        return
      }

      setStage('done') // bell unmounts
      // Reload so the header shows the updated name
      window.location.reload()
    } catch (err: any) {
      setValidationError(err.message || 'Something went wrong. Please try again.')
      setStage('form')
    }
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell animation keyframes */}
      <style>{`
        @keyframes bell-ring {
          0%, 80%, 100% { transform: rotate(0deg); }
          82%  { transform: rotate(-18deg); }
          84%  { transform: rotate(18deg); }
          86%  { transform: rotate(-14deg); }
          88%  { transform: rotate(14deg); }
          90%  { transform: rotate(-8deg); }
          92%  { transform: rotate(8deg); }
          94%  { transform: rotate(-4deg); }
          96%  { transform: rotate(4deg); }
          98%  { transform: rotate(0deg); }
        }
      `}</style>

      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-full hover:bg-orange-50 transition-colors"
        aria-label="Complete account setup"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#FF6F00]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          style={{
            animation: 'bell-ring 10s ease-in-out infinite',
            transformOrigin: 'top center',
            display: 'block',
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {/* Red dot badge */}
        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Complete your account setup</span>
            <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
              Action needed
            </span>
          </div>

          <div className="p-4">
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              You bought this course without signing up. Enter your details below to secure your account — takes 10 seconds.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  disabled={stage === 'saving'}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Email — read-only */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Create password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={stage === 'saving'}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    tabIndex={-1}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">At least 6 characters</p>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Confirm password</label>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  disabled={stage === 'saving'}
                  className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent disabled:opacity-50"
                />
              </div>

              {/* Validation error */}
              {validationError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {validationError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={stage === 'saving'}
                className="w-full text-sm font-bold bg-[#FF6F00] text-white py-2.5 px-4 rounded-lg hover:bg-[#E65100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {stage === 'saving' ? 'Saving…' : 'Complete Setup'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
