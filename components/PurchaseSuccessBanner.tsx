'use client'

// components/PurchaseSuccessBanner.tsx
// Shown on /dashboard?purchase=success&course=SLUG after a guest completes
// checkout. Auto-refreshes after a few seconds to let the Stripe webhook
// finish creating the purchase + progress records.

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface PurchaseSuccessBannerProps {
  courseName?: string
}

export function PurchaseSuccessBanner({ courseName }: PurchaseSuccessBannerProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(4)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (dismissed) return
    if (countdown <= 0) {
      router.replace('/dashboard')
      router.refresh()
      return
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown, dismissed, router])

  if (dismissed) return null

  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
      <div className="text-3xl shrink-0">🎉</div>
      <div className="flex-1">
        <h3 className="font-bold text-green-800 text-lg">
          Purchase successful{courseName ? ` — ${courseName}` : ''}!
        </h3>
        <p className="text-green-700 text-sm mt-0.5">
          Your course is being unlocked. If you don't see it yet, the page will refresh in{' '}
          <span className="font-bold">{countdown}s</span>.
        </p>
      </div>
      <button
        onClick={() => {
          setDismissed(true)
          router.replace('/dashboard')
          router.refresh()
        }}
        className="text-green-400 hover:text-green-700 text-xl leading-none shrink-0 mt-0.5"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
