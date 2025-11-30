"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShowBanner(false)
    
    // Enable analytics if needed
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setShowBanner(false)
    
    // Disable analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-[#FF6F00] shadow-2xl">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[#212121] mb-2">
              🍪 We Value Your Privacy
            </h3>
            <p className="text-sm text-[#757575] leading-relaxed">
              We use cookies to improve your experience and analyze site traffic. 
              By clicking "Accept", you consent to our use of cookies. 
              We comply with <strong>GDPR</strong>, <strong>CCPA</strong>, and other privacy regulations.{' '}
              <Link href="/privacy" className="text-[#FF6F00] hover:underline">
                Learn more
              </Link>
              {' '}or{' '}
              <Link href="/cookie-settings" className="text-[#FF6F00] hover:underline">
                customize settings
              </Link>.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={declineCookies}
              className="border-2 border-[#757575] text-[#757575] hover:bg-[#757575] hover:text-white"
            >
              Decline
            </Button>
            <Button
              onClick={acceptCookies}
              className="bg-[#FF6F00] text-white hover:bg-[#E65100]"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
