import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
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
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[#212121]">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="border-gray-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#212121]">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="border-gray-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#212121]">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-gray-300"
                required
              />
              <p className="text-xs text-[#757575]">At least 8 characters</p>
            </div>
            <Button type="submit" className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-medium">
              Create account
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
