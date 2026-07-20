// app/learn/[slug]/page.tsx
// Course overview page — shows all modules, progress, and completion certificate

export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetch, adminUpsert } from '@/lib/supabase/admin'
import Link from 'next/link'

// Generate a unique certificate number
function generateCertNumber(userId: string, courseId: string): string {
  const ts = Date.now().toString(36).toUpperCase()
  const uid = userId.replace(/-/g, '').substring(0, 6).toUpperCase()
  const cid = courseId.replace(/-/g, '').substring(0, 4).toUpperCase()
  return `AIH-${ts}-${uid}-${cid}`
}

interface CourseLearnPageProps {
  params: Promise<{ slug: string }>
}

export default async function CourseLearnPage({ params }: CourseLearnPageProps) {
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

  // Check purchase — use limit(1) instead of single() to handle potential duplicate rows gracefully
  const { data: purchaseRows } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .limit(1)

  if (!purchaseRows || purchaseRows.length === 0) redirect(`/courses/${slug}`)

  // Get all modules
  const { data: modules } = await supabase
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

  const completedModules: number[] = progress?.completed_modules || []
  const totalModules = modules?.length || 0
  const completionPct = totalModules > 0
    ? Math.round((completedModules.length / totalModules) * 100)
    : 0

  // Certificate and completion banner only show when the FINAL QUIZ was actually passed.
  // Visiting modules alone (auto-mark) is not enough.
  const lastModuleNumber = modules?.[modules.length - 1]?.module_number
  const { data: finalQuizPass } = await supabase
    .from('quiz_results')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('module_number', lastModuleNumber)
    .eq('passed', true)
    .limit(1)
    .single()

  const isCourseComplete = completionPct === 100 && !!finalQuizPass

  // Auto-create certificate when course is 100% complete.
  // Uses adminUpsert (service role key) to bypass RLS on the certificates table.
  let certificate = null
  if (isCourseComplete) {
    const studentName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Student'

    const { data: cert } = await adminUpsert(
      'certificates',
      {
        user_id: user.id,
        course_id: course.id,
        certificate_number: generateCertNumber(user.id, course.id),
        student_name: studentName,
        course_title: course.title,
      },
      'user_id,course_id'
    )
    certificate = cert
  }

  // First incomplete module for "Continue" button
  const nextIncomplete = modules?.find(m => !completedModules.includes(m.module_number))
  const continueModule = nextIncomplete ?? modules?.[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-[#FF6F00] hover:underline text-sm font-medium">
            ← Back to Dashboard
          </Link>
          <span className="text-sm text-gray-500 font-medium">
            {completedModules.length}/{totalModules} modules complete
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Course Hero */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-[#FF6F00] text-sm font-semibold rounded-full mb-3">
                {course.category}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-500 text-sm">
                {totalModules} modules · {course.total_hours || Math.ceil(totalModules * 0.7)} hours
              </p>
            </div>
            {continueModule && (
              <Link
                href={`/learn/${slug}/module/${continueModule.module_number}`}
                className="shrink-0 px-6 py-3 bg-[#FF6F00] text-white rounded-lg font-semibold hover:bg-[#E65100] transition-colors"
              >
                {completedModules.length === 0 ? 'Start Learning →' : 'Continue Learning →'}
              </Link>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Your Progress</span>
              <span className="font-semibold text-[#FF6F00]">{completionPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#FF6F00] h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* 🎉 Completion Banner */}
        {isCourseComplete && (
          <div className="bg-green-50 border-2 border-green-400 rounded-xl p-8 mb-6 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Congratulations! You've completed this course!
            </h2>
            <p className="text-green-700 mb-6">
              You've mastered all {totalModules} modules. Outstanding work!
            </p>

            {certificate && (
              <div className="bg-white border-2 border-green-400 rounded-xl px-8 py-6 max-w-md mx-auto">
                <div className="text-4xl mb-3">🏆</div>
                <p className="font-bold text-gray-900 text-xl mb-1">Certificate of Completion</p>
                <p className="text-gray-700 font-medium">{certificate.student_name}</p>
                <p className="text-gray-500 text-sm mt-1">{certificate.course_title}</p>
                <p className="text-gray-400 text-xs mt-2 font-mono">#{certificate.certificate_number}</p>
                <p className="text-gray-400 text-xs mt-1">
                  Issued {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <div className="mt-5 flex gap-3 justify-center">
                  <Link
                    href={`/learn/${slug}/certificate`}
                    className="px-5 py-2 bg-[#FF6F00] text-white rounded-lg font-semibold text-sm hover:bg-[#E65100] transition-colors"
                  >
                    View & Download Certificate
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Module List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Course Modules</h2>
          </div>

          <ul className="divide-y divide-gray-100">
            {modules?.map((mod, index) => {
              const isDone = completedModules.includes(mod.module_number)
              const isCurrent = continueModule?.module_number === mod.module_number && !isCourseComplete
              const isLast = mod.module_number === lastModuleNumber

              // Sequential unlock: module 1 is always open; every other module
              // requires the previous one to be completed first.
              const prevModuleNumber = index > 0 ? modules[index - 1].module_number : null
              const isLocked = prevModuleNumber !== null && !completedModules.includes(prevModuleNumber)

              const rowClass = `flex items-center gap-4 px-6 py-4 transition-colors ${
                isLocked
                  ? 'opacity-50 cursor-not-allowed bg-gray-50'
                  : isCurrent
                  ? 'bg-orange-50 hover:bg-orange-100'
                  : isLast && !isCourseComplete
                  ? 'bg-purple-50 hover:bg-purple-100'
                  : 'hover:bg-gray-50'
              }`

              const inner = (
                <>
                  {/* Status icon */}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    isDone
                      ? 'bg-green-100 text-green-700'
                      : isLocked
                      ? 'bg-gray-200 text-gray-400'
                      : isCurrent
                      ? 'bg-[#FF6F00] text-white'
                      : isLast
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {isDone ? '✓' : isLocked ? '🔒' : mod.module_number}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold truncate ${isDone ? 'text-gray-500' : isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                      {mod.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {isLast && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                          🏆 Final Quiz
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-xs text-gray-400">Complete previous module to unlock</span>
                      )}
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="shrink-0">
                    {isCourseComplete && isLast ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">✅ Passed</span>
                    ) : isDone ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Completed</span>
                    ) : isLocked ? (
                      <span className="text-xs bg-gray-200 text-gray-400 px-2 py-1 rounded-full">Locked</span>
                    ) : isCurrent ? (
                      <span className="text-xs bg-[#FF6F00] text-white px-2 py-1 rounded-full font-medium">Continue →</span>
                    ) : isLast ? (
                      <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-medium">Take Quiz →</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">Start</span>
                    )}
                  </div>
                </>
              )

              return (
                <li key={mod.id}>
                  {isLocked ? (
                    <div className={rowClass}>{inner}</div>
                  ) : (
                    <Link href={`/learn/${slug}/module/${mod.module_number}`} className={rowClass}>
                      {inner}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>

          {/* Quiz requirement notice at bottom of module list */}
          {!isCourseComplete && (
            <div className="px-6 py-4 bg-amber-50 border-t border-amber-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-amber-500 text-xl">📝</span>
                <p className="text-sm text-amber-800">
                  <span className="font-bold">Course Final Quiz required</span> — Complete all modules then pass the quiz to earn your certificate.
                </p>
              </div>
              <Link
                href={`/learn/${slug}/quiz`}
                className="shrink-0 px-4 py-2 bg-[#FF6F00] text-white text-xs font-bold rounded-lg hover:bg-[#E65100] transition-colors"
              >
                Take Quiz →
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
