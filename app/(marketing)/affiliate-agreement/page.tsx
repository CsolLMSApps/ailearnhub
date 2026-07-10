import Link from 'next/link'
export default function AffiliateAgreementPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
        <h1 className="text-4xl font-normal text-[#212121] mb-8">Affiliate Agreement</h1>
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-[#757575] mb-8">Last Updated: November 29, 2024</p>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Commission Structure</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              Affiliates earn <strong>30% commission</strong> on all sales generated through their 
              unique referral links. Tracking is managed via 30-day cookies.
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Commission Rate: 30% of sale price</li>
              <li className="mb-2">Cookie Duration: 30 days</li>
              <li className="mb-2">Minimum Payout: $50</li>
              <li className="mb-2">Attribution Model: Last-click</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Payment Terms</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              Commissions are paid monthly on NET-30 terms via PayPal or bank transfer.
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Payment Schedule: Monthly (NET-30)</li>
              <li className="mb-2">Payment Methods: PayPal, Bank Transfer</li>
              <li className="mb-2">Commission Hold: 30 days (to account for refunds)</li>
              <li className="mb-2">Minimum Balance: $50 to qualify for payout</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Affiliate Responsibilities</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">As an affiliate, you agree to:</p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Promote courses honestly and accurately</li>
              <li className="mb-2">Follow ethical marketing practices</li>
              <li className="mb-2">Comply with all applicable laws</li>
              <li className="mb-2">Not make false claims about courses</li>
              <li className="mb-2">Disclose affiliate relationship when required</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Prohibited Activities</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              The following activities are strictly prohibited and may result in account termination:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Self-referrals or purchasing through own links</li>
              <li className="mb-2">Cookie stuffing or forced cookie placement</li>
              <li className="mb-2">Misleading or deceptive advertising</li>
              <li className="mb-2">Spam or unsolicited marketing</li>
              <li className="mb-2">Trademark or brand name bidding in paid ads</li>
              <li className="mb-2">Fraudulent traffic generation</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Termination</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We reserve the right to terminate affiliate accounts at any time for violations of 
              this agreement. Upon termination, all pending commissions will be forfeited.
            </p>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">Apply to Become an Affiliate</h2>
            <p className="text-base text-[#424242] leading-7">
              Interested in joining our affiliate program? 
              <a href="/affiliate" className="text-[#FF6F00] hover:text-[#E65100]"> Learn more and apply here</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
