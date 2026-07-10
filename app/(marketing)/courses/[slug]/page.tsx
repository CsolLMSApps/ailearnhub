// app/(marketing)/courses/[slug]/page.tsx
// Dynamic course page with functional purchase flow
// PATCHED: Added FALLBACK_MODULES so curriculum always renders even if DB is empty

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import EnrollButton from '@/components/course/EnrollButton'

export const dynamic = 'force-dynamic'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

// ---------------------------------------------------------------------------
// FALLBACK MODULE DATA — used when course_modules table returns empty.
// Source: official course meta files in content/courses/
// ---------------------------------------------------------------------------
interface FallbackModule {
  module_number: number
  title: string
  description: string
  estimated_minutes: number
}

const FALLBACK_MODULES: Record<string, FallbackModule[]> = {
  'chatgpt-mastery': [
    { module_number: 1, title: 'ChatGPT Quick Start', description: 'Get up and running with ChatGPT fast. Learn account setup, the interface, and how to have your first productive conversations with AI.', estimated_minutes: 20 },
    { module_number: 2, title: 'Prompt Engineering Mastery', description: 'Master the art of writing prompts that get exactly what you want. Learn the 5-part prompt formula, chaining, role-playing, and 20+ proven templates.', estimated_minutes: 45 },
    { module_number: 3, title: 'Business Communication Excellence', description: 'Transform your professional writing. Use AI to craft polished emails, meeting summaries, proposals, and presentations in a fraction of the time.', estimated_minutes: 40 },
    { module_number: 4, title: 'Content Creation Accelerator', description: 'Create blog posts, social media content, and marketing copy 10x faster. Learn frameworks that produce high-quality content consistently.', estimated_minutes: 45 },
    { module_number: 5, title: 'AI-Powered Productivity', description: 'Automate repetitive tasks, streamline your workflow, and reclaim hours every week. Master task management and time-saving techniques with AI.', estimated_minutes: 40 },
    { module_number: 6, title: 'Advanced ChatGPT Techniques', description: 'Unlock API integration basics, custom instructions, and advanced use cases that go beyond everyday prompting for maximum leverage.', estimated_minutes: 35 },
    { module_number: 7, title: 'Beyond ChatGPT - Your AI Toolkit', description: 'Explore the broader AI ecosystem. Learn integration strategies, evaluate other AI tools, and prepare for the future of AI in your workflow.', estimated_minutes: 30 },
  ],
  'ai-for-beginners': [
    { module_number: 1, title: 'AI Demystified', description: 'Understand what AI really is, how it works, and where it shows up in your daily life. No jargon, no confusion — just clear, friendly explanations.', estimated_minutes: 20 },
    { module_number: 2, title: 'Getting Started with ChatGPT', description: 'Create your account, learn the interface, and have your first conversations. Discover how to get useful responses right away.', estimated_minutes: 25 },
    { module_number: 3, title: 'AI for Everyday Life', description: 'Use AI for personal productivity, learning new skills, and tackling creative projects. Practical examples you can try immediately.', estimated_minutes: 35 },
    { module_number: 4, title: 'AI at Work', description: 'Apply AI to professional tasks — emails, presentations, research, and career development. Industry-specific use cases included.', estimated_minutes: 40 },
    { module_number: 5, title: 'Creative & Personal Uses', description: 'Explore AI for content creation, personal projects, and hobby enhancement. Unlock your creative potential with AI as your partner.', estimated_minutes: 30 },
    { module_number: 6, title: 'Next Steps & Simple Tools', description: 'Consolidate everything you have learned and discover your next steps. Overview of simple AI tools that complement ChatGPT for an even broader toolkit.', estimated_minutes: 25 },
  ],
  'social-media-marketing-ai': [
    { module_number: 1, title: 'AI for Social Media Strategy', description: 'Master AI tools for audience research, content planning, and platform-specific strategies. Create 90-day growth plans and content calendars that drive engagement.', estimated_minutes: 25 },
    { module_number: 2, title: 'AI-Powered Content Creation', description: 'Create compelling captions, hashtag strategies, and repurpose content across platforms using AI. Master viral content frameworks and platform-specific optimization.', estimated_minutes: 30 },
    { module_number: 3, title: 'Visual Content & AI Design Tools', description: 'Master AI image generation, Canva AI features, and video creation. Create stunning visuals that match platform requirements and drive engagement.', estimated_minutes: 25 },
    { module_number: 4, title: 'AI for Social Media Analytics', description: 'Use AI to analyze performance data, track metrics, run A/B tests, and calculate ROI. Learn predictive analytics and competitor analysis strategies.', estimated_minutes: 30 },
    { module_number: 5, title: 'AI-Powered Community Management', description: 'Automate comment responses, integrate customer service AI, monitor sentiment, and manage crises. Build engaged communities that scale.', estimated_minutes: 25 },
    { module_number: 6, title: 'Advanced AI Marketing Tactics', description: 'Master influencer outreach, ad optimization, multi-platform campaigns, CRM integration, and advanced analytics. Prepare for the future of AI marketing.', estimated_minutes: 25 },
  ],
  'email-marketing-ai': [
    { module_number: 1, title: 'Email Marketing Strategy with AI', description: 'Build data-driven email strategies using AI tools. Master audience research, segmentation, and campaign planning for maximum ROI.', estimated_minutes: 25 },
    { module_number: 2, title: 'AI-Powered Email Writing', description: 'Write subject lines and body copy that convert using AI. Master proven frameworks, CTAs, and personalization techniques.', estimated_minutes: 25 },
    { module_number: 3, title: 'Segmentation & Personalization', description: 'Target the right people with the right message. Learn RFM segmentation, behavioral targeting, and dynamic content.', estimated_minutes: 25 },
    { module_number: 4, title: 'A/B Testing & Optimization', description: 'Systematically test and improve email performance. Learn what to test, how to analyze results, and scale winners.', estimated_minutes: 20 },
    { module_number: 5, title: 'Email Automation Workflows', description: 'Build automated sequences that convert 24/7. Master welcome series, cart recovery, and advanced workflow strategies.', estimated_minutes: 25 },
  ],
  'prompt-engineering-mastery': [
    { module_number: 1, title: 'Prompt Engineering Fundamentals', description: 'Learn the core elements of effective prompts: Role, Task, Context, Format, Constraints, and Examples. Build a strong foundation for all advanced techniques.', estimated_minutes: 25 },
    { module_number: 2, title: 'Advanced Prompting Techniques', description: 'Master chain-of-thought reasoning, few-shot learning, zero-shot prompting, role prompting, and iterative refinement to get consistently better outputs.', estimated_minutes: 25 },
    { module_number: 3, title: 'Prompt Templates & Use Cases', description: 'Apply prompting to real-world scenarios: writing, analysis, coding, research, and creative projects. Build a personal template library you use daily.', estimated_minutes: 25 },
    { module_number: 4, title: 'Prompt Engineering for Business', description: 'Deploy prompts for customer service, sales, marketing, HR, and operations. Learn to build scalable AI workflows for every department.', estimated_minutes: 20 },
    { module_number: 5, title: 'Building Your Prompt Library', description: 'Organize, version-control, and optimize your personal prompt collection. Learn meta-prompting to continuously improve your own prompts automatically.', estimated_minutes: 20 },
  ],
  'ai-tools-productivity': [
    { module_number: 1, title: 'AI Productivity Revolution', description: 'Understand the AI productivity landscape, identify your bottlenecks, and build your AI tool stack for maximum time savings.', estimated_minutes: 25 },
    { module_number: 2, title: 'AI Writing Tools Mastery', description: 'Master ChatGPT, Claude, and specialized writing AI. Create reusable templates and workflows for all your content needs.', estimated_minutes: 25 },
    { module_number: 3, title: 'AI Design & Visual Tools', description: 'Generate professional images with Midjourney and DALL-E, create graphics with Canva AI, and produce videos in minutes.', estimated_minutes: 20 },
    { module_number: 4, title: 'AI Automation & Workflows', description: 'Connect AI tools with Zapier and Make, automate repetitive tasks, and build no-code workflows that run 24/7.', estimated_minutes: 20 },
    { module_number: 5, title: 'Productivity Systems & Mastery', description: 'Build complete AI productivity systems, measure ROI, avoid common pitfalls, and scale to 2-3x productivity.', estimated_minutes: 15 },
  ],
}

