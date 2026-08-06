'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteAccountButton() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    const res = await fetch('/api/profile/delete-account', { method: 'DELETE' })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Failed to delete account. Please try again.')
      setLoading(false)
      return
    }

    // Account deleted — redirect to home
    window.location.href = '/'
  }

  if (confirming) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-semibold text-red-600">
          Are you sure? Type <strong>DELETE</strong> to confirm, then click the button.
        </p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Deleting...' : 'Yes, delete my account'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={loading}
            className="bg-white border border-gray-300 text-gray-700 text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="bg-white border border-red-300 text-red-600 hover:bg-red-50 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
    >
      Delete My Account
    </button>
  )
}
