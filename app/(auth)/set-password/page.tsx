'use client'

// app/(auth)/set-password/page.tsx
// Landing page for new buyers clicking the "Set your password" link from the
// welcome email. Supabase embeds the recovery token in the URL hash:
//   /set-password#access_token=...&type=recovery
// The Supabase client picks this up automatically on getSession().

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

type Stage = 'loading' | 'form' | 'success' | 'error'

export default function SetPasswordPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Give the Supabase client a moment to parse the hash and establish the session
    const supabase = createClient()

    const init = async () => {
      // Supabase JS v2 automatically exchanges the #access_token hash for a session
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error || !session) {
        setErrorMsg('This link is invalid or has expired. Please contact support or try purchasing again.')
        setStage('error')
        return
      }

      setStage('form')
    }

    // Small delay so the hash is available after hydration
    const timer = setTimeout(init, 200)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setSaving(true)
    setErrorMsg('')

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({
        password,
        data: { password_set: true },
      })

      if (error) {
        setErrorMsg(error.message)
        setSaving(false)
        return
      }

      setStage('success')
      // Redirect to dashboard after a short pause
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md mb-4">
        <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
          ← Back to Home
        </Link>
      </div>

      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-[#212121]">
            {stage === 'success' ? 'Password set!' : 'Create your password'}
          </CardTitle>
          <CardDescription className="text-[#424242]">
            {stage === 'success'
              ? 'Taking you to your dashboard…'
              : 'Choose a password to access your course'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Loading */}
          {stage === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6F00]" />
            </div>
          )}

          {/* Error */}
          {stage === 'error' && (
            <div className="py-4 text-center space-y-4">
              <div className="text-4xl">⚠️</div>
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                {errorMsg}
              </p>
              <Link href="/login" className="text-sm text-[#FF6F00] hover:underline block">
                Go to Login
              </Link>
            </div>
          )}

          {/* Success */}
          {stage === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="text-5xl">🎉</div>
              <p className="text-sm text-gray-600">
                Your password has been set. Redirecting to your dashboard…
              </p>
            </div>
          )}

          {/* Form */}
          {stage === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{errorMsg}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[#212121]">
                  New password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="border-gray-300 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={saving}
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#757575]">At least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-sm font-medium text-[#212121]">
                  Confirm password
                </Label>
                <Input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="border-gray-300"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  disabled={saving}
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-medium"
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Set password & go to dashboard'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
