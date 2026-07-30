// app/(auth)/setup-account/page.tsx
// Landing page for the setup reminder email link: /setup-account?token=xxx
// Server component verifies the token, then renders the appropriate client UI.

import { verifySetupToken } from '@/lib/setup-token'
import SetupAccountClient from './SetupAccountClient'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function SetupAccountPage({ searchParams }: Props) {
  const { token } = await searchParams

  // No token at all
  if (!token) {
    return <InvalidState message="No setup token found in this link." />
  }

  const result = verifySetupToken(token)

  // Expired — show friendly message with login button
  if (result.status === 'expired') {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center space-y-5">
          <div className="text-5xl">⏰</div>
          <h1 className="text-xl font-bold text-gray-900">This link has expired</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Setup links are valid for 24 hours. Log in with your email address —
            once you're on your dashboard you'll see a notification to complete your account setup.
          </p>
          <Link
            href="/login"
            className="inline-block w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold text-sm py-3 rounded-lg transition-colors"
          >
            Log in to set up my account
          </Link>
          <p className="text-xs text-gray-400">
            Questions?{' '}
            <Link href="/contact" className="text-[#FF6F00] hover:underline">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // Invalid signature / malformed
  if (result.status === 'invalid') {
    return <InvalidState message="This setup link is invalid. Please use the link from your email exactly as received." />
  }

  // Valid — show the setup form
  return <SetupAccountClient token={token} email={result.email} />
}

function InvalidState({ message }: { message: string }) {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center space-y-5">
        <div className="text-5xl">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900">Invalid link</h1>
        <p className="text-gray-500 text-sm">{message}</p>
        <Link
          href="/login"
          className="inline-block w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold text-sm py-3 rounded-lg transition-colors"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}
