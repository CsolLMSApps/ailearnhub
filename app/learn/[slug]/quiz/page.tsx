// app/learn/[slug]/quiz/page.tsx
// Dedicated Course Final Quiz page — separate from module content

export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetch } from '@/lib/supabase/admin'
import { QuizComponent } from '@/components/quiz/QuizComponent'
import Link from 'next/link'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function CourseQuizPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Get course
  const { data: course } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()

  // Check purchase
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .single()

  if (!purchase) redirect(`/courses/${slug}`)

  // Get all modules to find the last one
  const { data: allModules } = await supabase
    .from('course_modules')
    .select('id, module_number, title')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  if (!allModules?.length) notFound()

  // Guard: all modules must be completed before the quiz is accessible
  const { data: progress } = await supabase
    .from('progress')
    .select('completed_modules')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  const completedModules: number[] = progress?.completed_modules ?? []

  // The last module is only "completed" after passing the quiz — exclude it from this check.
  // Require all modules except the last to be visited before the quiz is accessible.
  const nonFinalModules = allModules.slice(0, -1)
  const allDone = nonFinalModules.every(m => completedModules.includes(m.module_number))

  if (!allDone) redirect(`/learn/${slug}`)

  const lastModule = allModules[allModules.length - 1]

  // Fetch the quiz — find any quiz for this course (ordered by module_number desc
  // so if multiple exist, we get the highest module's quiz)
  const { data: quiz } = await adminFetch(
    'quizzes',
    `course_id=eq.${course.id}&select=*&order=module_number.desc&limit=1`
  )

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center max-w-md">
          <p className="text-5xl mb-4">📝</p>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Quiz Not Available Yet</h2>
          <p className="text-gray-500 text-sm mb-6">The final quiz for this course hasn't been published yet. Check back soon.</p>
          <Link href={`/learn/${slug}`} className="text-[#FF6F00] hover:underline font-medium text-sm">
            ← Back to Course
          </Link>
        </div>
      </div>
    )
  }

  // Check existing pass — use the quiz's actual module_number
  const { data: quizResult } = await supabase
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('module_number', quiz.module_number)
    .eq('passed', true)
    .order('percentage', { ascending: false })
    .limit(1)
    .single()

  const hasPassedQuiz = !!quizResult

  const questions = Array.isArray(quiz.questions)
    ? quiz.questions
    : (quiz.questions?.questions ?? [])

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href={`/learn/${slug}/module/${lastModule.module_number}`}
            className="text-[#FF6F00] hover:underline text-sm font-medium"
          >
            ← Back to Module {lastModule.module_number}
          </Link>
          <span className="text-sm text-gray-500 font-medium">
            {course.title}
          </span>
          <Link href={`/learn/${slug}`} className="text-sm text-gray-400 hover:text-gray-600">
            Course Overview
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Quiz header card */}
        <div className="bg-gradient-to-br from-[#FF6F00] to-[#E65100] rounded-2xl p-8 mb-8 text-white text-center">
          <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
            🏆 Course Final Quiz
          </span>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-white/80 text-base">
            {questions.length} questions · Score {quiz.pass_percentage}% or higher to earn your certificate
          </p>
        </div>

        {hasPassedQuiz ? (
          /* ── Passed: show completion card ── */
          <div className="space-y-6">
            {/* Success card */}
            <div className="bg-white rounded-2xl border-2 border-green-400 shadow-sm overflow-hidden">
              <div className="bg-green-50 border-b border-green-200 px-8 py-6 flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-green-800">Quiz Passed! 🎉</h2>
                  <p className="text-green-600 text-sm">You scored {quizResult.percentage}% — well above the {quiz.pass_percentage}% pass mark</p>
                </div>
              </div>

              <div className="px-8 py-8 text-center">
                <p className="text-gray-600 mb-6 text-base">
                  Congratulations on completing <span className="font-semibold text-gray-900">{course.title}</span>!
                  Your certificate is ready to download.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={`/learn/${slug}/certificate`}
                    className="inline-flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-8 py-3 rounded-xl transition-colors text-base"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    View My Certificate
                  </Link>
                  <Link
                    href={`/learn/${slug}`}
                    className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors text-base"
                  >
                    ← Back to Course
                  </Link>
                </div>
              </div>
            </div>

            {/* Retake option */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Want to improve your score?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your current best score is <span className="font-semibold text-gray-700">{quizResult.percentage}%</span>.
                Retaking won't affect your certificate — it's already issued.
              </p>
              {/* Retake quiz inline */}
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-[#FF6F00] hover:text-[#E65100] list-none flex items-center gap-1">
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Retake the quiz
                </summary>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <QuizComponent
                    slug={slug}
                    moduleNumber={quiz.module_number}
                    questions={questions}
                    passPercentage={quiz.pass_percentage}
                  />
                </div>
              </details>
            </div>
          </div>
        ) : (
          /* ── Not yet passed: show quiz ── */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <QuizComponent
              slug={slug}
              moduleNumber={quiz.module_number}
              questions={questions}
              passPercentage={quiz.pass_percentage}
            />
          </div>
        )}

      </div>
    </div>
  )
}
