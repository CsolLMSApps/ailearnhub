'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Keep in sync with app/dashboard/page.tsx
const ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let mounted = true

    async function checkAccess() {
      try {
        const supabase = createClient()

        // Step 1: getSession() — reads from browser storage (localStorage/cookies).
        // Fast, no network call. Works when the browser client stored the session at login.
        const { data: { session } } = await supabase.auth.getSession()
        let email = session?.user?.email

        // Step 2: If storage returned nothing, fall back to getUser().
        // This makes a network call to Supabase and works even when the session is
        // only in server-side cookies (set by the proxy/middleware), which
        // document.cookie can't read if they're HttpOnly.
        if (!email) {
          const { data: { user } } = await supabase.auth.getUser()
          email = user?.email ?? undefined
        }

        if (!mounted) return

        if (!email) {
          router.replace('/login')
          return
        }

        if (!ADMIN_EMAILS.includes(email.toLowerCase())) {
          router.replace('/dashboard')
          return
        }

        setChecked(true)
      } catch (err) {
        console.error('[AdminAuthGuard] auth check failed:', err)
        if (mounted) router.replace('/login')
      }
    }

    checkAccess()

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
