// app/(marketing)/payment-success/page.tsx
// Shown to guest buyers after Stripe checkout completes.
// Logged-in users are sent directly to /dashboard — they don't land here.

import Link from 'next/link'

export const metadata = {
  title: 'Payment Successful — AI Learn Hub',
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          We're setting up your account. Check your email — we've sent you a one-click link to access your course.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-orange-900 font-medium mb-2">What happens next?</p>
          <ol className="text-sm text-orange-800 space-y-2 list-decimal list-inside">
            <li>Open the email from <strong>AI Learn Hub</strong></li>
            <li>Click <strong>"Access your course"</strong> — you'll be logged in automatically</li>
            <li>Your course is waiting in your dashboard</li>
            <li>Set a password from the dashboard to secure your account</li>
          </ol>
        </div>

        <p className="text-xs text-gray-400 mb-6">
          Didn't receive an email? Check your spam folder. The link expires in 24 hours.
        </p>

        <Link
          href="/login"
          className="inline-block w-full py-3 px-6 bg-[#FF6F00] text-white font-bold rounded-xl hover:bg-[#E65100] transition-colors"
        >
          Already have a password? Log in
        </Link>

        <div className="mt-4">
          <Link href="/" className="text-sm text-[#FF6F00] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
