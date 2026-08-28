// app/learn/[slug]/module/[number]/page.tsx
// Modules 1–(N-1): read freely, no quiz gate.
// Last module only: shows Course Final Quiz (10 questions covering all modules).

import { notFound, redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AutoMarkVisited } from '@/components/AutoMarkVisited'
import { adminFetch } from '@/lib/supabase/admin'
import Link from 'next/link'
import PdfIframe from '@/components/course/PdfIframe'
import StudentNotes from '@/components/course/StudentNotes'
import MarkdownRenderer from '@/components/course/MarkdownRenderer'

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

  // Fetch this student's existing note for this module (silent fail — no note = empty string)
  const { data: existingNote } = await supabase
    .from('student_notes')
    .select('content')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('module_number', moduleNumber)
    .single()

  const initialNote = existingNote?.content ?? ''

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

  const totalModules = allModules?.length || 0
  const doneCount = completedModules.length
  const overallPct = totalModules > 0 ? Math.round((doneCount / totalModules) * 100) : 0

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Auto-mark non-final modules as complete on visit */}
      {!isLastModule && <AutoMarkVisited slug={slug} moduleNumber={moduleNumber} />}

      {/* ── Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#212121] fixed top-0 left-0 bottom-0 z-20 overflow-y-auto shrink-0">

        {/* Course info + progress */}
        <div className="p-5 border-b border-white/10">
          <Link
            href={`/learn/${slug}`}
            className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-medium transition-colors mb-3"
          >
            ← Back to course
          </Link>
          <p className="text-white font-bold text-sm leading-snug mb-4">{course.title}</p>
          <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
            <span>{doneCount} of {totalModules} modules done</span>
            <span>{overallPct}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-[#FF6F00] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>
        </div>

        {/* Module list */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {allModules?.map((m: any, idx: number) => {
            const isActive  = m.module_number === moduleNumber
            const isDone    = completedModules.includes(m.module_number)
            const prevDone  = idx === 0 || completedModules.includes(allModules[idx - 1].module_number)
            const isLocked  = !prevDone && !isDone && !isActive

            if (isLocked) {
              return (
                <div
                  key={m.module_number}
                  className="flex items-start gap-3 px-5 py-3 opacity-35 cursor-not-allowed"
                >
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs text-white/30 flex-shrink-0 mt-0.5">
                    🔒
                  </div>
                  <span className="text-white/30 text-xs leading-snug">{m.title}</span>
                </div>
              )
            }

            return (
              <Link
                key={m.module_number}
                href={`/learn/${slug}/module/${m.module_number}`}
                className={`flex items-start gap-3 px-5 py-3 transition-colors border-r-2 ${
                  isActive
                    ? 'bg-[#FF6F00]/15 border-[#FF6F00]'
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                {/* Status indicator */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                  isDone
                    ? 'bg-green-500 text-white'
                    : isActive
                    ? 'bg-[#FF6F00] text-white'
                    : 'border border-white/20 text-white/40'
                }`}>
                  {isDone ? '✓' : m.module_number}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug ${
                    isActive  ? 'text-white font-semibold' :
                    isDone    ? 'text-white/50' :
                                'text-white/65'
                  }`}>
                    {m.title}
                  </p>
                  {isActive && (
                    <p className="text-[#FF6F00] text-[10px] mt-0.5 font-medium">Currently reading</p>
                  )}
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-white/10">
          <Link
            href={`/learn/${slug}/quiz`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#FF6F00]/20 hover:bg-[#FF6F00]/30 text-[#FF6F00] rounded-lg text-xs font-bold transition-colors"
          >
            📝 Course Final Quiz
          </Link>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="lg:ml-64 flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-3 flex items-center justify-between max-w-3xl mx-auto w-full">
            {/* Mobile back link */}
            <Link
              href={`/learn/${slug}`}
              className="lg:hidden text-[#FF6F00] hover:underline text-sm font-medium"
            >
              ← Back
            </Link>
            <span className="text-sm text-gray-400 ml-auto">
              Module {moduleNumber} / {totalModules}
            </span>
          </div>
          {/* Reading progress bar */}
          <div className="w-full bg-gray-100 h-0.5">
            <div
              className="bg-[#FF6F00] h-0.5 transition-all duration-500"
              style={{ width: `${(moduleNumber / totalModules) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-8 w-full">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">

            {/* Module header */}
            <div className="p-8 pb-0">
              <div className="flex items-center gap-3 mb-3">
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

            {/* Module body */}
            <div className="p-8 pt-6">

              {/* Markdown content */}
              {module.content ? (
                <div className="mb-8 overflow-hidden">
                  <MarkdownRenderer content={module.content} />
                </div>
              ) : module.content_pdf_url ? (
                <div className="mb-8">
                  <PdfIframe
                    src={`/api/pdf-viewer?url=${encodeURIComponent(module.content_pdf_url)}`}
                    title={module.title}
                  />
                </div>
              ) : null}

              {/* Final Quiz CTA */}
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
                        <Link href={`/learn/${slug}/quiz`} className="px-5 py-2.5 border-2 border-green-500 text-green-700 rounded-lg font-semibold text-sm hover:bg-green-100 transition-colors">
                          Retake Quiz
                        </Link>
                        <Link href={`/learn/${slug}/certificate`} className="px-5 py-2.5 bg-[#FF6F00] text-white rounded-lg font-semibold text-sm hover:bg-[#E65100] transition-colors">
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
                      <Link href={`/learn/${slug}/quiz`} className="inline-flex items-center gap-2 px-8 py-3 bg-[#FF6F00] text-white rounded-xl font-bold text-lg hover:bg-[#E65100] transition-colors shadow-md">
                        Take Final Quiz →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Student Notes */}
              <StudentNotes
                courseId={course.id}
                moduleNumber={moduleNumber}
                initialNote={initialNote}
                courseTitle={course.title}
                moduleTitle={module.title}
              />

              {/* Prev / Next navigation */}
              <div className="flex items-center justify-between mt-6">
                {previousModule ? (
                  <Link
                    href={`/learn/${slug}/module/${previousModule.module_number}`}
                    className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors"
                  >
                    ← Previous
                  </Link>
                ) : <div />}

                {isLastModule ? <div /> : nextModule ? (
                  <Link
                    href={`/learn/${slug}/module/${nextModule.module_number}`}
                    className="flex items-center gap-2 px-6 py-3 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold"
                  >
                    Next Module →
                  </Link>
                ) : <div />}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
