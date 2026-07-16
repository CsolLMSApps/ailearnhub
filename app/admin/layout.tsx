import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { adminFetchAll } from '@/lib/supabase/admin'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

const navLinks = [
  { href: '/admin',               label: '📊 Overview' },
  { href: '/admin/analytics',     label: '📈 Analytics' },
  { href: '/admin/users',         label: '👥 Users' },
  { href: '/admin/courses',       label: '📚 Courses' },
  { href: '/admin/modules',       label: '🎓 Modules' },
  { href: '/admin/purchases',     label: '💳 Purchases' },
  { href: '/admin/quiz-results',  label: '📝 Quiz Results' },
  { href: '/admin/quiz',          label: '❓ Quiz Editor' },
  { href: '/admin/student-view',  label: '👁️ Student View' },
  { href: '/admin/admin-access',  label: '🔑 Admin Access' },
  { href: '/admin/system-health', label: '🩺 System Health' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const userEmail = headersList.get('x-user-email')

  if (!userEmail) redirect('/login')

  const email = userEmail.toLowerCase()
  let hasAccess = SUPER_ADMIN_EMAILS.includes(email)

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
      {/* Top header */}
      <header className="bg-[#212121] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg font-bold text-[#FF6F00] shrink-0">AI Learn Hub</span>
              <span className="hidden sm:inline text-gray-400 text-sm">|</span>
              <span className="hidden sm:inline text-xs font-semibold text-white bg-[#FF6F00] px-2 py-0.5 rounded shrink-0">
                ADMIN
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/dashboard" className="text-xs text-gray-300 hover:text-white transition-colors whitespace-nowrap">
                ← Dashboard
              </Link>
              <form action="/auth/signout" method="POST">
                <button type="submit" className="text-xs text-gray-300 hover:text-red-400 transition-colors">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile horizontal nav — scrollable pills */}
        <div className="md:hidden border-t border-white/10 overflow-x-auto">
          <div className="flex gap-1 px-3 py-2 w-max">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
        {/* Desktop: sidebar + content */}
        <div className="flex gap-6">
          {/* Sidebar — desktop only */}
          <aside className="hidden md:block w-44 shrink-0">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-20">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#FF6F00] border-b border-gray-100 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content — full width on mobile */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
