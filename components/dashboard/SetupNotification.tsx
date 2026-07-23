'use client'

// components/dashboard/SetupNotification.tsx
// Bell icon in the dashboard header that alerts users who haven't set a
// password yet (password_set !== true in user metadata).
// Disappears once the user sets their password.

import { useState, useRef, useEffect } from 'react'

interface SetupNotificationProps {
  passwordSet: boolean
  userEmail: string
}

export default function SetupNotification({ passwordSet, userEmail }: SetupNotificationProps) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Don't render if password is already set
  if (passwordSet) return null

  const handleSendLink = async () => {
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-setup-link', { method: 'POST' })
      if (!res.ok) throw new Error('Failed to send link')
      setSent(true)
    } catch (err: any) {
      setError('Could not send the link. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="relative p-2 rounded-full hover:bg-orange-50 transition-colors"
        aria-label="Account setup notification"
      >
        {/* Bell icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-[#FF6F00]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
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

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Notifications</span>
            <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">1 action needed</span>
          </div>

          {/* Notification item */}
          <div className="p-4">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-base">
                🔐
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-0.5">
                  Secure your account
                </p>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                  You're currently logged in via a one-time link. Set a password so you can log in anytime.
                </p>

                {sent ? (
                  <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    ✅ Link sent to <strong>{userEmail}</strong>. Check your inbox.
                  </div>
                ) : (
                  <>
                    {error && (
                      <p className="text-xs text-red-600 mb-2">{error}</p>
                    )}
                    <button
                      onClick={handleSendLink}
                      disabled={sending}
                      className="w-full text-sm font-semibold bg-[#FF6F00] text-white py-2 px-4 rounded-lg hover:bg-[#E65100] transition-colors disabled:opacity-50"
                    >
                      {sending ? 'Sending…' : 'Send me a setup link →'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Link will be sent to {userEmail} · Expires in 24 hrs
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
