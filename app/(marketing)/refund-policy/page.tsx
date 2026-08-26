// app/(marketing)/refund-policy/page.tsx

import Link from 'next/link'

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          <p className="text-gray-600 text-sm">
            <strong>Effective Date:</strong> January 11, 2026<br />
            <strong>Last Updated:</strong> August 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Refund Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All sales on AI Learn Hub are final. We do not offer refunds based on dissatisfaction, change of mind, or partial use of course content.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-900 font-medium">⚠️ No Refunds Except for Technical Issues</p>
              <p className="text-orange-800 text-sm mt-1">
                Refunds are only issued when a verified technical issue prevents you from accessing content you have paid for.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligible Situations for a Refund</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may be eligible for a refund only in the following technical situations:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Course remains locked after a successful payment</li>
              <li>Payment was charged but access to the course was not granted</li>
              <li>Course content is permanently inaccessible due to a platform error on our end</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Refundable Situations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Refunds will <strong>not</strong> be issued in the following cases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Dissatisfaction with course content or style</li>
              <li>Change of mind after purchase</li>
              <li>Failure to complete or engage with the course</li>
              <li>Violation of our Terms of Service</li>
              <li>Course content downloaded or shared outside the platform</li>
              <li>Purchases made with fraudulent payment methods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Report a Technical Issue</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you are experiencing a technical issue preventing access to your purchased course, contact us immediately:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Email <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">support@ailearnhub.io</a></li>
              <li>Include your order email address and a description of the issue</li>
              <li>Attach a screenshot if possible</li>
            </ol>
            <p className="text-gray-700 mt-4">
              We will investigate and resolve the issue within <strong>1 business day</strong>. If the issue cannot be resolved, a refund will be issued to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Processing Time</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Review:</strong> Within 1 business day of your report</li>
              <li><strong>Processing via Stripe:</strong> 1–2 business days</li>
              <li><strong>Bank reflection:</strong> 5–10 business days depending on your financial institution</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Access Upon Refund</h2>
            <p className="text-gray-700 leading-relaxed">
              Upon refund approval, your access to the course will be immediately revoked. Any progress or certificates earned will also be removed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">support@ailearnhub.io</a></li>
              <li><strong>Response Time:</strong> Within 1 business day</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Company Information</h2>
            <p className="text-gray-700">
              <strong>AI Learn Hub LLC</strong><br />
              701 Brazos Street, Suite 720<br />
              Austin, TX 78701<br />
              United States
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              This refund policy is part of our <a href="/terms" className="text-[#FF6F00] hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
