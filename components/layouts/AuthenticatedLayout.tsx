// components/layouts/AuthenticatedLayout.tsx
// Shared layout for all logged-in user pages

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface AuthenticatedLayoutProps {
  children: React.ReactNode
  user: {
    email: string
    user_metadata?: {
      full_name?: string
    }
  }
}

export default function AuthenticatedLayout({ children, user }: AuthenticatedLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Single Unified Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-[#FF6F00]">
              AI Learn Hub
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/courses" 
                className={`text-gray-700 hover:text-[#FF6F00] transition-colors ${
                  pathname === '/courses' ? 'text-[#FF6F00] font-medium' : ''
                }`}
              >
                Courses
              </Link>
              <Link 
                href="/pricing" 
                className={`text-gray-700 hover:text-[#FF6F00] transition-colors ${
                  pathname === '/pricing' ? 'text-[#FF6F00] font-medium' : ''
                }`}
              >
                Pricing
              </Link>
              <Link 
                href="/dashboard" 
                className={`text-gray-700 hover:text-[#FF6F00] transition-colors ${
                  pathname === '/dashboard' ? 'text-[#FF6F00] font-medium' : ''
                }`}
              >
                My Learning
              </Link>
              <Link 
                href="/contact" 
                className={`text-gray-700 hover:text-[#FF6F00] transition-colors ${
                  pathname === '/contact' ? 'text-[#FF6F00] font-medium' : ''
                }`}
              >
                Contact
              </Link>
              
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </div>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-sm bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-[#E65100] transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Unified Footer */}
      <footer className="bg-[#212121] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#FF6F00]">AI Learn Hub</h3>
              <p className="text-gray-400 text-sm">
                Master AI skills with practical, hands-on courses designed for professionals.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/courses" className="hover:text-[#FF6F00]">Browse All</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#FF6F00]">My Learning</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-[#FF6F00]">About</Link></li>
                <li><Link href="/terms" className="hover:text-[#FF6F00]">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-[#FF6F00]">Privacy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-[#FF6F00]">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contact" className="hover:text-[#FF6F00]">Contact Us</Link></li>
                <li><a href="mailto:support@ailearnhub.io" className="hover:text-[#FF6F00]">support@ailearnhub.io</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 AI Learn Hub LLC. All rights reserved.</p>
            <p className="mt-2">701 Brazos Street Suite 720, Austin, TX 78701</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
