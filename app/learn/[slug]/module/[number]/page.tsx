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
import ModuleLayout from '@/components/course/ModuleLayout'
import ReaderControls from '@/components/course/ReaderControls'
import ReadingProgress from '@/components/course/ReadingProgress'
import FlashcardPanel from '@/components/course/FlashcardPanel'
import MindMapPanel from '@/components/course/MindMapPanel'

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
    <ModuleLayout
      slug={slug}
      courseTitle={course.title}
      moduleNumber={moduleNumber}
      allModules={(allModules ?? []) as { module_number: number; title: string }[]}
      completedModules={completedModules}
      doneCount={doneCount}
      totalModules={totalModules}
      overallPct={overallPct}
    >
      {/* Auto-mark non-final modules as complete on visit */}
      {!isLastModule && <AutoMarkVisited slug={slug} moduleNumber={moduleNumber} />}

      {/* ── Main content area (inner) ── */}
      <div className="flex-1 flex flex-col min-h-screen">

        {/* Top bar */}
        <div className="module-topbar bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-2.5 flex items-center gap-2 w-full">
            {/* Mobile back link */}
            <Link
              href={`/learn/${slug}`}
              className="lg:hidden text-[#FF6F00] hover:underline text-sm font-medium shrink-0"
            >
              ← Back
            </Link>
            {/* Reader controls: module label + search + font size + dark mode */}
            <ReaderControls
              moduleNumber={moduleNumber}
              totalModules={totalModules}
              slug={slug}
              allModules={(allModules ?? []) as { module_number: number; title: string }[]}
            />
          </div>
          {/* Scroll-based reading progress */}
          <ReadingProgress />
        </div>

        {/* Content */}
        <div className="module-content-area px-4 sm:px-6 py-6 w-full">

          {/* ── Module Header Card ── */}
          <div className="relative bg-gradient-to-br from-[#FF6F00] via-[#F57C00] to-[#E65100] rounded-2xl shadow-lg shadow-orange-200/50 overflow-hidden mb-5">
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '22px 22px' }} />
            <div className="relative px-7 pt-7 pb-6">
              {/* Top row: module bubble + course info + badges */}
              <div className="flex items-start justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex flex-col items-center justify-center shrink-0">
                    <span className="text-white/60 text-[8px] font-bold uppercase tracking-wider leading-none">MOD</span>
                    <span className="text-white text-xl font-black leading-none">{moduleNumber}</span>
                  </div>
                  <div>
                    <p className="text-orange-100 text-[11px] font-semibold uppercase tracking-widest leading-none mb-1">{course.title}</p>
                    <p className="text-white/60 text-xs">{doneCount} of {totalModules} modules completed</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap justify-end shrink-0">
                  {isCompleted && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-[11px] font-bold border border-white/25">
                      ✅ Done
                    </span>
                  )}
                  {isLastModule && (
                    <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-[11px] font-bold border border-white/25">
                      🏁 Final
                    </span>
                  )}
                </div>
              </div>
              {/* Module title */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-white leading-tight">{module.title}</h1>
            </div>
            {/* Overall progress strip */}
            <div className="bg-black/20 h-1.5">
              <div className="bg-white/50 h-1.5 transition-all duration-700" style={{ width: `${overallPct}%` }} />
            </div>
          </div>

          {/* ── Content Card ── */}
          <div className="module-card bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-7 sm:px-8 sm:py-8">

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

              {/* Mind map — auto-generated from module headings */}
              {module.content && <MindMapPanel title={module.title} content={module.content} />}

              {/* Flashcards — auto-generated from KEY TAKEAWAY / DEFINITION callouts */}
              {module.content && <FlashcardPanel content={module.content} />}

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
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                {previousModule ? (
                  <Link
                    href={`/learn/${slug}/module/${previousModule.module_number}`}
                    className="flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-[#FF6F00] transition-colors text-sm font-medium group"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform inline-block">←</span>
                    <span>Previous</span>
                  </Link>
                ) : <div />}

                {isLastModule ? <div /> : nextModule ? (
                  <Link
                    href={`/learn/${slug}/module/${nextModule.module_number}`}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6F00] text-white rounded-xl hover:bg-[#E65100] transition-colors font-bold text-sm shadow-sm shadow-orange-200 group"
                  >
                    <span>Next Module</span>
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </Link>
                ) : <div />}
              </div>

            </div>
          </div>
        </div>
      </div>
    </ModuleLayout>
  )
}
