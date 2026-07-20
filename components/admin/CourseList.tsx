'use client'

import { useState, useActionState } from 'react'
import { deleteCourse } from '@/app/actions/admin-courses'
import EditCourseForm from '@/components/admin/EditCourseForm'

interface CourseStat {
  id: string
  title: string
  slug: string
  level?: string
  total_modules: number
  revenue: number
  enrollments: number
  avgProgress: number
  quizPasses: number
  certificates: number
  completionRate: number
  // editable content fields
  short_description?: string | null
  about_course?: string | null
  skill_tags?: string[] | null
  what_you_learn?: string[] | null
  what_is_included?: string[] | null
  banner_url?: string | null
  price_usd?: number
  category?: string | null
  featured?: boolean
  is_published?: boolean
}

const initialState = { error: undefined, success: undefined }

export default function CourseList({ courses }: { courses: CourseStat[] }) {
  const [deleteState, deleteAction, deletePending] = useActionState(deleteCourse, initialState)
  const [editingId, setEditingId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {deleteState.success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          ✅ {deleteState.success}
        </p>
      )}
      {deleteState.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          ❌ {deleteState.error}
        </p>
      )}

      {courses.map((c) => (
        <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">{c.title}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {c.slug} · {c.total_modules} modules
              </p>
            </div>
            <div className="flex items-start gap-2 shrink-0">
              <div className="text-right mr-2">
                <p className="text-2xl font-bold text-green-600">${(c.revenue / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-400">total revenue</p>
              </div>
              {/* Edit button */}
              <button
                onClick={() => setEditingId(editingId === c.id ? null : c.id)}
                className="mt-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {editingId === c.id ? 'Close' : 'Edit'}
              </button>
              {/* Delete button */}
              <form action={deleteAction}>
                <input type="hidden" name="course_id" value={c.id} />
                <input type="hidden" name="course_title" value={c.title} />
                <button
                  type="submit"
                  disabled={deletePending}
                  className="mt-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={(e) => {
                    if (
                      !confirm(
                        `Delete "${c.title}"?\n\nThis will permanently remove the course AND all its modules. This cannot be undone.`
                      )
                    ) {
                      e.preventDefault()
                    }
                  }}
                >
                  {deletePending ? 'Deleting…' : '🗑 Delete'}
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#FF6F00]">{c.enrollments}</p>
              <p className="text-xs text-gray-500 mt-0.5">Enrollments</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-600">{c.avgProgress}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Avg Progress</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-600">{c.quizPasses}</p>
              <p className="text-xs text-gray-500 mt-0.5">Quiz Passes</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{c.certificates}</p>
              <p className="text-xs text-gray-500 mt-0.5">Certificates ({c.completionRate}%)</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Completion rate</span>
              <span>{c.completionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${c.completionRate}%` }}
              />
            </div>
          </div>

          {/* Inline Edit Form */}
          {editingId === c.id && (
            <EditCourseForm
              course={c}
              onClose={() => setEditingId(null)}
            />
          )}
        </div>
      ))}
    </div>
  )
}
