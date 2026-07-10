'use client'

import { useEffect } from 'react'

/**
 * Fires once on mount and marks this module as visited/complete.
 * Used for modules 1–(N-1). The last module is only completed via quiz pass.
 */
export function AutoMarkVisited({ slug, moduleNumber }: { slug: string; moduleNumber: number }) {
  useEffect(() => {
    fetch('/api/progress/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, moduleNumber }),
    }).catch(() => {/* silent — non-critical */})
  }, [slug, moduleNumber])

  return null
}
