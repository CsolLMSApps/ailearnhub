export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-normal text-[#212121] mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-sm text-[#757575] mb-8">Last Updated: November 29, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">1. Agreement to Terms</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              By accessing and using AI Learn Hub ("the Platform"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">2. Services Provided</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              AI Learn Hub provides online educational courses focused on artificial intelligence, ChatGPT, and 
              related technologies. Our services include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Access to course content (video, text, quizzes)</li>
              <li className="mb-2">Interactive learning materials</li>
              <li className="mb-2">Completion certificates</li>
              <li className="mb-2">Lifetime access to purchased courses</li>
              <li className="mb-2">Future updates to course materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">3. Account Registration</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              To purchase and access courses, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Provide accurate and complete information</li>
              <li className="mb-2">Maintain the security of your account credentials</li>
              <li className="mb-2">Notify us immediately of any unauthorized access</li>
              <li className="mb-2">Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">4. Purchases and Payments</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              All course purchases are processed securely through Stripe. By making a purchase, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Pay the listed price at the time of purchase</li>
              <li className="mb-2">Provide valid payment information</li>
              <li className="mb-2">Understand that prices may change but won't affect existing purchases</li>
              <li className="mb-2">Receive lifetime access to purchased courses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">5. Refund Policy</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We offer a 30-day money-back guarantee. You may request a full refund within 30 days of purchase if:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">You have completed less than 50% of the course content</li>
              <li className="mb-2">You are not satisfied with the course quality</li>
            </ul>
            <p className="text-base text-[#424242] leading-7">
              Refunds are processed within 5-10 business days. See our <a href="/refund-policy" className="text-[#FF6F00] hover:text-[#E65100]">Refund Policy</a> for full details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">6. Intellectual Property</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              All course content, including but not limited to text, videos, images, quizzes, and templates, 
              is the intellectual property of AI Learn Hub or its licensors. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Share, distribute, or sell course content</li>
              <li className="mb-2">Copy or reproduce materials without permission</li>
              <li className="mb-2">Use content for commercial purposes without authorization</li>
              <li className="mb-2">Remove copyright or proprietary notices</li>
            </ul>
            <p className="text-base text-[#424242] leading-7">
              You may use the knowledge gained for personal and professional purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">7. User Conduct</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Share account credentials with others</li>
              <li className="mb-2">Attempt to access restricted areas of the platform</li>
              <li className="mb-2">Use automated systems to access content</li>
              <li className="mb-2">Engage in any activity that disrupts the platform</li>
              <li className="mb-2">Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">8. Affiliate Program</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              Our affiliate program allows approved partners to earn commissions on sales. Affiliates must:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Follow our affiliate agreement terms</li>
              <li className="mb-2">Use ethical marketing practices</li>
              <li className="mb-2">Not engage in fraudulent activities</li>
              <li className="mb-2">Accurately represent our courses</li>
            </ul>
            <p className="text-base text-[#424242] leading-7">
              See our <a href="/affiliate-agreement" className="text-[#FF6F00] hover:text-[#E65100]">Affiliate Agreement</a> for full terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">9. Disclaimers</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              AI Learn Hub provides educational content "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Specific results or outcomes from taking our courses</li>
              <li className="mb-2">Uninterrupted or error-free access to the platform</li>
              <li className="mb-2">That course content is complete, current, or accurate</li>
              <li className="mb-2">Employment or certification by third parties</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">10. Limitation of Liability</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              To the maximum extent permitted by law, AI Learn Hub shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">11. Termination</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We reserve the right to terminate or suspend your account at any time for violations of these terms. 
              Upon termination:
            </p>
            <ul className="list-disc pl-6 mb-4 text-[#424242]">
              <li className="mb-2">Your access to courses will be revoked</li>
              <li className="mb-2">No refunds will be provided for violations</li>
              <li className="mb-2">You must cease using all course materials</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">12. Changes to Terms</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              We may update these Terms of Service at any time. Changes will be effective immediately upon posting. 
              Your continued use of the platform constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">13. Governing Law</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              These terms are governed by the laws of the State of Texas, United States, without regard to 
              conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-medium text-[#212121] mb-4">14. Contact Information</h2>
            <p className="text-base text-[#424242] leading-7 mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 border border-gray-200 mb-4">
              <p className="text-base text-[#424242] mb-2"><strong>AI Learn Hub LLC</strong></p>
              <p className="text-base text-[#424242] mb-2">701 BRAZOS STREET SUITE 720</p>
              <p className="text-base text-[#424242] mb-2">AUSTIN, TX 78701</p>
              <p className="text-base text-[#424242] mb-2">Email: support@ailearnhub.io</p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-[#757575]">
              By using AI Learn Hub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
