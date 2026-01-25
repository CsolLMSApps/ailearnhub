// app/(marketing)/courses/[slug]/page.tsx
// Dynamic course page with functional purchase flow

import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import EnrollButton from '@/components/course/EnrollButton'

export const dynamic = 'force-dynamic'

interface CoursePageProps {
  params: Promise<{ slug: string }>
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Get course details
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error || !course) {
    notFound()
  }

  // Get course modules
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  // Format price for display
  const price = (course.price_usd / 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {course.title}
            </h1>
            <p className="text-xl mb-6 text-white/90">
              {course.short_description}
            </p>
            <div className="flex items-center gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <span className="font-medium">{course.total_modules} Modules</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{course.total_hours} Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{course.level}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">${price}</div>
              <EnrollButton slug={slug} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Content */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Master AI tools and techniques',
                  'Build real-world projects',
                  'Understand best practices',
                  'Get industry-ready skills',
                  'Access lifetime updates',
                  'Join community support',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#FF6F00] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-6">Course Curriculum</h2>
              <div className="space-y-4">
                {modules?.map((module) => (
                  <div
                    key={module.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#FF6F00] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#FF6F00] text-white text-sm font-bold px-3 py-1 rounded">
                            Module {module.module_number}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">
                            {module.title}
                          </h3>
                        </div>
                        {module.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {module.description}
                          </p>
                        )}
                      </div>
                      {module.estimated_minutes && (
                        <div className="text-sm text-gray-500 ml-4">
                          {module.estimated_minutes} min
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - What's Included */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ${price}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>

              <EnrollButton slug={slug} fullWidth />

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold mb-4">This course includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {course.total_hours} hours of content
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lifetime access
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certificate of completion
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mobile access
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30-day money-back guarantee
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <svg className="w-5 h-5 text-[#FF6F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Downloadable resources
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
