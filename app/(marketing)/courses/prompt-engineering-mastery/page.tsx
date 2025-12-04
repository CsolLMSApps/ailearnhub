import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PromptEngineeringMasteryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <nav className="text-sm mb-6">
            <Link href="/courses" className="hover:underline">Courses</Link>
            <span className="mx-2">/</span>
            <span>Prompt Engineering Mastery</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prompt Engineering Mastery
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Master the art and science of prompt engineering to unlock the full potential of AI
          </p>
          
          <div className="flex flex-wrap gap-6 text-lg mb-8">
            <div className="flex items-center gap-2">
              <span className="font-semibold">5 modules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">2 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Intermediate</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-5xl font-bold">$29</span>
            <span className="text-xl">USD</span>
          </div>
          
          <Link href="/dashboard">
            <Button size="lg" className="bg-white text-[#FF6F00] hover:bg-gray-100 text-lg px-8 py-6">
              Enroll Now - $29
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
                <h3 className="text-[#212121] font-medium mb-1">Foundations of Prompt Engineering</h3>
                <p className="text-[#424242] text-sm leading-6">Understand how AI models process prompts and the principles behind effective prompt design</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Advanced Prompting Techniques</h3>
                <p className="text-[#424242] text-sm leading-6">Master chain-of-thought, few-shot learning, role-playing, and meta-prompting strategies</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Prompt Optimization</h3>
                <p className="text-[#424242] text-sm leading-6">Test, iterate, and refine prompts for maximum accuracy and consistency in outputs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Domain-Specific Prompting</h3>
                <p className="text-[#424242] text-sm leading-6">Create specialized prompts for coding, writing, analysis, research, and creative work</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Prompt Libraries & Frameworks</h3>
                <p className="text-[#424242] text-sm leading-6">Build reusable prompt templates and frameworks for consistent, professional results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-[#FF6F00] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-[#212121] font-medium mb-1">Advanced Applications</h3>
                <p className="text-[#424242] text-sm leading-6">Implement multi-turn conversations, context management, and complex problem-solving</p>
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
                <h3 className="text-[#212121] font-medium mb-2">Module 1: Prompt Engineering Fundamentals</h3>
                <p className="text-[#424242] text-sm mb-2">Understanding AI models, tokenization, context windows, and core principles of effective prompts</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>20 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 2: Advanced Prompting Techniques</h3>
                <p className="text-[#424242] text-sm mb-2">Master chain-of-thought, few-shot learning, role-based prompting, and meta-prompting strategies</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 3: Prompt Optimization & Testing</h3>
                <p className="text-[#424242] text-sm mb-2">Systematic testing, A/B comparison, iteration strategies, and measuring prompt effectiveness</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>25 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 4: Domain-Specific Prompt Engineering</h3>
                <p className="text-[#424242] text-sm mb-2">Specialized prompts for coding, writing, analysis, research, creative work, and business tasks</p>
                <div className="flex items-center gap-4 text-xs text-[#757575]">
                  <span>30 minutes</span>
                  <span>•</span>
                  <span>10 quiz questions</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-[#212121] font-medium mb-2">Module 5: Advanced Applications & Best Practices</h3>
                <p className="text-[#424242] text-sm mb-2">Multi-turn conversations, context management, error handling, and building prompt libraries</p>
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
              2 hours of advanced training
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Test your knowledge after each module
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              100+ prompt engineering templates
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Domain-specific prompt libraries
            </li>
            <li className="flex items-center text-sm text-[#424242]">
              <span className="text-[#FF6F00] mr-2">✓</span>
              Advanced frameworks and cheat sheets
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
