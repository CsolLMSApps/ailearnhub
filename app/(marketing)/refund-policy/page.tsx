// app/(marketing)/refund-policy/page.tsx
// Fixed: removed inline header/footer — marketing layout handles them

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
            <strong>Last Updated:</strong> January 11, 2026
          </p>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">24-Hour Money-Back Guarantee</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At AI Learn Hub, we stand behind the quality of our courses. We offer a <strong>24-hour money-back guarantee</strong> on all course purchases.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Requirements</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To be eligible for a refund, you must request it within <strong>24 hours (1 calendar day)</strong> of your purchase date. The refund request must be submitted through our official channels.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-orange-900 font-medium">⏰ Important Time Frame</p>
              <p className="text-orange-800 text-sm mt-1">
                The 24-hour period begins at the time of purchase completion and ends exactly 24 hours later, regardless of your timezone or when you access the course.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Request a Refund</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Email us at <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">support@ailearnhub.io</a></li>
              <li>Include your order number or email address used for purchase</li>
              <li>Provide a brief reason for your refund request (optional but appreciated)</li>
              <li>Submit your request within 24 hours of purchase</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Time</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once we receive your refund request:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Approval:</strong> We'll review and approve eligible requests within 1 business day</li>
              <li><strong>Processing:</strong> Refunds are processed through Stripe within 1-2 business days</li>
              <li><strong>Bank Processing:</strong> Your financial institution may take 5-10 business days to reflect the refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Non-Refundable Situations</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Refunds will <strong>not</strong> be issued in the following cases:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Requests made after the 24-hour window</li>
              <li>Violation of our Terms of Service</li>
              <li>Course content downloaded or shared outside the platform</li>
              <li>Abuse of the refund policy (multiple refund requests)</li>
              <li>Purchases made with fraudulent payment methods</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Access During Refund</h2>
            <p className="text-gray-700 leading-relaxed">
              Upon refund approval, your access to the course will be immediately revoked. You will no longer be able to view course materials, and any progress or certificates will be removed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <p className="text-gray-700 leading-relaxed">
              Refunds will be issued to the original payment method used for purchase. We cannot issue refunds to different payment methods or accounts.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bundle Purchases</h2>
            <p className="text-gray-700 leading-relaxed">
              For course bundle purchases, refunds are processed for the entire bundle, not individual courses within the bundle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technical Issues</h2>
            <p className="text-gray-700 leading-relaxed">
              If you experience technical difficulties accessing course content, please contact our support team at <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">support@ailearnhub.io</a> before requesting a refund. We're committed to resolving technical issues promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions about our refund policy, please contact us:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Email:</strong> <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">support@ailearnhub.io</a></li>
              <li><strong>Response Time:</strong> Within 24 hours</li>
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

          <section className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Note on Stripe Compliance:</strong> Our refund policy is designed to comply with Stripe's payment processing requirements. All refunds are processed according to Stripe's guidelines and your card network's policies.
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
