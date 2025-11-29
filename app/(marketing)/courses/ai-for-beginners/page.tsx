import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Clock, Award, BookOpen } from 'lucide-react'

export default function AIForBeginnersPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#212121] text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/courses" className="text-gray-400 hover:text-white text-sm">Courses</Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm">AI for Beginners</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-[#424242]/30 text-gray-300 px-3 py-1 inline-block uppercase tracking-wide text-xs font-medium mb-4">
                Beginner Friendly
              </div>
              <h1 className="mb-4 text-5xl leading-tight font-normal">AI for Beginners</h1>
              <p className="text-gray-300 text-lg leading-8 mb-6">
                Start your AI journey from scratch. No technical background needed. Learn AI in plain English 
                and discover practical applications for daily life and work.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF6F00]" />
                  <span>3 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#FF6F00]" />
                  <span>6 modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#FF6F00]" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>
            <div>
              <Card className="bg-white/5 border-gray-700">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-gray-400 line-through text-sm">$29</div>
                    <div className="text-[#FF6F00] text-4xl font-normal">$19</div>
                    <div className="text-gray-400 text-xs mt-1">Early bird pricing</div>
                  </div>
                  <Link href="/auth/signup">
                    <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white mb-3 py-6 text-base font-medium">
                      Enroll now - $19
                    </Button>
                  </Link>
                  <div className="text-gray-400 text-xs text-center">
                    30-day money-back guarantee
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-[#212121] mb-8 text-3xl font-normal">What you'll learn</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Understand AI in Plain English</h3>
                <p className="text-[#424242] text-sm leading-6">Learn what AI really is, how it works, and bust common myths - no jargon or technical background required</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Get Started with ChatGPT</h3>
                <p className="text-[#424242] text-sm leading-6">Create your first prompts, avoid common beginner mistakes, and start getting useful results immediately</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI for Everyday Life</h3>
                <p className="text-[#424242] text-sm leading-6">Use AI for meal planning, fitness, learning hobbies, home organization, travel planning, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI at Work</h3>
                <p className="text-[#424242] text-sm leading-6">Write better emails, create presentations, improve reports, and boost productivity with 50+ work templates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Creative & Personal Uses</h3>
                <p className="text-[#424242] text-sm leading-6">Generate creative writing, plan projects, set goals, and explore new hobbies with AI assistance</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Build Your AI Toolkit</h3>
                <p className="text-[#424242] text-sm leading-6">Discover other beginner-friendly AI tools and create your 30-day action plan for continued learning</p>
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
                <h3 className="text-[#212121] font-medium mb-2">Module 1: AI Demystified</h3>
                <p className="text-[#424242] text-sm mb-2">What AI really is, how it works in plain English, and why you should learn it now</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>20 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 2: Getting Started with ChatGPT</h3>
                <p className="text-[#424242] text-sm mb-2">How to access ChatGPT, have your first conversation, and avoid common beginner mistakes</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 3: AI for Everyday Life</h3>
                <p className="text-[#424242] text-sm mb-2">Meal planning, fitness, learning, home organization, travel, and 30+ daily life templates</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>35 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 4: AI at Work</h3>
                <p className="text-[#424242] text-sm mb-2">Professional emails, presentations, reports, job search, and 50+ work-specific templates</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>40 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 5: Creative & Personal Uses</h3>
                <p className="text-[#424242] text-sm mb-2">Creative writing, content creation, projects, personal development, and 40+ creative templates</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>30 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 6: Next Steps & Simple Tools</h3>
                <p className="text-[#424242] text-sm mb-2">Explore other AI tools, build your starter toolkit, and create your 30-day learning plan</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-white px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-[#212121] mb-8 text-3xl font-normal">What's included</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-[#FF6F00] text-3xl font-normal mb-2">175</div>
              <div className="text-[#212121] font-medium mb-1">Minutes of content</div>
              <p className="text-[#424242] text-sm">3 hours of beginner-friendly training</p>
            </div>
            <div>
              <div className="text-[#FF6F00] text-3xl font-normal mb-2">60</div>
              <div className="text-[#212121] font-medium mb-1">Quiz questions</div>
              <p className="text-[#424242] text-sm">Test your knowledge after each module</p>
            </div>
            <div>
              <div className="text-[#FF6F00] text-3xl font-normal mb-2">40+</div>
              <div className="text-[#212121] font-medium mb-1">Templates included</div>
              <p className="text-[#424242] text-sm">Copy-paste templates for daily use</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#212121] text-white px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-normal">Ready to start your AI journey?</h2>
          <p className="mb-8 text-gray-300 text-lg leading-7">
            Perfect for absolute beginners. No technical background needed.
          </p>
          <Link href="/auth/signup">
            <Button className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-4 text-base font-medium">
              Enroll now - $19
            </Button>
          </Link>
          <div className="mt-6 text-gray-400 text-sm">
            30-day money-back guarantee • Lifetime access • Certificate included
          </div>
        </div>
      </section>
    </div>
  )
}
