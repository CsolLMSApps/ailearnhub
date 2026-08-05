// components/layouts/AuthenticatedLayout.tsx
// Shared layout for all logged-in user pages

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

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

      <Footer />
    </div>
  )
}
