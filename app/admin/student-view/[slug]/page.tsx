// app/admin/student-view/[slug]/page.tsx
// Admin course overview — mirrors /learn/[slug] but with no purchase check

import { notFound } from 'next/navigation'
import { adminFetch, adminFetchAll } from '@/lib/supabase/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminStudentViewCoursePage({ params }: Props) {
  const { slug } = await params

  const { data: course } = await adminFetch('courses', `slug=eq.${slug}&select=*&limit=1`)
  if (!course) notFound()

  const { data: modules } = await adminFetchAll(
    'course_modules',
    `course_id=eq.${course.id}&select=id,module_number,title,estimated_minutes&order=module_number.asc`
  )

  const totalModules = modules.length
  const lastModule = modules[modules.length - 1]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin preview bar */}
      <div className="bg-purple-700 text-white px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span>👁️</span>
          <span className="font-semibold">Admin Preview Mode</span>
          <span className="text-purple-300">— viewing as student</span>
        </div>
        <Link href="/admin/student-view" className="text-purple-200 hover:text-white transition-colors text-xs">
          ← All Courses
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Course hero card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="inline-block px-3 py-1 bg-orange-100 text-[#FF6F00] text-sm font-semibold rounded-full mb-3">
                {course.category || course.level}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-500 text-sm mb-1">{course.short_description}</p>
              <p className="text-gray-400 text-xs mt-2">
                {totalModules} modules · {course.total_hours || Math.ceil(totalModules * 0.7)} hours · {course.level}
              </p>
            </div>
            {modules[0] && (
              <Link
                href={`/admin/student-view/${slug}/module/${modules[0].module_number}`}
                className="shrink-0 px-6 py-3 bg-[#FF6F00] text-white rounded-lg font-semibold hover:bg-[#E65100] transition-colors"
              >
                Start Preview →
              </Link>
            )}
          </div>

          {/* Fake full progress bar for admin */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Admin Preview — all modules unlocked</span>
              <span className="font-semibold text-purple-600">Full Access</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full w-full" />
            </div>
          </div>
        </div>

        {/* Module list */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Course Modules</h2>
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-3 py-1 rounded-full">
              {totalModules} modules
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {modules.map((mod: any) => {
              const isLast = mod.module_number === lastModule?.module_number
              return (
                <li key={mod.id}>
                  <Link
                    href={`/admin/student-view/${slug}/module/${mod.module_number}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                  >
                    {/* Number badge */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                      isLast
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-orange-100 text-[#FF6F00]'
                    }`}>
                      {mod.module_number}
                    </div>

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-[#FF6F00] transition-colors truncate">
                        {mod.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {isLast && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                            🏆 Final Quiz
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <span className="shrink-0 text-xs font-semibold text-gray-400 group-hover:text-[#FF6F00] transition-colors">
                      View →
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

      </div>
    </div>
  )
}
