// app/(marketing)/payment-success/page.tsx
// Shown to guest buyers after Stripe checkout completes.
// Logged-in users are sent directly to /dashboard — they don't land here.

import Link from 'next/link'

export const metadata = {
  title: 'Payment Successful — AI Learn Hub',
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ existing?: string }>
}) {
  const { existing } = await searchParams
  const isExisting = existing === 'true'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
        <div className="text-6xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>

        {isExisting ? (
          <>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your purchase is confirmed. Log in to access your course — it's already in your dashboard.
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 px-6 bg-[#FF6F00] text-white font-bold rounded-xl hover:bg-[#E65100] transition-colors"
            >
              Log in to Dashboard →
            </Link>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Something went wrong loading your dashboard automatically. Please log in to access your course.
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 px-6 bg-[#FF6F00] text-white font-bold rounded-xl hover:bg-[#E65100] transition-colors"
            >
              Log in →
            </Link>
          </>
        )}

        <div className="mt-4">
          <Link href="/" className="text-sm text-[#FF6F00] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
