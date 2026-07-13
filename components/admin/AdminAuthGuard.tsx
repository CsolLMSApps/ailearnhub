'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Keep in sync with:
//   - app/dashboard/page.tsx (process.env.ADMIN_EMAILS fallback)
//   - middleware.ts does NOT check admin status — only auth
const ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    function handleUser(user: { email?: string } | null | undefined) {
      if (!user) {
        router.replace('/login')
        return
      }
      if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() ?? '')) {
        router.replace('/dashboard')
        return
      }
      setChecked(true)
    }

    // onAuthStateChange fires immediately with the current session on mount
    // (INITIAL_SESSION event), so we don't need a separate getSession() call.
    // This is more reliable than getSession() which can return stale data
    // before the middleware-refreshed token is written to storage.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleUser(session?.user)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6F00] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Verifying access...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
