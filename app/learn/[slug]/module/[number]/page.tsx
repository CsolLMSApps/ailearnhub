// app/learn/[slug]/module/[number]/page.tsx
// Modules 1–(N-1): read freely, no quiz gate.
// Last module only: shows Course Final Quiz (10 questions covering all modules).

import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AutoMarkVisited } from '@/components/AutoMarkVisited'
import { adminFetch } from '@/lib/supabase/admin'
import Link from 'next/link'
import PdfIframe from '@/components/course/PdfIframe'

export const dynamic = 'force-dynamic'

interface ModulePageProps {
  params: Promise<{ slug: string; number: string }>
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { slug, number } = await params
  const moduleNumber = parseInt(number)
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()

  // Check purchase — use limit(1) instead of single() to handle potential duplicate rows gracefully
  const { data: purchaseRows } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .limit(1)

  if (!purchaseRows || purchaseRows.length === 0) redirect(`/courses/${slug}`)

  const { data: module } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .eq('module_number', moduleNumber)
    .single()

  if (!module) notFound()

  const { data: allModules } = await supabase
    .from('course_modules')
    .select('id, module_number, title')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  const completedModules: number[] = progress?.completed_modules || []
  const isCompleted = completedModules.includes(moduleNumber)

  // ── Sequential unlock ────────────────────────────────────────────────────────
  // Module 1 is always accessible. Every other module requires the previous one
  // to be in completed_modules before it can be opened.
  if (moduleNumber > 1) {
    const prevModuleNumber = allModules?.[
      (allModules?.findIndex((m: { module_number: number }) => m.module_number === moduleNumber) ?? 0) - 1
    ]?.module_number

    if (prevModuleNumber && !completedModules.includes(prevModuleNumber)) {
      // Redirect to the furthest unlocked module (last completed + 1, or module 1)
      const lastCompleted = completedModules.length > 0 ? Math.max(...completedModules) : 0
      const nextUnlocked = allModules?.find(
        (m: { module_number: number }) => m.module_number === lastCompleted + 1
      )
      redirect(`/learn/${slug}/module/${nextUnlocked?.module_number ?? allModules?.[0]?.module_number ?? 1}`)
    }
  }
  // ────────────────────────────────────────────────────────────────────────────

  const currentIndex = allModules?.findIndex((m: { module_number: number }) => m.module_number === moduleNumber) ?? -1
  const isLastModule = currentIndex === (allModules?.length ?? 0) - 1
  const previousModule = currentIndex > 0 ? allModules?.[currentIndex - 1] : null
  const nextModule = !isLastModule ? allModules?.[currentIndex + 1] : null

  // Only fetch the quiz on the last module — it's the Course Final Quiz
  let quiz: any = null
  let quizResult: any = null
  let hasPassedQuiz = false

  if (isLastModule) {
    const { data: fetchedQuiz } = await adminFetch(
      'quizzes',
      `course_id=eq.${course.id}&module_number=eq.${moduleNumber}&select=*&limit=1`
    )
    quiz = fetchedQuiz

    const { data: fetchedResult } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('module_number', moduleNumber)
      .eq('passed', true)
      .order('percentage', { ascending: false })
      .limit(1)
      .single()

    quizResult = fetchedResult
    hasPassedQuiz = !!quizResult
  }

  // Modules 1–(N-1): always unlocked.
  // Last module: ALWAYS requires quiz pass — even if quiz fails to load.
  // Removing the (quiz ? ... : true) bypass that unlocked the button when quiz was null.
  const canProceedToNext = isLastModule ? hasPassedQuiz : true

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auto-mark non-final modules as complete on visit */}
      {!isLastModule && <AutoMarkVisited slug={slug} moduleNumber={moduleNumber} />}

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

          {/* Module header — always padded */}
          <div className="p-8 pb-0">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-block px-3 py-1 bg-[#FF6F00] text-white rounded-full text-sm font-bold">
                  Module {moduleNumber}
                </span>
                {isCompleted && (
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-bold">
                    ✅ Completed
                  </span>
                )}
                {isLastModule && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                    Final Module
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
            </div>
          </div>

          {/* PDF content — auto-height iframe, no internal scrollbar */}
          {module.content_pdf_url ? (
            <PdfIframe
              src={`/api/pdf-viewer?url=${encodeURIComponent(module.content_pdf_url)}`}
              title={module.title}
            />
          ) : null}

          {/* Padded content area — markdown + quiz CTA + navigation */}
          <div className="p-8 pt-6">

            {/* Markdown content (shown when no PDF, or alongside PDF if both exist) */}
            {module.content && (
            <div className="prose max-w-none mb-8 overflow-hidden">
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
                  li: ({ children }) => <li className="ml-4">{children}</li>,
                  pre: ({ children }) => (
                    <pre className="bg-gray-50 border border-gray-200 rounded-lg my-4 overflow-x-auto max-w-full">
                      {children}
                    </pre>
                  ),
                  code: ({ children, className }) => {
                    const isInline = !className
                    return isInline ? (
                      <code className="bg-orange-50 text-[#FF6F00] px-1 py-0.5 rounded text-sm font-mono break-all">
                        {children}
                      </code>
                    ) : (
                      <code className="block text-gray-800 p-4 text-sm font-mono whitespace-pre-wrap break-words">
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
            )}

            {/* Final Quiz CTA — last module */}
            {isLastModule && (
              <div className="mb-8">
                {hasPassedQuiz ? (
                  <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 text-center">
                    <p className="text-4xl mb-3">🏆</p>
                    <h2 className="text-xl font-bold text-green-800 mb-1">Quiz Passed!</h2>
                    <p className="text-green-700 text-sm mb-4">
                      You scored {quizResult.percentage}% — your certificate is ready.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Link
                        href={`/learn/${slug}/quiz`}
                        className="px-5 py-2.5 border-2 border-green-500 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-100 transition-colors"
                      >
                        Retake Quiz
                      </Link>
                      <Link
                        href={`/learn/${slug}/certificate`}
                        className="px-5 py-2.5 bg-[#FF6F00] text-white rounded-lg font-semibold text-sm hover:bg-[#E65100] transition-colors"
                      >
                        View Certificate →
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-[#FF6F00] rounded-xl p-8 text-center">
                    <p className="text-5xl mb-4">📝</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready for the Final Quiz?</h2>
                    <p className="text-gray-600 mb-6">
                      Test your knowledge across all modules. Score {quiz?.pass_percentage ?? 70}% or higher to earn your certificate.
                    </p>
                    <Link
                      href={`/learn/${slug}/quiz`}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-[#FF6F00] text-white rounded-xl font-bold text-lg hover:bg-[#E65100] transition-colors shadow-md"
                    >
                      Take Final Quiz →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
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

              {isLastModule ? (
                // No navigation button on last module — user must pass the quiz above.
                // After passing, ResultsSummary shows "View Certificate →".
                <div />
              ) : nextModule ? (
                <Link
                  href={`/learn/${slug}/module/${nextModule.module_number}`}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold"
                >
                  Next Module →
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>{/* end padded content area */}
        </div>
      </div>
    </div>
  )
}
