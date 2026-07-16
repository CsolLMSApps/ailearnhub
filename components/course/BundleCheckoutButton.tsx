'use client'

// components/course/BundleCheckoutButton.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  upgradePriceCents: number  // $99 minus what user already paid
  ownedCourseCount: number
}

export default function BundleCheckoutButton({ upgradePriceCents, ownedCourseCount }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isUpgrade = ownedCourseCount > 0
  const label = isUpgrade
    ? `Upgrade for $${(upgradePriceCents / 100).toFixed(0)}`
    : 'Get Complete Bundle'

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
        body: JSON.stringify({
          isBundle: true,
          currency: 'usd',
          upgradePriceCents,
        }),
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
        {loading ? 'Processing...' : label}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
          {error}
        </p>
      )}
    </div>
  )
}
