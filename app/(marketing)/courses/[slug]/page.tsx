import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Check, Clock, BookOpen, Award, Download, Shield } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (courseError || !course) {
    notFound()
  }

  // Fetch course modules
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  // Format price for display
  const priceUSD = (course.price_usd / 100).toFixed(0)

  // Define learning outcomes based on course
  const learningOutcomes = getLearningOutcomes(slug)
  
  // Define deliverables
  const deliverables = getDeliverables(slug)

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <a href="/courses" className="text-white/80 hover:text-white transition-colors">
                Courses
              </a>
              <span className="text-white/60">/</span>
              <span className="text-white">{course.title}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {course.title}
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              {course.short_description}
            </p>
            
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>{course.total_modules} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{course.total_hours} Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span className="capitalize">{course.level}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-5xl font-bold">${priceUSD}</span>
              <span className="text-xl text-white/80">USD</span>
            </div>
            
            <form action="/api/stripe/checkout" method="POST" className="mt-6">
              <input type="hidden" name="courseSlug" value={slug} />
              <input type="hidden" name="courseId" value={course.id} />
              <button
                type="submit"
                className="bg-white text-[#FF6F00] font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg inline-flex items-center gap-2"
              >
                Enroll Now - ${priceUSD}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2">
                {/* What You'll Learn */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-[#212121] mb-8">
                    What you'll learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="flex-shrink-0">
                          <Check className="w-6 h-6 text-[#FF6F00]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#212121] mb-1">
                            {outcome.title}
                          </h3>
                          <p className="text-[#757575] text-sm">
                            {outcome.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Curriculum */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-[#212121] mb-8">
                    Course curriculum
                  </h2>
                  <div className="space-y-4">
                    {modules?.map((module) => (
                      <div
                        key={module.id}
                        className="border-2 border-gray-200 rounded-lg p-6 hover:border-[#FF6F00] transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-[#FF6F00] text-white font-bold px-3 py-1 rounded text-sm flex-shrink-0">
                            Module {module.module_number}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-[#212121] mb-2">
                              {module.title}
                            </h3>
                            <p className="text-[#757575] mb-3">
                              {module.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-[#757575]">
                              <Clock className="w-4 h-4" />
                              <span>{module.estimated_minutes} minutes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About This Course */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-[#212121] mb-6">
                    About this course
                  </h2>
                  <div className="prose max-w-none text-[#424242] leading-relaxed">
                    <p>{course.long_description}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 shadow-lg">
                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold text-[#FF6F00]">
                          ${priceUSD}
                        </span>
                        <span className="text-lg text-[#757575]">USD</span>
                      </div>
                      <p className="text-sm text-[#757575]">
                        One-time payment • Lifetime access
                      </p>
                    </div>

                    {/* Enroll Button */}
                    <form action="/api/stripe/checkout" method="POST" className="mb-6">
                      <input type="hidden" name="courseSlug" value={slug} />
                      <input type="hidden" name="courseId" value={course.id} />
                      <button
                        type="submit"
                        className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
                      >
                        Enroll Now
                      </button>
                    </form>

                    {/* What's Included */}
                    <div className="border-t-2 border-gray-200 pt-6">
                      <h3 className="font-bold text-[#212121] mb-4">
                        What's included
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                          <span className="text-[#424242]">
                            {course.total_hours} hours of focused, practical training
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Award className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                          <span className="text-[#424242]">
                            Certificate of completion
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                          <span className="text-[#424242]">
                            Lifetime access to all materials
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Download className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                          <span className="text-[#424242]">
                            {deliverables}
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <BookOpen className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                          <span className="text-[#424242]">
                            Access on mobile and desktop
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shield className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-0.5" />
                          <span className="text-[#424242]">
                            30-day money-back guarantee
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

// Helper functions for course-specific content
function getLearningOutcomes(slug: string) {
  const outcomes: Record<string, Array<{title: string, description: string}>> = {
    'chatgpt-mastery': [
      { title: 'Master Prompt Engineering', description: 'Learn the 6-step framework for creating powerful prompts that get consistent, high-quality results' },
      { title: 'Business Communication Excellence', description: 'Write professional emails, reports, and presentations 10x faster with 30+ ready-to-use templates' },
      { title: 'Content Creation Accelerator', description: 'Generate blog posts, social media content, and marketing copy in minutes instead of hours' },
      { title: 'AI-Powered Productivity', description: 'Automate research, data analysis, and project management tasks to save 12+ hours weekly' },
      { title: 'Advanced ChatGPT Techniques', description: 'Use custom instructions, chain-of-thought prompting, and meta-prompting for expert-level results' },
      { title: 'Beyond ChatGPT', description: 'Build your complete AI toolkit with recommendations for image, video, audio, and code generation' },
    ],
    'ai-for-beginners': [
      { title: 'Understand AI Fundamentals', description: 'Demystify AI, machine learning, and neural networks with clear, jargon-free explanations' },
      { title: 'Master ChatGPT Basics', description: 'Get started with ChatGPT and learn how to have effective conversations with AI' },
      { title: 'Practical Daily Applications', description: 'Use AI for learning, productivity, research, and personal projects' },
      { title: 'Professional AI Integration', description: 'Apply AI tools to your work for enhanced productivity and better results' },
      { title: 'Creative AI Projects', description: 'Explore AI for content creation, brainstorming, and creative problem-solving' },
      { title: 'Build Your AI Toolkit', description: 'Discover beginner-friendly AI tools and build confidence in using AI daily' },
    ],
    'social-media-marketing-ai': [
      { title: 'AI-Powered Strategy Development', description: 'Create data-driven social media strategies using AI for audience analysis and content planning' },
      { title: 'Content Creation at Scale', description: 'Generate engaging captions, hashtags, and posts for all major platforms in minutes' },
      { title: 'Visual Content Generation', description: 'Master AI image generation tools like DALL-E, Midjourney, and Canva AI for stunning visuals' },
      { title: 'Analytics & Performance Optimization', description: 'Use AI to analyze engagement data, predict trends, and optimize your content strategy' },
      { title: 'Automated Community Management', description: 'Implement AI-powered tools for responding to comments, messages, and building engagement' },
      { title: 'Advanced Marketing Automation', description: 'Build multi-platform campaigns, automate workflows, and scale your social media presence' },
    ],
    'email-marketing-ai': [
      { title: 'AI-Powered Campaign Creation', description: 'Write compelling email campaigns that boost opens, clicks, and conversions using AI' },
      { title: 'Intelligent Audience Segmentation', description: 'Use RFM analysis, behavioral targeting, and predictive analytics for precise targeting' },
      { title: 'A/B Testing & Optimization', description: 'Leverage AI to test subject lines, content, and timing for maximum engagement' },
      { title: 'Automated Workflow Design', description: 'Build sophisticated email automations including drip campaigns, win-back sequences, and nurturing' },
      { title: 'Revenue Generation Strategies', description: 'Implement proven tactics that generate 320% more revenue through email marketing' },
      { title: 'Complete Automation System', description: 'Master the tools and strategies to run email marketing on autopilot while scaling results' },
    ],
    'prompt-engineering-mastery': [
      { title: 'Advanced Prompting Frameworks', description: 'Master CLEAR, RISEN, and other professional frameworks for consistent AI outputs' },
      { title: 'Chain-of-Thought Techniques', description: 'Guide AI through complex reasoning processes for accurate, well-reasoned responses' },
      { title: 'Role & Persona Engineering', description: 'Design expert personas that transform AI into specialized consultants and advisors' },
      { title: 'Context Optimization', description: 'Structure information for maximum AI comprehension and output quality' },
      { title: 'Output Control & Formatting', description: 'Precisely control tone, style, format, and length of AI-generated content' },
      { title: 'Professional Prompt Library', description: 'Build reusable, tested prompts for business, technical, creative, and analytical tasks' },
    ],
    'ai-tools-productivity': [
      { title: 'Comprehensive AI Tool Mastery', description: 'Navigate 50+ AI tools across writing, research, design, video, and automation categories' },
      { title: 'Workflow Automation', description: 'Build AI-powered workflows that automate repetitive tasks and save hours daily' },
      { title: 'Content Creation Pipeline', description: 'Use AI for rapid content generation from ideation to final polished output' },
      { title: 'Research & Analysis Acceleration', description: 'Leverage AI for data analysis, report generation, and insight extraction' },
      { title: 'Creative Project Enhancement', description: 'Apply AI to design, video editing, presentations, and multimedia projects' },
      { title: 'Productivity System Design', description: 'Create personalized AI productivity stacks that align with your workflow and goals' },
    ],
  }
  return outcomes[slug] || []
}

function getDeliverables(slug: string): string {
  const deliverables: Record<string, string> = {
    'chatgpt-mastery': '50+ prompt templates & 30+ business communication templates',
    'ai-for-beginners': 'AI terms glossary, 30+ daily use templates, 50+ work prompts',
    'social-media-marketing-ai': '100+ caption templates, 50+ hashtag sets, 30+ AI prompts',
    'email-marketing-ai': '100+ email templates, subject line swipe file, automation playbook',
    'prompt-engineering-mastery': '200+ professional prompts, framework templates, case studies',
    'ai-tools-productivity': '50+ tool guides, workflow templates, automation scripts',
  }
  return deliverables[slug] || 'Downloadable resources and templates'
}