const LEARNING_OUTCOMES: Record<string, string[]> = {
  'chatgpt-mastery': [
    'Write prompts that produce professional-grade results every time',
    'Use ChatGPT to cut email and communication time by 80%',
    'Create marketing content 10x faster with AI',
    'Automate repetitive tasks and reclaim hours each week',
    'Master advanced techniques like API integration and custom instructions',
    'Build a personalized AI toolkit that grows with your career',
  ],
  'ai-for-beginners': [
    'Understand exactly what AI is and how it works — no tech background needed',
    'Set up and navigate ChatGPT with confidence',
    'Use AI for everyday tasks at home and at work',
    'Apply AI to professional challenges in any industry',
    'Explore creative and personal AI use cases',
    'Build a plan for continuing your AI learning journey',
  ],
  'social-media-marketing-ai': [
    'Build AI-powered social media strategies for any platform',
    'Create compelling content at scale using AI tools',
    'Design professional visuals with AI in minutes',
    'Analyze social media performance with AI-driven insights',
    'Manage communities and customer service with AI automation',
    'Run multi-platform campaigns and influencer programs efficiently',
  ],
  'email-marketing-ai': [
    'Build data-driven email strategies using AI for research and planning',
    'Write high-converting subject lines and email copy with AI',
    'Segment audiences with precision using RFM and behavioral targeting',
    'Run effective A/B tests and optimize based on real data',
    'Create automated email workflows that convert around the clock',
  ],
  'prompt-engineering-mastery': [
    'Craft prompts using the 6-element framework that always works',
    'Apply advanced techniques like chain-of-thought and few-shot learning',
    'Build a personal prompt library organized by use case',
    'Deploy prompts across business functions for real ROI',
    'Use meta-prompting to continuously improve your own prompts',
  ],
  'ai-tools-productivity': [
    'Identify the right AI tools for every task in your workflow',
    'Master writing with ChatGPT and specialized AI tools',
    'Create professional visuals and videos using AI design tools',
    'Build no-code automations that save hours every week',
    'Design a complete productivity system that compounds over time',
  ],
}

