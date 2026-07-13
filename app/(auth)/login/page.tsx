'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from '@/app/actions/auth'

function LoginForm() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams?.get('redirect') || '/dashboard'
  const action = searchParams?.get('action')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('redirectTo', redirectTo)

    // loginAction runs on the server — sets cookies via HTTP response headers,
    // then redirects. This guarantees cookies are readable by all server components.
    const result = await loginAction(formData)

    // If we get here, loginAction returned an error (redirect would not return)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
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
          <CardTitle className="text-2xl font-medium text-[#212121]">Welcome back</CardTitle>
          <CardDescription className="text-[#424242]">
            {action === 'enroll' ? 'Sign in to enroll in the course' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {redirectTo !== '/dashboard' && action === 'enroll' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-600">Please sign in to continue with enrollment</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#212121]">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border-gray-300"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#212121]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="border-gray-300"
                required
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#424242]">
            Don't have an account?{' '}
            <Link
              href={redirectTo !== '/dashboard' ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : '/signup'}
              className="text-[#FF6F00] hover:text-[#E65100] font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6F00]"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
