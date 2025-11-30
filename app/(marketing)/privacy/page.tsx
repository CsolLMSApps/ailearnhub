export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-normal text-[#212121] mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-[#757575] mb-8">Last Updated: November 29, 2024</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">1. Information We Collect</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">We collect information you provide:</p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Name and email address</li>
              <li className="mb-2">Payment information (processed securely via Stripe)</li>
              <li className="mb-2">Course progress and quiz responses</li>
              <li className="mb-2">Communication preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Provide access to purchased courses</li>
              <li className="mb-2">Send course updates and announcements</li>
              <li className="mb-2">Process payments and prevent fraud</li>
              <li className="mb-2">Improve our platform and courses</li>
              <li className="mb-2">Respond to support requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">3. Information Sharing</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We do not sell your personal information. We share data only with service providers 
              (Stripe for payments, Supabase for hosting, Resend for emails) and when required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">4. Cookies and Tracking</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We use cookies for authentication, analytics, and affiliate tracking. 
              See our <a href="/cookie-policy" className="text-[#FF6F00] hover:text-[#E65100]">Cookie Policy</a> for details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">5. Your Rights</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Access your personal data</li>
              <li className="mb-2">Request data correction or deletion</li>
              <li className="mb-2">Opt-out of marketing communications</li>
              <li className="mb-2">Export your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">6. Contact Us</h2>
            <p className="text-base text-[#424242] leading-7">
              For privacy concerns, contact us at support@ailearnhub.io
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
