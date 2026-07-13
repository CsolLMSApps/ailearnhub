'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
]

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    async function verify() {
      const supabase = createClient()

      // getSession() reads from browser storage — no network call, always works.
      // getUser() makes an API call which can fail if Supabase is slow.
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

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

    verify()
  }, [router])

  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6F00] mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
