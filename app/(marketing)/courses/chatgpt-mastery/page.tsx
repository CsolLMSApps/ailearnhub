import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Clock, Award, BookOpen } from 'lucide-react'

export default function ChatGPTMasteryPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#212121] text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/courses" className="text-gray-400 hover:text-white text-sm">Courses</Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm">ChatGPT Mastery</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-[#FF6F00]/10 text-[#FF6F00] px-3 py-1 inline-block uppercase tracking-wide text-xs font-medium mb-4">
                Featured Course
              </div>
              <h1 className="mb-4 text-5xl leading-tight font-normal">ChatGPT Mastery for Professionals</h1>
              <p className="text-gray-300 text-lg leading-8 mb-6">
                Master ChatGPT and transform your professional productivity with AI. Learn advanced techniques 
                that save 10+ hours weekly on business tasks.
              </p>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#FF6F00]" />
                  <span>4 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#FF6F00]" />
                  <span>7 modules</span>
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
                <h3 className="text-[#212121] font-medium mb-1">Master Prompt Engineering</h3>
                <p className="text-[#424242] text-sm leading-6">Learn the 6-step framework for creating powerful prompts that get consistent, high-quality results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Business Communication Excellence</h3>
                <p className="text-[#424242] text-sm leading-6">Write professional emails, reports, and presentations 10x faster with 30+ ready-to-use templates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Content Creation Accelerator</h3>
                <p className="text-[#424242] text-sm leading-6">Generate blog posts, social media content, and marketing copy in minutes instead of hours</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">AI-Powered Productivity</h3>
                <p className="text-[#424242] text-sm leading-6">Automate research, data analysis, and project management tasks to save 12+ hours weekly</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Advanced ChatGPT Techniques</h3>
                <p className="text-[#424242] text-sm leading-6">Use custom instructions, chain-of-thought prompting, and meta-prompting for expert-level results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Beyond ChatGPT</h3>
                <p className="text-[#424242] text-sm leading-6">Build your complete AI toolkit with recommendations for image, video, audio, and code generation</p>
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 1: ChatGPT Quick Start</h3>
                    <p className="text-[#424242] text-sm mb-2">Get started with ChatGPT, understand what it can and can't do, and create your first effective prompts</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>20 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 2: Prompt Engineering Mastery</h3>
                    <p className="text-[#424242] text-sm mb-2">Learn the 6-step framework, persona prompting, and create 20+ professional prompt templates</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>45 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 3: Business Communication Excellence</h3>
                    <p className="text-[#424242] text-sm mb-2">Master professional emails, meeting summaries, reports, and presentations with 30+ templates</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>40 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 4: Content Creation Accelerator</h3>
                    <p className="text-[#424242] text-sm mb-2">Generate blog posts, social media content, marketing copy, and 100+ content ideas instantly</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>45 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 5: AI-Powered Productivity</h3>
                    <p className="text-[#424242] text-sm mb-2">Automate research, data processing, project management, and personal productivity systems</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>40 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 6: Advanced ChatGPT Techniques</h3>
                    <p className="text-[#424242] text-sm mb-2">Custom instructions, chain-of-thought prompting, code generation, and expert-level strategies</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>35 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-[#212121] font-medium mb-2">Module 7: Beyond ChatGPT - Your AI Toolkit</h3>
                    <p className="text-[#424242] text-sm mb-2">Explore image, video, audio, and code AI tools. Build your complete professional AI stack</p>
                    <div className="flex items-center gap-4 text-xs text-[#757575]">
                      <span>30 minutes</span>
                      <span>•</span>
                      <span>10 quiz questions</span>
                    </div>
                  </div>
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
              <div className="text-[#FF6F00] text-3xl font-normal mb-2">240</div>
              <div className="text-[#212121] font-medium mb-1">Minutes of content</div>
              <p className="text-[#424242] text-sm">4 hours of focused, practical training</p>
            </div>
            <div>
              <div className="text-[#FF6F00] text-3xl font-normal mb-2">70</div>
              <div className="text-[#212121] font-medium mb-1">Quiz questions</div>
              <p className="text-[#424242] text-sm">Test your knowledge after each module</p>
            </div>
            <div>
              <div className="text-[#FF6F00] text-3xl font-normal mb-2">50+</div>
              <div className="text-[#212121] font-medium mb-1">Templates included</div>
              <p className="text-[#424242] text-sm">Copy-paste templates for immediate use</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#212121] text-white px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-normal">Ready to master ChatGPT?</h2>
          <p className="mb-8 text-gray-300 text-lg leading-7">
            Join hundreds of professionals already saving 10+ hours weekly
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
