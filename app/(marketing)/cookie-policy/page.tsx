export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-normal text-[#212121] mb-8">Cookie Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-[#757575] mb-8">Last Updated: November 29, 2024</p>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">What Are Cookies</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              Cookies are small text files stored on your device when you visit our website. 
              They help us provide you with a better experience.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">How We Use Cookies</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">We use cookies for:</p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2"><strong>Authentication:</strong> Keep you logged in to your account</li>
              <li className="mb-2"><strong>Analytics:</strong> Understand how you use our platform</li>
              <li className="mb-2"><strong>Affiliate Tracking:</strong> Track referrals (30-day cookie)</li>
              <li className="mb-2"><strong>Preferences:</strong> Remember your settings</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Types of Cookies</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-[#212121] mb-2">Essential Cookies</h3>
              <p className="text-base text-[#424242] leading-7">
                Required for the website to function. Cannot be disabled.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-[#212121] mb-2">Analytics Cookies</h3>
              <p className="text-base text-[#424242] leading-7">
                Help us understand how visitors interact with our website.
              </p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-[#212121] mb-2">Marketing Cookies</h3>
              <p className="text-base text-[#424242] leading-7">
                Track visitors for affiliate program attribution.
              </p>
            </div>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Managing Cookies</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              You can control cookies through your browser settings. Note that disabling cookies 
              may affect website functionality, including the ability to log in and access courses.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Third-Party Cookies</h2>
            <p className="text-base text-[#424242] leading-7">
              We use services from Stripe (payments), Supabase (hosting), and analytics providers 
              that may set their own cookies.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
