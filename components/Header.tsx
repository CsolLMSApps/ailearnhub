'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#FF6F00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AI Learn Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              href="/courses" 
              className="text-gray-700 hover:text-[#FF6F00] font-medium transition-colors"
            >
              Courses
            </Link>
            <Link 
              href="/pricing" 
              className="text-gray-700 hover:text-[#FF6F00] font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-[#FF6F00] font-medium transition-colors"
            >
              About
            </Link>
            
            {/* Auth Links - CORRECTED URLs */}
            <Link 
              href="/auth/login" 
              className="text-gray-700 hover:text-[#FF6F00] font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF6F00] hover:bg-[#E65100] transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-[#FF6F00]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/courses"
              className="block px-3 py-2 text-gray-700 hover:text-[#FF6F00] hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-gray-700 hover:text-[#FF6F00] hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-[#FF6F00] hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/auth/login"
              className="block px-3 py-2 text-gray-700 hover:text-[#FF6F00] hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="block px-3 py-2 text-white bg-[#FF6F00] hover:bg-[#E65100] rounded-md font-medium text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
