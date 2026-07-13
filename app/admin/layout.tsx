// app/admin/layout.tsx
// SERVER-SIDE AUTH GUARD — only srikanth@ctekksolutions.net can access.
// Everyone else is silently redirected to /dashboard with no hint admin exists.

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'srikanth@ctekksolutions.net'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Not logged in → login
  if (!user) redirect('/login')

  // Not the admin → silently back to dashboard (no 403, no hint)
  if (user.email !== ADMIN_EMAIL) redirect('/dashboard')

  const navLinks = [
    { href: '/admin', label: '📊 Overview' },
    { href: '/admin/users', label: '👥 Users' },
    { href: '/admin/courses', label: '📚 Courses' },
    { href: '/admin/purchases', label: '💳 Purchases' },
    { href: '/admin/quiz-results', label: '📝 Quiz Results' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
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
              <span className="text-gray-400 text-sm hidden sm:block">{user.email}</span>
              <Link
                href="/dashboard"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <Link
                href="/auth/signout"
                className="text-sm text-gray-300 hover:text-red-400 transition-colors"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Nav */}
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

          {/* Page Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
