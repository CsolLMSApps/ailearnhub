export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-normal text-[#212121] mb-8">Refund Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-[#757575] mb-8">Last Updated: November 29, 2024</p>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">30-Day Money-Back Guarantee</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We stand behind our courses 100%. If you're not satisfied, we offer a full refund 
              within 30 days of purchase—no questions asked.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Refund Eligibility</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">You are eligible for a full refund if:</p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Request made within 30 days of purchase</li>
              <li className="mb-2">You have completed less than 50% of the course content</li>
              <li className="mb-2">You are not satisfied with the course quality</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">How to Request a Refund</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              Email us at <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:text-[#E65100]">support@ailearnhub.io</a> with:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Your order number</li>
              <li className="mb-2">Brief reason for refund (optional)</li>
            </ul>
            <p className="text-base text-[#424242] leading-7">
              Refunds are processed within 5-10 business days to your original payment method.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Non-Refundable Cases</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">Refunds cannot be issued if:</p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">More than 30 days have passed since purchase</li>
              <li className="mb-2">You have completed more than 50% of the course</li>
              <li className="mb-2">You have downloaded the completion certificate</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
