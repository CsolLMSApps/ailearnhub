import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
      <Card className="w-full max-w-md border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-medium text-[#212121]">Welcome back</CardTitle>
          <CardDescription className="text-[#424242]">
            Sign in to access your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-[#212121]">Password</Label>
                <Link href="/auth/reset-password" className="text-sm text-[#FF6F00] hover:text-[#E65100]">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="border-gray-300"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-medium">
              Sign in
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-[#424242]">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-[#FF6F00] hover:text-[#E65100] font-medium">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
