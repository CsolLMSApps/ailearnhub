// app/learn/[courseSlug]/module/[moduleNumber]/page.tsx
// Individual module viewer with markdown content and completion

import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CompleteModuleButton from '@/components/course/CompleteModuleButton'

export const dynamic = 'force-dynamic'

interface ModulePageProps {
  params: Promise<{ courseSlug: string; moduleNumber: string }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { courseSlug, moduleNumber } = await params
  const moduleNum = parseInt(moduleNumber)
  const supabase = await createServerSupabaseClient()

  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect(`/auth/login?redirect=/learn/${courseSlug}/module/${moduleNumber}`)
  }

  // Get course details
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', courseSlug)
    .single()

  if (!course) {
    notFound()
  }

  // Check purchase
  const { data: purchase } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) {
    redirect(`/courses/${courseSlug}`)
  }

  // Get module
  const { data: module } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .eq('module_number', moduleNum)
    .single()

  if (!module) {
    notFound()
  }

  // Get progress
  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  // Get all modules for navigation
  const { data: allModules } = await supabase
    .from('course_modules')
    .select('id, module_number, title')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  const isCompleted = progress?.completed_modules?.includes(moduleNum)
  const currentIndex = allModules?.findIndex(m => m.module_number === moduleNum) ?? -1
  const prevModule = currentIndex > 0 ? allModules?.[currentIndex - 1] : null
  const nextModule = currentIndex < (allModules?.length ?? 0) - 1 ? allModules?.[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Module Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/learn/${courseSlug}`}
              className="text-[#FF6F00] hover:text-[#E65100] font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          {/* Module Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#FF6F00] text-white text-sm font-bold px-3 py-1 rounded">
                Module {module.module_number}
              </span>
              {module.estimated_minutes && (
                <span className="text-sm text-gray-500">
                  {module.estimated_minutes} minutes
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {module.title}
            </h1>
            {module.description && (
              <p className="text-lg text-gray-600 mt-3">
                {module.description}
              </p>
            )}
          </div>

          {/* Module Content - Markdown */}
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => (
                  <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-xl font-bold text-gray-900 mt-5 mb-2" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-gray-700 leading-relaxed mb-4" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2" {...props} />
                ),
                li: ({ node, ...props }) => (
                  <li className="leading-relaxed" {...props} />
                ),
                code: ({ node, inline, ...props }: any) =>
                  inline ? (
                    <code className="bg-gray-100 text-[#FF6F00] px-2 py-1 rounded text-sm font-mono" {...props} />
                  ) : (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" {...props} />
                  ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4" {...props} />
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-gray-600 my-4" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-[#FF6F00] hover:text-[#E65100] underline" {...props} />
                ),
                strong: ({ node, ...props }) => (
                  <strong className="font-bold text-gray-900" {...props} />
                ),
              }}
            >
              {module.content || '# Content Coming Soon\n\nThis module content is being prepared.'}
            </ReactMarkdown>
          </div>

          {/* Mark as Complete Button */}
          {!isCompleted && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <CompleteModuleButton
                courseId={course.id}
                moduleNumber={moduleNum}
                nextModuleNumber={nextModule?.module_number}
                courseSlug={courseSlug}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {prevModule ? (
            <Link
              href={`/learn/${courseSlug}/module/${prevModule.module_number}`}
              className="flex items-center gap-2 text-[#FF6F00] hover:text-[#E65100] font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-500">Previous</div>
                <div className="text-sm">Module {prevModule.module_number}: {prevModule.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextModule ? (
            <Link
              href={`/learn/${courseSlug}/module/${nextModule.module_number}`}
              className="flex items-center gap-2 text-[#FF6F00] hover:text-[#E65100] font-medium"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500">Next</div>
                <div className="text-sm">Module {nextModule.module_number}: {nextModule.title}</div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  )
}
