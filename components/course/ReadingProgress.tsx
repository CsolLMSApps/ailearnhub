'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement
      const top = el.scrollTop  || document.body.scrollTop
      const h   = el.scrollHeight - el.clientHeight
      setPct(h > 0 ? Math.min(100, Math.round((top / h) * 100)) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="w-full bg-gray-100 h-0.5">
      <div
        className="bg-[#FF6F00] h-0.5 transition-[width] duration-100"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
