'use client'

// components/CertificateNameGate.tsx
// Shown on the course completion page when the user has no full_name set.
// They enter their name here → it's saved via /api/auth/update-name
// → page refreshes → server creates the certificate with the real name.

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CertificateNameGate() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Please enter your full name.')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/auth/update-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        setSaving(false)
        return
      }

      // Refresh the server component — it will re-read the user metadata,
      // find the full_name, auto-create the certificate, and show the download button.
      router.refresh()

    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
      setSaving(false)
    }
  }

  return (
    <div className="bg-white border-2 border-orange-300 rounded-xl px-8 py-6 max-w-md mx-auto">
      <div className="text-4xl mb-3 text-center">🏆</div>
      <p className="font-bold text-gray-900 text-xl mb-1 text-center">Your certificate is ready!</p>
      <p className="text-gray-500 text-sm text-center mb-5">
        Enter your full name so it appears correctly on your certificate.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            placeholder="e.g. John Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            disabled={saving}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
            autoFocus
          />
          <p className="text-xs text-gray-400 mt-1">
            This name will appear on your certificate of completion.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold text-sm py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Saving…
            </>
          ) : (
            'Generate my certificate →'
          )}
        </button>
      </form>
    </div>
  )
}
