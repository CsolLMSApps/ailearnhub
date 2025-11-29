import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#212121] text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="mb-4 text-5xl leading-tight font-normal">Simple, Transparent Pricing</h1>
          <p className="text-gray-300 text-lg leading-8 max-w-2xl mx-auto">
            Early bird pricing available now. Pay once, learn forever.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Course 1 */}
            <Card className="border-2 border-[#FF6F00] relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6F00] text-white px-4 py-1 text-sm font-medium">
                Most Popular
              </div>
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-medium text-[#212121] mb-2">
                  ChatGPT Mastery for Professionals
                </CardTitle>
                <CardDescription className="text-base text-[#424242]">
                  Complete professional training
                </CardDescription>
                <div className="mt-6">
                  <div className="text-[#757575] line-through text-lg">$29</div>
                  <div className="text-[#FF6F00] text-5xl font-normal">$19</div>
                  <div className="text-[#757575] text-sm mt-2">One-time payment • Lifetime access</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">7 comprehensive modules (4 hours)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">70 quiz questions with instant feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">50+ prompt templates & business emails</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">Certificate of completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">Lifetime access to all updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">30-day money-back guarantee</span>
                  </li>
                </ul>
                <Link href="/courses/chatgpt-mastery">
                  <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-base font-medium py-6">
                    Enroll now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Course 2 */}
            <Card className="border border-gray-200">
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-2xl font-medium text-[#212121] mb-2">
                  AI for Beginners
                </CardTitle>
                <CardDescription className="text-base text-[#424242]">
                  Perfect starting point
                </CardDescription>
                <div className="mt-6">
                  <div className="text-[#757575] line-through text-lg">$29</div>
                  <div className="text-[#FF6F00] text-5xl font-normal">$19</div>
                  <div className="text-[#757575] text-sm mt-2">One-time payment • Lifetime access</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">6 beginner-friendly modules (3 hours)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">60 quiz questions with instant feedback</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">40+ templates for daily use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">Certificate of completion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">Lifetime access to all updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                    <span className="text-[#424242] text-base">30-day money-back guarantee</span>
                  </li>
                </ul>
                <Link href="/courses/ai-for-beginners">
                  <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-base font-medium py-6">
                    Enroll now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-[#212121] mb-12 text-3xl font-normal text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-[#212121] text-lg font-medium mb-2">What's included in the price?</h3>
              <p className="text-[#424242] text-base leading-7">
                Everything! One-time payment gives you lifetime access to all course materials, quizzes, templates, 
                and future updates. No hidden fees or subscriptions.
              </p>
            </div>

            <div>
              <h3 className="text-[#212121] text-lg font-medium mb-2">Do you offer refunds?</h3>
              <p className="text-[#424242] text-base leading-7">
                Yes! We offer a 30-day money-back guarantee. If you've completed less than 50% of the course 
                and aren't satisfied, we'll refund your purchase, no questions asked.
              </p>
            </div>

            <div>
              <h3 className="text-[#212121] text-lg font-medium mb-2">Can I buy both courses together?</h3>
              <p className="text-[#424242] text-base leading-7">
                Yes! Purchase them individually now, or contact us for bundle pricing if you want both courses.
              </p>
            </div>

            <div>
              <h3 className="text-[#212121] text-lg font-medium mb-2">Is this a one-time payment or subscription?</h3>
              <p className="text-[#424242] text-base leading-7">
                One-time payment only. No recurring charges. You own the course forever.
              </p>
            </div>

            <div>
              <h3 className="text-[#212121] text-lg font-medium mb-2">Do you accept international payments?</h3>
              <p className="text-[#424242] text-base leading-7">
                Yes! We accept all major credit cards and process payments in multiple currencies 
                (USD, CAD, GBP, AUD, INR) through Stripe.
              </p>
            </div>

            <div>
              <h3 className="text-[#212121] text-lg font-medium mb-2">Will I get a certificate?</h3>
              <p className="text-[#424242] text-base leading-7">
                Yes! Upon completing all modules and passing all quizzes (70% required), you'll receive 
                a professional certificate you can share on LinkedIn and with employers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
