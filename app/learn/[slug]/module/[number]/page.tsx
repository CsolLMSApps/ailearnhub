// app/learn/[slug]/module/[number]/page.tsx
// Module content viewer with integrated quiz system

import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { QuizComponent } from '@/components/quiz/QuizComponent'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface ModulePageProps {
  params: Promise<{ slug: string; number: string }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug, number } = await params
  const moduleNumber = parseInt(number)
  const supabase = await createServerSupabaseClient()

  // Get authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!course) {
    notFound()
  }

  // Check if user purchased course
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) {
    redirect(`/courses/${slug}`)
  }

  // Get module content
  const { data: module } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .eq('module_number', moduleNumber)
    .single()

  if (!module) {
    notFound()
  }

  // Get all modules for navigation
  const { data: allModules } = await supabase
    .from('course_modules')
    .select('id, module_number, title')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  // Get user progress
  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  const isCompleted = progress?.completed_modules?.includes(moduleNumber) || false

  // Get quiz for this module
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('*')
    .eq('course_id', course.id)
    .eq('module_number', moduleNumber)
    .single()

  // Get user's best quiz result for this module
  const { data: quizResult } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('module_number', moduleNumber)
    .eq('passed', true)
    .order('percentage', { ascending: false })
    .limit(1)
    .single()

  const hasPassedQuiz = !!quizResult

  // Find previous and next modules
  const currentIndex = allModules?.findIndex((m) => m.module_number === moduleNumber) ?? -1
  const previousModule = currentIndex > 0 ? allModules?.[currentIndex - 1] : null
  const nextModule = currentIndex < (allModules?.length ?? 0) - 1 ? allModules?.[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href={`/learn/${slug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Course
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-lg font-bold text-gray-900">
                {course.title}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {progress && (
                <span className="text-sm text-gray-600">
                  Progress: {progress.completion_percentage}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Module Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h2 className="font-bold text-gray-900 mb-4">Course Modules</h2>
              <div className="space-y-2">
                {allModules?.map((m) => {
                  const isCurrentModule = m.module_number === moduleNumber
                  const isModuleCompleted = progress?.completed_modules?.includes(m.module_number) || false
                  
                  return (
                    <Link
                      key={m.id}
                      href={`/learn/${slug}/module/${m.module_number}`}
                      className={`block p-3 rounded-lg transition-colors ${
                        isCurrentModule
                          ? 'bg-[#FF6F00] text-white'
                          : isModuleCompleted
                          ? 'bg-green-50 text-green-900 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Module {m.module_number}
                        </span>
                        {isModuleCompleted && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <p className="text-xs mt-1 opacity-90 line-clamp-1">
                        {m.title}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Module Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="bg-[#FF6F00] text-white text-sm font-bold px-3 py-1 rounded">
                      Module {module.module_number}
                    </span>
                    {isCompleted && (
                      <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {module.title}
                  </h1>
                  {module.description && (
                    <p className="text-gray-600">
                      {module.description}
                    </p>
                  )}
                </div>
                {module.estimated_minutes && (
                  <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded">
                    {module.estimated_minutes} min
                  </div>
                )}
              </div>
            </div>

            {/* Module Content */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-3">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="ml-4">{children}</li>
                    ),
                    code: ({ children, className }) => {
                      const isInline = !className
                      return isInline ? (
                        <code className="bg-gray-100 text-[#FF6F00] px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4">
                          {children}
                        </code>
                      )
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-[#FF6F00] pl-4 italic text-gray-600 my-4">
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {module.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Quiz Section */}
            {quiz && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Module Quiz
                  </h2>
                  <p className="text-gray-600">
                    Test your knowledge! You need {quiz.pass_percentage}% to pass and complete this module.
                  </p>
                  
                  {hasPassedQuiz && (
                    <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                      <p className="text-green-800 font-medium">
                        ✅ You've already passed this quiz with {quizResult.percentage}%!
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        You can retake it to improve your score.
                      </p>
                    </div>
                  )}
                  
                  {!hasPassedQuiz && (
                    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                      <p className="text-blue-800 font-medium">
                        📝 Complete the quiz below to finish this module
                      </p>
                    </div>
                  )}
                </div>

                <QuizComponent
                  slug={slug}
                  moduleNumber={moduleNumber}
                  questions={quiz.questions.questions || quiz.questions}
                  passPercentage={quiz.pass_percentage}
                  onPass={() => {
                    // Refresh page to show updated progress
                    window.location.reload()
                  }}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              {previousModule ? (
                <Link
                  href={`/learn/${slug}/module/${previousModule.module_number}`}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors"
                >
                  ← Previous Module
                </Link>
              ) : (
                <div />
              )}

              {nextModule ? (
                <Link
                  href={`/learn/${slug}/module/${nextModule.module_number}`}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold"
                >
                  Next Module →
                </Link>
              ) : (
                <Link
                  href={`/learn/${slug}`}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                >
                  Complete Course →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
