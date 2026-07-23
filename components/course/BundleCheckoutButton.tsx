'use client'

// components/course/BundleCheckoutButton.tsx
// Always charges $99 — no deductions for previous purchases.

import { useState } from 'react'

export default function BundleCheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBundleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBundle: true, currency: 'usd' }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }

    } catch (err: any) {
      console.error('Bundle checkout error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleBundleCheckout}
        disabled={loading}
        className="bg-[#FF6F00] text-white font-bold py-4 px-12 rounded-xl hover:bg-[#E65100] transition-colors text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Get Complete Bundle'}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
