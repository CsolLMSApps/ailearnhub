// components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)

  useEffect(() => {
    checkUser()

    // Detect device type
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const mobile = ios || /Android/i.test(navigator.userAgent)
    setIsIOS(ios)
    setIsMobile(mobile)

    // Already running as installed PWA — hide everything
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    ) {
      setIsInstalled(true)
      return
    }

    // Pick up prompt captured early by the inline script in layout.tsx
    if ((window as any).__pwaInstallPrompt) {
      setInstallPrompt((window as any).__pwaInstallPrompt)
    }

    // Also listen in case it fires after React mounts
    const handler = (e: any) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const onInstalled = () => {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (isIOS) {
      // iOS Safari: no prompt API — show manual guide
      setShowIOSGuide(true)
      return
    }
    if (!installPrompt) return
    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstalled(true)
      setInstallPrompt(null)
    }
  }

  // Show button if: not installed AND (has native prompt OR is mobile device)
  const showInstallBtn = !isInstalled && (installPrompt !== null || isMobile)

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-2xl font-bold text-[#FF6F00]">AI Learn Hub</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex gap-6">
              <Link href="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">Courses</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</Link>
            </nav>

            <div className="flex items-center gap-3">
              {/* Install App Button — always visible on mobile, visible on desktop when Chrome prompt ready */}
              {showInstallBtn && (
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#FF6F00] text-[#FF6F00] rounded-lg text-sm font-semibold hover:bg-[#FF6F00] hover:text-white transition-colors whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                  </svg>
                  <span>Install App</span>
                </button>
              )}

              {/* Auth Buttons */}
              {loading ? (
                <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
              ) : user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">Dashboard</Link>
                  <button onClick={handleSignOut} className="text-gray-600 hover:text-gray-900 transition-colors">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
                  <Link href="/signup" className="bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-[#E65100] transition-colors">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* iOS Install Guide Modal */}
      {showIOSGuide && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 px-4 pb-6"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Install AI Learn Hub</h2>
              <button onClick={() => setShowIOSGuide(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>
            <p className="text-sm text-gray-600 mb-5">Follow these steps to add the app to your home screen:</p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF6F00] text-white text-sm font-bold flex items-center justify-center shrink-0">1</span>
                <p className="text-sm text-gray-700">Tap the <strong>Share</strong> button at the bottom of your Safari browser
                  <span className="inline-block ml-1 text-base">⎙</span>
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF6F00] text-white text-sm font-bold flex items-center justify-center shrink-0">2</span>
                <p className="text-sm text-gray-700">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#FF6F00] text-white text-sm font-bold flex items-center justify-center shrink-0">3</span>
                <p className="text-sm text-gray-700">Tap <strong>"Add"</strong> in the top right corner</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full py-3 bg-[#FF6F00] text-white rounded-xl font-semibold hover:bg-[#E65100] transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  )
}
