"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function CookieSettingsPage() {
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)
  const [preferences, setPreferences] = useState(true)

  useEffect(() => {
    // Load saved preferences
    const consent = localStorage.getItem('cookieConsent')
    const saved = localStorage.getItem('cookiePreferences')
    
    if (saved) {
      const prefs = JSON.parse(saved)
      setAnalytics(prefs.analytics ?? true)
      setMarketing(prefs.marketing ?? false)
      setPreferences(prefs.preferences ?? true)
    }
  }, [])

  const savePreferences = () => {
    const prefs = {
      analytics,
      marketing,
      preferences
    }
    
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
    localStorage.setItem('cookieConsent', 'customized')
    
    // Update Google Analytics consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: analytics ? 'granted' : 'denied',
        ad_storage: marketing ? 'granted' : 'denied'
      })
    }
    
    alert('Your cookie preferences have been saved!')
  }

  const acceptAll = () => {
    setAnalytics(true)
    setMarketing(true)
    setPreferences(true)
    
    const prefs = {
      analytics: true,
      marketing: true,
      preferences: true
    }
    
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
    localStorage.setItem('cookieConsent', 'accepted')
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      })
    }
    
    alert('All cookies accepted!')
  }

  const rejectAll = () => {
    setAnalytics(false)
    setMarketing(false)
    setPreferences(false)
    
    const prefs = {
      analytics: false,
      marketing: false,
      preferences: false
    }
    
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
    localStorage.setItem('cookieConsent', 'declined')
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      })
    }
    
    alert('All optional cookies rejected!')
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-8">
        <Link href="/" className="text-[#FF6F00] hover:underline text-sm">
          ← Back to Home
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-[#212121] mb-4">
        Cookie Settings
      </h1>
      <p className="text-lg text-[#757575] mb-8">
        Manage your cookie preferences. You can enable or disable different types of cookies below.
      </p>

      {/* Information Cards */}
      <Card className="mb-6 border-l-4 border-[#FF6F00]">
        <CardHeader>
          <CardTitle className="text-xl">About Cookies</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#757575] leading-relaxed">
            Cookies are small text files stored on your device that help us provide and improve our services. 
            Some cookies are essential for the site to function, while others help us understand how you use our site.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6 border-l-4 border-[#FF6F00]">
        <CardHeader>
          <CardTitle className="text-xl">Your Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#757575] leading-relaxed">
            You can change these preferences at any time. Please note that some features may not work correctly if certain cookies are disabled.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8 border-l-4 border-[#FF6F00]">
        <CardHeader>
          <CardTitle className="text-xl">Data Protection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#757575] leading-relaxed mb-4">
            We comply with <strong>GDPR</strong>, <strong>CCPA</strong>, and other international privacy regulations. 
            Your data is protected and we never sell your personal information.
          </p>
          <Link href="/privacy" className="text-[#FF6F00] hover:underline font-medium">
            View our Privacy Policy →
          </Link>
        </CardContent>
      </Card>

      {/* Cookie Categories */}
      <div className="space-y-6">
        {/* Essential Cookies */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Essential Cookies</CardTitle>
                <CardDescription>Required for the website to function properly</CardDescription>
              </div>
              <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded">
                Always Active
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#757575]">
              These cookies are necessary for the website to function and cannot be disabled. They include:
              session management, security, and basic functionality.
            </p>
          </CardContent>
        </Card>

        {/* Analytics Cookies */}
        <Card className={analytics ? 'border-[#FF6F00]' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Analytics Cookies</CardTitle>
                <CardDescription>Help us understand how you use our website</CardDescription>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF6F00] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6F00]"></div>
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#757575]">
              We use Google Analytics to understand how visitors interact with our site. This helps us improve 
              your experience and create better content. No personal information is collected.
            </p>
          </CardContent>
        </Card>

        {/* Marketing Cookies */}
        <Card className={marketing ? 'border-[#FF6F00]' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Marketing Cookies</CardTitle>
                <CardDescription>Used to show you relevant advertisements</CardDescription>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF6F00] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6F00]"></div>
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#757575]">
              These cookies track your browsing habits to show you personalized ads. We currently do not use 
              marketing cookies, but this setting is available for future use.
            </p>
          </CardContent>
        </Card>

        {/* Preference Cookies */}
        <Card className={preferences ? 'border-[#FF6F00]' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Preference Cookies</CardTitle>
                <CardDescription>Remember your settings and preferences</CardDescription>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF6F00] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6F00]"></div>
              </label>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#757575]">
              These cookies remember your choices (such as language or region) to provide a more personalized 
              experience. Disabling these may result in features not working as expected.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={rejectAll}
          className="border-2 border-[#757575] text-[#757575] hover:bg-[#757575] hover:text-white px-8"
        >
          Reject All
        </Button>
        <Button
          variant="secondary"
          onClick={savePreferences}
          className="bg-[#424242] text-white hover:bg-[#212121] px-8"
        >
          Save My Preferences
        </Button>
        <Button
          onClick={acceptAll}
          className="bg-[#FF6F00] text-white hover:bg-[#E65100] px-8"
        >
          Accept All
        </Button>
      </div>

      {/* Data Retention Information */}
      <Card className="mt-12 border-2 border-[#FF6F00]">
        <CardHeader>
          <CardTitle className="text-xl">Data Retention Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-[#212121] mb-2">Analytics Data</h4>
            <p className="text-sm text-[#757575]">
              Analytics data is retained for 26 months, after which it is automatically deleted.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#212121] mb-2">User Account Data</h4>
            <p className="text-sm text-[#757575]">
              Account data is retained as long as your account is active. You can request deletion at any time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-[#212121] mb-2">Cookie Data</h4>
            <p className="text-sm text-[#757575]">
              Cookies expire after 12 months or when you clear your browser cookies.
            </p>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-[#757575]">
              <strong>Your Rights:</strong> You have the right to access, rectify, delete, or port your data. 
              Contact us at{' '}
              <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">
                support@ailearnhub.io
              </a>
              {' '}to exercise your rights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
