import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function AIToolsProductivityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <nav className="text-sm mb-6">
            <Link href="/courses" className="hover:underline">Courses</Link>
            <span className="mx-2">/</span>
            <span>AI Tools for Productivity</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Tools for Productivity
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Master the best AI productivity tools to save 10+ hours per week and supercharge your workflow
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
                <h3 className="text-[#212121] font-medium mb-1">AI Writing & Communication Tools</h3>
                <p className="text-[#424242] text-sm leading-6">Master tools like Grammarly, Jasper, and Copy.ai to write faster and better</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI Meeting & Note-Taking Tools</h3>
                <p className="text-[#424242] text-sm leading-6">Use Otter.ai, Fireflies, and Notion AI to automate meeting notes and action items</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI Research & Knowledge Management</h3>
                <p className="text-[#424242] text-sm leading-6">Leverage Perplexity, Elicit, and Research Rabbit for faster, smarter research</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI Design & Creative Tools</h3>
                <p className="text-[#424242] text-sm leading-6">Create professional designs with Canva AI, Midjourney, and DALL-E</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI Workflow Automation</h3>
                <p className="text-[#424242] text-sm leading-6">Build automated workflows with Zapier AI, Make, and no-code platforms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Your Complete AI Stack</h3>
                <p className="text-[#424242] text-sm leading-6">Build a customized AI toolkit for your specific needs and workflow</p>
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
                <h3 className="text-[#212121] font-medium mb-2">Module 1: AI Writing & Communication Tools</h3>
                <p className="text-[#424242] text-sm mb-2">Master Grammarly, Jasper, Copy.ai, and other writing tools to create content 5x faster</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 2: AI Meeting & Note-Taking Tools</h3>
                <p className="text-[#424242] text-sm mb-2">Automate meeting transcription, summaries, and action items with Otter.ai and Fireflies</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>20 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 3: AI Research & Knowledge Tools</h3>
                <p className="text-[#424242] text-sm mb-2">Use Perplexity, Elicit, and Research Rabbit to conduct research 10x faster</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 4: AI Design & Creative Tools</h3>
                <p className="text-[#424242] text-sm mb-2">Create professional designs with Canva AI, generate images with DALL-E and Midjourney</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>30 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 5: Building Your AI Productivity Stack</h3>
                <p className="text-[#424242] text-sm mb-2">Automate workflows with Zapier AI, integrate tools, and build your custom AI toolkit</p>
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
              2 hours of practical training
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Test your knowledge after each module
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              20+ AI tool reviews and tutorials
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Workflow automation templates
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              AI productivity cheat sheets
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
