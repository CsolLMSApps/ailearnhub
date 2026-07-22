'use client'

// components/course/EnrollButton.tsx
// Client component for handling course enrollment/purchase

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EnrollButtonProps {
  slug: string
  fullWidth?: boolean
}

export default function EnrollButton({ slug, fullWidth = false }: EnrollButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEnroll = async () => {
    setLoading(true)
    setError('')

    try {
      // Go straight to checkout — no login required
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          currency: 'usd',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }

    } catch (err: any) {
      console.error('Enrollment error:', err)
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className={`${
          fullWidth ? 'w-full' : ''
        } bg-white text-[#FF6F00] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? 'Processing...' : 'Enroll Now'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  )
}
