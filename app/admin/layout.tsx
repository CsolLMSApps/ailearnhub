// app/admin/layout.tsx
// Auth is 100% handled by proxy.ts before this layout ever runs.
// proxy.ts redirects unauthenticated users to /login and non-admins to /dashboard.
// This layout just renders — no duplicate auth check needed.

import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Read email for display only — NOT an auth gate.
  // If session can't be read for any reason, we still render (proxy already gated access).
  let userEmail = ''
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    userEmail = session?.user?.email ?? ''
  } catch {
    // silently continue — email display is cosmetic
  }

  const navLinks = [
    { href: '/admin', label: '📊 Overview' },
    { href: '/admin/analytics', label: '📈 Analytics' },
    { href: '/admin/users', label: '👥 Users' },
    { href: '/admin/courses', label: '📚 Courses' },
    { href: '/admin/purchases', label: '💳 Purchases' },
    { href: '/admin/quiz-results', label: '📝 Quiz Results' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#212121] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-[#FF6F00]">AI Learn Hub</span>
              <span className="text-gray-400 text-sm">|</span>
              <span className="text-sm font-semibold text-white bg-[#FF6F00] px-2 py-0.5 rounded">
                ADMIN PANEL
              </span>
            </div>
            <div className="flex items-center gap-4">
              {userEmail && (
                <span className="text-gray-400 text-sm hidden sm:block">{userEmail}</span>
              )}
              <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                ← Back to Dashboard
              </Link>
              <Link href="/auth/signout" className="text-sm text-gray-300 hover:text-red-400 transition-colors">
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-48 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6F00] border-b border-gray-100 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