const DELIVERABLES: Record<string, string[]> = {
  'chatgpt-mastery': ['50+ Prompt Templates', '30 Business Communication Templates', '100 Content Ideas', 'Completion Certificate'],
  'ai-for-beginners': ['AI Terms Glossary', '30 Daily Use Templates', '50 Work-Specific Prompts', '40 Creative Ideas', 'Completion Certificate'],
  'social-media-marketing-ai': ['90-Day Growth Plan Template', 'Content Calendar System', 'Caption Formula Swipe File', 'Analytics Dashboard Template', 'Completion Certificate'],
  'email-marketing-ai': ['100+ Email Templates', 'AI Prompts Master Library', 'Subject Line Swipe File (500+)', 'Workflow Templates (15+)', 'Completion Certificate'],
  'prompt-engineering-mastery': ['100+ Prompt Templates Library', 'Prompt Optimization Framework', 'Business Use Case Playbook', 'Personal Prompt Library Template', 'Completion Certificate'],
  'ai-tools-productivity': ['AI Tool Stack Builder', '50+ Prompt Templates', 'Automation Workflow Templates (10+)', 'ROI Calculator & Time Tracking Sheets', 'Completion Certificate'],
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !course) {
    notFound()
  }

  const { data: dbModules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  // Belt-and-suspenders: use DB if populated, otherwise hardcoded fallback
  const modules: FallbackModule[] =
    (dbModules && dbModules.length > 0)
      ? dbModules.map((m: any) => ({
          module_number: m.module_number,
          title: m.title,
          description: m.description || '',
          estimated_minutes: m.estimated_minutes || 0,
        }))
      : (FALLBACK_MODULES[slug] || [])

  const learningOutcomes = LEARNING_OUTCOMES[slug] || []
  const deliverables = DELIVERABLES[slug] || []
  const price = (course.price_usd / 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back nav */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto">
          <Link href="/courses" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
            ← Back to Courses
          </Link>
        </div>
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl mb-6 text-white/90">{course.short_description}</p>
            <div className="flex items-center gap-6 text-white/90 mb-8">
              <span className="font-medium">{course.total_modules} Modules</span>
              <span className="font-medium">{course.total_hours} Hours</span>
              <span className="font-medium capitalize">{course.level}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur px-6 py-3 rounded-lg">
                <span className="text-3xl font-bold">${price}</span>
                <span className="text-white/70 ml-2 line-through text-sm">
                  ${(Number(price) * 1.5).toFixed(0)}
                </span>
              </div>
              <EnrollButton slug={slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* What You Will Learn */}
            {learningOutcomes.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What You&apos;ll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0 w-5 h-5 bg-[#FF6F00] rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Curriculum */}
            {modules.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div key={module.module_number} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-start p-4 bg-gray-50">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#FF6F00] text-white text-sm font-bold flex-shrink-0 mr-4 mt-0.5">
                          {module.module_number}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{module.title}</h3>
                          {module.description && (
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          )}
                        </div>
                        {module.estimated_minutes > 0 && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded flex-shrink-0 ml-4 mt-0.5">
                            {module.estimated_minutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-gray-900">${price}</span>
                <span className="text-gray-400 line-through ml-2 text-lg">
                  ${(Number(price) * 1.5).toFixed(0)}
                </span>
              </div>
              <EnrollButton slug={slug} fullWidth />
              <p className="text-center text-sm text-gray-500 mt-4">30-day money-back guarantee</p>
            </div>

            {deliverables.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">What&apos;s Included</h3>
                <ul className="space-y-3">
                  {deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-[#FF6F00] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Course Details</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  {course.total_modules} Modules
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {course.total_hours} Hours Total
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="capitalize">{course.level}</span> Level
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Lifetime Access
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  Certificate on Completion
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
