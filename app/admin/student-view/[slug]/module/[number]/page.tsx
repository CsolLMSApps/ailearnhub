// app/admin/student-view/[slug]/module/[number]/page.tsx
// Admin module preview — full content + read-only quiz, no purchase check

import { notFound } from 'next/navigation'
import { adminFetch, adminFetchAll } from '@/lib/supabase/admin'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string; number: string }>
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

export default async function AdminStudentViewModulePage({ params }: Props) {
  const { slug, number } = await params
  const moduleNumber = parseInt(number)

  const { data: course } = await adminFetch('courses', `slug=eq.${slug}&select=*&limit=1`)
  if (!course) notFound()

  const { data: module } = await adminFetch(
    'course_modules',
    `course_id=eq.${course.id}&module_number=eq.${moduleNumber}&select=*&limit=1`
  )
  if (!module) notFound()

  const { data: allModules } = await adminFetchAll(
    'course_modules',
    `course_id=eq.${course.id}&select=id,module_number,title&order=module_number.asc`
  )

  const currentIndex = allModules.findIndex((m: any) => m.module_number === moduleNumber)
  const isLastModule = currentIndex === allModules.length - 1
  const previousModule = currentIndex > 0 ? allModules[currentIndex - 1] : null
  const nextModule = !isLastModule ? allModules[currentIndex + 1] : null

  // Fetch quiz for the last module (read-only preview)
  let quiz: any = null
  if (isLastModule) {
    const { data: quizData } = await adminFetch(
      'quizzes',
      `course_id=eq.${course.id}&module_number=eq.${moduleNumber}&select=*&limit=1`
    )
    quiz = quizData
  }

  const questions: any[] = quiz
    ? (Array.isArray(quiz.questions) ? quiz.questions : quiz.questions?.questions ?? [])
    : []

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Admin preview bar */}
      <div className="bg-purple-700 text-white px-6 py-2 flex items-center justify-between text-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span>👁️</span>
          <span className="font-semibold">Admin Preview Mode</span>
          <span className="text-purple-300">— Module {moduleNumber} of {allModules.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/admin/student-view/${slug}`} className="text-purple-200 hover:text-white transition-colors text-xs">
            ← Course Overview
          </Link>
          <Link href="/admin/student-view" className="text-purple-200 hover:text-white transition-colors text-xs">
            All Courses
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="w-full bg-gray-100 h-1">
            <div
              className="bg-[#FF6F00] h-1 transition-all duration-500"
              style={{ width: `${((moduleNumber) / allModules.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">

            {/* Module header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="inline-block px-3 py-1 bg-[#FF6F00] text-white rounded-full text-sm font-bold">
                  Module {moduleNumber}
                </span>
                {isLastModule && (
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">
                    Final Module
                  </span>
                )}
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  👁️ Admin Preview
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
              {module.estimated_minutes > 0 && (
                <p className="text-gray-400 mt-1 text-sm">⏱️ {module.estimated_minutes} minutes</p>
              )}
            </div>

            {/* Module content — PDF or Markdown */}
            {module.content_pdf_url && (
              <div className="mb-8">
                <div className="flex justify-end mb-2">
                  <a
                    href={module.content_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-[#FF6F00] transition-colors"
                  >
                    Open in new tab ↗
                  </a>
                </div>
                <iframe
                  src={`${module.content_pdf_url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                  className="w-full"
                  style={{ height: '82vh', minHeight: '620px', border: 'none', display: 'block' }}
                  title={module.title}
                />
              </div>
            )}

            <div className="prose max-w-none mb-10 overflow-hidden">
              {module.content ? (
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
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border border-gray-200 rounded-lg">{children}</table>
                      </div>
                    ),
                    th: ({ children }) => (
                      <th className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-left text-sm font-semibold text-gray-700">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 border-b border-gray-100 text-sm text-gray-600">{children}</td>
                    ),
                  }}
                >
                  {module.content}
                </ReactMarkdown>
              ) : (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-4xl mb-3">📄</p>
                  <p className="font-medium">No content added yet for this module.</p>
                  <p className="text-sm mt-1">
                    Add content via the{' '}
                    <Link href="/admin/modules" className="text-[#FF6F00] hover:underline">
                      Module Editor
                    </Link>
                    .
                  </p>
                </div>
              )}
            </div>

            {/* Quiz preview — read only, last module only */}
            {isLastModule && (
              <div className="border-t border-gray-100 pt-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-block px-3 py-1 bg-purple-600 text-white rounded-full text-sm font-bold">
                    🏆 Course Final Quiz
                  </span>
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    Admin Read-Only Preview
                  </span>
                </div>

                {questions.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                    <p className="text-amber-700 font-medium">No quiz has been created for this module yet.</p>
                    <p className="text-amber-600 text-sm mt-1">
                      Add quiz questions via the{' '}
                      <Link href="/admin/quiz" className="underline font-semibold">Quiz Editor</Link>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 flex items-center gap-2 text-sm text-purple-700">
                      <span>ℹ️</span>
                      <span>
                        {questions.length} questions · {quiz?.pass_percentage ?? 70}% to pass ·
                        Correct answers are highlighted below
                      </span>
                    </div>

                    {questions.map((q: any, qi: number) => (
                      <div
                        key={q.id || qi}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <span className="w-7 h-7 rounded-full bg-[#FF6F00]/10 text-[#FF6F00] text-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {qi + 1}
                          </span>
                          <p className="font-semibold text-gray-900 leading-snug">{q.question}</p>
                        </div>

                        <div className="space-y-2 ml-10">
                          {(q.options || []).map((opt: string, oi: number) => {
                            const isCorrect = q.correct === oi
                            return (
                              <div
                                key={oi}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 ${
                                  isCorrect
                                    ? 'border-green-400 bg-green-50'
                                    : 'border-gray-100 bg-gray-50'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isCorrect
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {OPTION_LABELS[oi]}
                                </span>
                                <span className={`text-sm flex-1 ${isCorrect ? 'text-green-800 font-semibold' : 'text-gray-600'}`}>
                                  {opt}
                                </span>
                                {isCorrect && (
                                  <span className="text-green-600 text-xs font-bold shrink-0">✓ Correct</span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              {previousModule ? (
                <Link
                  href={`/admin/student-view/${slug}/module/${previousModule.module_number}`}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors font-medium text-sm"
                >
                  ← Previous Module
                </Link>
              ) : (
                <div />
              )}

              {nextModule ? (
                <Link
                  href={`/admin/student-view/${slug}/module/${nextModule.module_number}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold text-sm"
                >
                  Next Module →
                </Link>
              ) : (
                <Link
                  href={`/admin/student-view/${slug}`}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-sm"
                >
                  ← Back to Course
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
