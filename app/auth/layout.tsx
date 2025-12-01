import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Minimal Header for Auth Pages */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-[#FF6F00] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <span className="text-xl font-bold text-[#212121]">AI Learn Hub</span>
          </Link>

          {/* Simple Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-[#FF6F00] transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/courses" 
              className="text-gray-700 hover:text-[#FF6F00] transition-colors"
            >
              Courses
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-[#FF6F00] transition-colors"
            >
              Pricing
            </Link>
          </nav>

          {/* Mobile Menu Toggle (if needed) */}
          <div className="md:hidden">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-[#FF6F00]"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        {children}
      </main>

      {/* Minimal Footer for Auth Pages */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-sm text-gray-600">
              © 2024 AI Learn Hub. All rights reserved.
            </p>

            {/* Footer Links */}
            <div className="flex items-center space-x-6">
              <Link 
                href="/terms" 
                className="text-sm text-gray-600 hover:text-[#FF6F00] transition-colors"
              >
                Terms
              </Link>
              <Link 
                href="/privacy" 
                className="text-sm text-gray-600 hover:text-[#FF6F00] transition-colors"
              >
                Privacy
              </Link>
              <Link 
                href="/about" 
                className="text-sm text-gray-600 hover:text-[#FF6F00] transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
