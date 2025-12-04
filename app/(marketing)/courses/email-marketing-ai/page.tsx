import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function EmailMarketingAIPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <nav className="text-sm mb-6">
            <Link href="/courses" className="hover:underline">Courses</Link>
            <span className="mx-2">/</span>
            <span>Email Marketing with AI</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Email Marketing with AI
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Transform your email marketing with AI to boost open rates, conversions, and revenue
          </p>
          
          <div className="flex flex-wrap gap-6 text-lg mb-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold">5 modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">2 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Beginner</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-5xl font-bold">$19</span>
            <span className="text-xl">USD</span>
          </div>
          
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-[#FF6F00] hover:bg-gray-100 text-lg px-8 py-6">
              Enroll Now - $19
            </Button>
          </Link>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-[#212121] mb-12 text-3xl font-normal">What you'll learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI-Powered Campaign Strategy</h3>
                <p className="text-[#424242] text-sm leading-6">Build data-driven email strategies using AI for audience segmentation and campaign planning</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Subject Line Optimization</h3>
                <p className="text-[#424242] text-sm leading-6">Generate high-converting subject lines that boost open rates by 40%+ using proven AI formulas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Personalized Email Content</h3>
                <p className="text-[#424242] text-sm leading-6">Create hyper-personalized email sequences at scale with AI-powered copywriting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Automated Workflows</h3>
                <p className="text-[#424242] text-sm leading-6">Build intelligent email sequences with AI-driven triggers and timing optimization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Performance Analytics</h3>
                <p className="text-[#424242] text-sm leading-6">Leverage AI to analyze campaign performance, predict trends, and optimize results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Advanced Techniques</h3>
                <p className="text-[#424242] text-sm leading-6">Master A/B testing, re-engagement campaigns, and revenue-generating email strategies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-[#212121] mb-8 text-3xl font-normal">Course curriculum</h2>
          <div className="space-y-4">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 1: AI Email Marketing Foundations</h3>
                <p className="text-[#424242] text-sm mb-2">Master AI tools for email marketing, audience analysis, and campaign planning strategies</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>20 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 2: Subject Lines That Convert</h3>
                <p className="text-[#424242] text-sm mb-2">Generate high-converting subject lines with AI using proven formulas and testing strategies</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 3: AI-Powered Email Copywriting</h3>
                <p className="text-[#424242] text-sm mb-2">Create persuasive email content at scale with AI templates for every campaign type</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>30 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 4: Email Automation & Sequences</h3>
                <p className="text-[#424242] text-sm mb-2">Build intelligent automated workflows with AI-driven personalization and timing</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 5: Analytics & Optimization</h3>
                <p className="text-[#424242] text-sm mb-2">Master AI analytics, A/B testing, and advanced optimization strategies for maximum ROI</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>20 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-[#212121] mb-8 text-3xl font-normal">What's included</h2>
          <ul className="space-y-4 max-w-2xl">
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              2 hours of focused, practical training
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Test your knowledge after each module
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              50+ subject line templates
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              30+ email copy templates
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Campaign workflow blueprints
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Certificate of completion
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
