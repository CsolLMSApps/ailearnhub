'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-[#212121]">Create your account</CardTitle>
          <CardDescription className="text-[#424242]">
            Start learning AI today
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[#212121]">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="border-gray-300"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#212121]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="border-gray-300"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#212121]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-gray-300"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
              />
              <p className="text-xs text-[#757575]">At least 6 characters</p>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-medium"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#424242]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#FF6F00] hover:text-[#E65100] font-medium">
              Sign in
            </Link>
          </div>

          <div className="mt-6 text-center text-xs text-[#757575]">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-[#FF6F00] hover:text-[#E65100]">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#FF6F00] hover:text-[#E65100]">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
