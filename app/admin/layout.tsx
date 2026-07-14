import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { adminFetchAll } from '@/lib/supabase/admin'

// Permanent superadmins — always have access regardless of the DB
const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

const navLinks = [
  { href: '/admin', label: '📊 Overview' },
  { href: '/admin/analytics', label: '📈 Analytics' },
  { href: '/admin/users', label: '👥 Users' },
  { href: '/admin/courses', label: '📚 Courses' },
  { href: '/admin/modules', label: '🎓 Modules' },
  { href: '/admin/purchases', label: '💳 Purchases' },
  { href: '/admin/quiz-results', label: '📝 Quiz Results' },
  { href: '/admin/admin-access', label: '🔑 Admin Access' },
  { href: '/admin/system-health', label: '🩺 System Health' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // The proxy (proxy.ts / middleware) verifies the user via Supabase and stamps
  // their email into the x-user-email request header. We trust that header here
  // because the proxy strips any incoming x-user-email before setting its own.
  const headersList = await headers()
  const userEmail = headersList.get('x-user-email')

  if (!userEmail) redirect('/login')

  const email = userEmail.toLowerCase()

  // 1. Check permanent superadmin list first (no DB call needed)
  let hasAccess = SUPER_ADMIN_EMAILS.includes(email)

  // 2. If not a superadmin, check the dynamic admin_users table
  if (!hasAccess) {
    const { data } = await adminFetchAll(
      'admin_users',
      `email=eq.${encodeURIComponent(email)}&select=email`
    )
    hasAccess = data.length > 0
  }

  if (!hasAccess) redirect('/dashboard')

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
              <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                ← Back to Dashboard
              </Link>
              <form action="/auth/signout" method="POST">
                <button type="submit" className="text-sm text-gray-300 hover:text-red-400 transition-colors">
                  Sign Out
                </button>
              </form>
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
