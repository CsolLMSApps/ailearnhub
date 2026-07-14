// app/admin/student-view/page.tsx
// Admin-only: preview all courses as a student without payment

import { adminFetchAll } from '@/lib/supabase/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminStudentViewPage() {
  const { data: courses } = await adminFetchAll('courses', 'select=*&order=created_at.desc')

  return (
    <div>
      {/* Preview banner */}
      <div className="mb-6 px-5 py-4 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3">
        <span className="text-2xl">👁️</span>
        <div>
          <p className="font-bold text-purple-900 text-sm">Admin Student View</p>
          <p className="text-purple-700 text-xs mt-0.5">
            Preview all courses and module content exactly as students see them — no payment required.
            Quiz answers are read-only and cannot be submitted.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student View</h1>
          <p className="text-sm text-gray-500 mt-1">{courses.length} course{courses.length !== 1 ? 's' : ''} · click any to preview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course: any) => (
          <Link
            key={course.id}
            href={`/admin/student-view/${course.slug}`}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-[#FF6F00]/40 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                course.is_published
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {course.is_published ? '● Published' : '○ Draft'}
              </span>
              <span className="text-xs text-gray-400 capitalize bg-gray-50 px-2 py-1 rounded-full">
                {course.level}
              </span>
            </div>

            <h2 className="font-bold text-gray-900 text-lg mb-1.5 group-hover:text-[#FF6F00] transition-colors">
              {course.title}
            </h2>
            <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">
              {course.short_description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>📚 {course.total_modules} modules</span>
                <span>⏱ {course.total_hours}h</span>
                <span className="font-semibold text-gray-600">${(course.price_usd / 100).toFixed(0)}</span>
              </div>
              <span className="text-xs font-bold text-[#FF6F00] group-hover:underline">
                Preview →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <p className="text-4xl mb-3">📚</p>
          <p className="text-gray-500 font-medium">No courses found</p>
          <p className="text-gray-400 text-sm mt-1">Add courses via the Courses section</p>
        </div>
      )}
    </div>
  )
}
