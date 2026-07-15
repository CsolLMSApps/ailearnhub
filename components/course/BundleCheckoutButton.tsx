'use client'

// components/course/BundleCheckoutButton.tsx
// Handles checkout for the Complete AI Mastery Bundle

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BundleCheckoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleBundleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login?redirect=/pricing&action=bundle')
        return
      }

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
        className="bg-white text-[#FF6F00] font-bold py-4 px-12 rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Get Complete Bundle'}
      </button>

      {error && (
        <p className="mt-3 text-sm text-white/90 bg-red-500/30 border border-red-300/50 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
