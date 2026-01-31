// app/learn/[slug]/module/[number]/page.tsx
// Module content viewer with integrated quiz system
// PATCHED: Navigation gated behind quiz pass requirement

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

  // Determine if user can proceed to next module:
  // - If a quiz exists for this module, user MUST have passed it
  // - If no quiz exists (shouldn't happen but safe fallback), allow navigation
  const canProceedToNext = quiz ? hasPassedQuiz : true

  // Find previous and next modules
  const currentIndex = allModules?.findIndex((m: { module_number: number }) => m.module_number === moduleNumber) ?? -1
  const previousModule = currentIndex > 0 ? allModules?.[currentIndex - 1] : null
  const nextModule = currentIndex < (allModules?.length ?? 0) - 1 ? allModules?.[currentIndex + 1] : null
  const isLastModule = currentIndex === (allModules?.length ?? 0) - 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/learn/${slug}`} className="text-[#FF6F00] hover:underline text-sm font-medium">
              ← Back to Course
            </Link>
            <span className="text-sm text-gray-500">
              Module {moduleNumber} of {allModules?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="w-full bg-gray-200 h-1">
            <div
              className="bg-[#FF6F00] h-1 transition-all duration-500"
              style={{ width: `${(moduleNumber / (allModules?.length || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-8">
            {/* Module Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-3 py-1 bg-[#FF6F00] text-white rounded-full text-sm font-bold">
                  Module {moduleNumber}
                </span>
                {isCompleted && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    ✅ Completed
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {module.title}
              </h1>
              {module.estimated_minutes && (
                <p className="text-gray-500 mt-1">
                  ⏱️ {module.estimated_minutes} minutes
                </p>
              )}
            </div>

            {/* Module Content */}
            <div className="prose max-w-none mb-8">
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

            {/* Quiz Section — only renders if quiz exists in DB */}
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

            {/* Quiz required warning — shows when quiz exists but not yet passed */}
            {quiz && !hasPassedQuiz && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium text-sm">
                  🔒 Complete the quiz above to unlock the next module
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              {/* Previous — always allowed */}
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

              {/* Next / Complete — GATED behind quiz pass */}
              {isLastModule ? (
                // Last module: show "Complete Course" only if quiz passed (or no quiz)
                canProceedToNext ? (
                  <Link
                    href={`/learn/${slug}`}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold"
                  >
                    Complete Course →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-bold"
                  >
                    🔒 Pass Quiz to Complete
                  </button>
                )
              ) : nextModule ? (
                // Not last module: show "Next Module" only if quiz passed (or no quiz)
                canProceedToNext ? (
                  <Link
                    href={`/learn/${slug}/module/${nextModule.module_number}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold"
                  >
                    Next Module →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="flex items-center gap-2 px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-bold"
                  >
                    🔒 Pass Quiz to Continue
                  </button>
                )
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
