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
  const allDone = allModules.every(m => completedModules.includes(m.module_number))

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

          {hasPassedQuiz && (
            <div className="mt-5 inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-xl px-5 py-2.5 text-sm font-semibold">
              ✅ You passed with {quizResult.percentage}% — retake to improve your score
            </div>
          )}
        </div>

        {/* Quiz component */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <QuizComponent
            slug={slug}
            moduleNumber={quiz.module_number}
            questions={questions}
            passPercentage={quiz.pass_percentage}
          />
        </div>

      </div>
    </div>
  )
}
