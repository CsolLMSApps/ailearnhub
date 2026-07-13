'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// We intentionally do NOT use the browser Supabase client here.
// The browser client (createBrowserClient from @supabase/ssr) cannot reliably
// read the session after a server-side token refresh because the refreshed
// cookies may not be accessible via document.cookie.
//
// Instead we call /api/admin/check-auth which uses the server Supabase client
// (reads cookies from the HTTP request — always works).

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let mounted = true

    fetch('/api/admin/check-auth')
      .then(async (res) => {
        if (!mounted) return
        if (res.status === 401) {
          router.replace('/login')
        } else if (res.status === 403) {
          router.replace('/dashboard')
        } else if (res.ok) {
          setChecked(true)
        } else {
          // Unexpected error — fail safe to login
          router.replace('/login')
        }
      })
      .catch(() => {
        if (mounted) router.replace('/login')
      })

    return () => {
      mounted = false
    }
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6F00] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
