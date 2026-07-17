// app/(marketing)/courses/page.tsx
// Courses listing page with custom SVG icons

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'AI Courses | AI Certification for Professionals 2026 | AI Learn Hub',
  description: 'Browse expert-led AI courses covering AI upskilling for business, prompt engineering for business, AI-driven marketing strategy, AI workflows for operational efficiency, and more. Earn your AI certification for professionals 2026.',
  keywords: [
    'AI for career growth',
    'AI upskilling for business',
    'AI certification for professionals 2026',
    'Prompt engineering for business',
    'advanced ChatGPT prompts for professionals',
    'AI-driven marketing strategy',
    'AI marketing automation tools',
    'AI for business operations optimization',
    'AI workflows for operational efficiency',
    'data-driven decision making with AI',
    'AI for business managers certification',
    'Enterprise AI strategy for non-technical teams',
    'No-code machine learning courses for business',
    'Business automation workflow certification',
    'NLP for business professionals',
  ],
  openGraph: {
    title: 'AI Courses | AI Certification for Professionals 2026 | AI Learn Hub',
    description: 'Expert-led AI courses for business professionals. Master prompt engineering, AI marketing strategy, productivity automation, and more.',
    type: 'website',
  },
}

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // Logged-in user — marketing layout's Header already shows Dashboard/Sign Out,
  // so just return content (no AuthenticatedLayout wrapper to avoid double header)
  if (user && user.email) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
            ← Back to Dashboard
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Our Courses</h1>
          <p className="text-gray-600">Expand your skills with our comprehensive AI courses</p>
        </div>

        {/* Bundle Banner */}
        <Link href="/pricing" className="block mb-10 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🎓</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">Best Value</span>
                    <span className="text-xs bg-white text-[#FF6F00] font-bold px-2 py-0.5 rounded-full">Save $34</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Complete AI Mastery Bundle — All 6 Courses</h3>
                  <p className="text-sm text-white/80 mt-0.5">34 modules · 16 hours · All certificates included</p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-white/60 line-through text-sm">$133</span>
                  <span className="text-3xl font-black text-white">$99</span>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-white text-[#FF6F00] font-bold text-sm px-5 py-2.5 rounded-xl shadow group-hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Get Bundle →
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] flex items-center justify-center relative">
                <Image
                  src={`/images/courses/${course.slug}.svg`}
                  alt={course.title}
                  width={200}
                  height={200}
                  className="w-32 h-32"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#FF6F00]">
                    ${(course.price_usd / 100).toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500 uppercase px-3 py-1 bg-gray-100 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.short_description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>{course.total_modules} modules</span>
                  <span>{course.total_hours} hours</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ResumeBlast.ai Banner */}
        <a href="https://www.resumeblast.ai/" target="_blank" rel="noopener noreferrer" className="block mt-12 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🚀</div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">Partner Offer</span>
                    <span className="text-xs bg-green-400 text-gray-900 font-bold px-2 py-0.5 rounded-full">Free to Start</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Ready to land your dream job?</h3>
                  <p className="text-sm text-white/60 mt-0.5">
                    Use <span className="text-white font-semibold">ResumeBlast.ai</span> to build an AI-powered resume and apply to hundreds of jobs instantly.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 bg-white text-[#0f172a] font-bold text-sm px-6 py-3 rounded-xl shadow group-hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Try ResumeBlast.ai →
                </span>
              </div>
            </div>
          </div>
        </a>

      </div>
    )
  }

  // Guest user — marketing layout's Header handles nav, just render page content
  return (
    <>
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master AI Skills with Expert-Led Courses
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Learn from industry professionals and advance your career
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
            ← Back to Home
          </Link>
        </div>

        {/* Bundle Banner */}
        <Link href="/pricing" className="block mb-10 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6F00] to-[#E65100] p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
            <div className="absolute -bottom-8 -left-4 w-28 h-28 rounded-full bg-white/10 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">🎓</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/70">Best Value</span>
                    <span className="text-xs bg-white text-[#FF6F00] font-bold px-2 py-0.5 rounded-full">Save $34</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Complete AI Mastery Bundle — All 6 Courses</h3>
                  <p className="text-sm text-white/80 mt-0.5">34 modules · 16 hours · All certificates included</p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-white/60 line-through text-sm">$133</span>
                  <span className="text-3xl font-black text-white">$99</span>
                </div>
                <span className="inline-flex items-center gap-1.5 bg-white text-[#FF6F00] font-bold text-sm px-5 py-2.5 rounded-xl shadow group-hover:bg-gray-50 transition-colors whitespace-nowrap">
                  Get Bundle →
                </span>
              </div>
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] flex items-center justify-center relative">
                <Image
                  src={`/images/courses/${course.slug}.svg`}
                  alt={course.title}
                  width={200}
                  height={200}
                  className="w-32 h-32"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#FF6F00]">
                    ${(course.price_usd / 100).toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500 uppercase px-3 py-1 bg-gray-100 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{course.short_description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>{course.total_modules} modules</span>
                  <span>{course.total_hours} hours</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ResumeBlast.ai Banner */}
        <a href="https://www.resumeblast.ai/" target="_blank" rel="noopener noreferrer" className="block mt-12 group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🚀</div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-widest text-white/50">Partner Offer</span>
                    <span className="text-xs bg-green-400 text-gray-900 font-bold px-2 py-0.5 rounded-full">Free to Start</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">Ready to land your dream job?</h3>
                  <p className="text-sm text-white/60 mt-0.5">
                    Use <span className="text-white font-semibold">ResumeBlast.ai</span> to build an AI-powered resume and apply to hundreds of jobs instantly.
                  </p>
                </div>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 bg-white text-[#0f172a] font-bold text-sm px-6 py-3 rounded-xl shadow group-hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Try ResumeBlast.ai →
                </span>
              </div>
            </div>
          </div>
        </a>

      </div>
    </>
  )
}
