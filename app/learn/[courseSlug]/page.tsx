// app/learn/[courseSlug]/page.tsx
// Main course viewer - shows list of modules after purchase

import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface LearnPageProps {
  params: Promise<{ courseSlug: string }>
}

export default async function LearnPage({ params }: LearnPageProps) {
  const { courseSlug } = await params
  const supabase = await createServerSupabaseClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect(`/auth/login?redirect=/learn/${courseSlug}`)
  }

  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .eq('is_published', true)
    .single()

  if (!course) {
    notFound()
  }

  // Check if user has purchased this course
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) {
    // User hasn't purchased - redirect to course page
    redirect(`/courses/${courseSlug}`)
  }

  // Get or create progress record
  let { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!progress) {
    // Create initial progress record
    const { data: newProgress } = await supabase
      .from('progress')
      .insert({
        user_id: user.id,
        course_id: course.id,
        current_module: 1,
        completed_modules: [],
        completion_percentage: 0
      })
      .select()
      .single()
    
    progress = newProgress
  }

  // Get all course modules
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-gray-600 mt-1">{course.short_description}</p>
            </div>
            <Link
              href="/dashboard"
              className="text-[#FF6F00] hover:text-[#E65100] font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Course Progress</span>
              <span className="font-medium text-gray-900">
                {progress?.completion_percentage || 0}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#FF6F00] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress?.completion_percentage || 0}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {progress?.completed_modules?.length || 0} of {modules?.length || 0} modules completed
            </p>
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules?.map((module) => {
            const isCompleted = progress?.completed_modules?.includes(module.module_number)
            const isCurrent = progress?.current_module === module.module_number
            
            return (
              <Link
                key={module.id}
                href={`/learn/${courseSlug}/module/${module.module_number}`}
                className={`block bg-white rounded-lg border-2 p-6 transition-all hover:shadow-lg ${
                  isCurrent
                    ? 'border-[#FF6F00] shadow-md'
                    : isCompleted
                    ? 'border-green-500'
                    : 'border-gray-200 hover:border-[#FF6F00]'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FF6F00] text-white text-xs font-bold px-2 py-1 rounded">
                      Module {module.module_number}
                    </span>
                    {isCompleted && (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {module.estimated_minutes && (
                    <span className="text-sm text-gray-500">
                      {module.estimated_minutes} min
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {module.title}
                </h3>

                {module.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {module.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4">
                  <span className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-[#FF6F00]'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Not Started'}
                  </span>
                  <span className="text-[#FF6F00] font-medium">
                    {isCompleted ? 'Review' : isCurrent ? 'Continue' : 'Start'} →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Course Completion */}
        {progress?.completion_percentage === 100 && (
          <div className="mt-8 bg-gradient-to-r from-[#FF6F00] to-[#E65100] rounded-lg p-8 text-white text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Congratulations!</h2>
            <p className="text-xl mb-6">
              You've completed {course.title}
            </p>
            <Link
              href={`/certificate/${course.id}`}
              className="inline-block bg-white text-[#FF6F00] font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
            >
              View Your Certificate
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
