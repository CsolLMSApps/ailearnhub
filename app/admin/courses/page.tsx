// app/admin/courses/page.tsx — Course analytics + course creation

import { adminFetchAll } from '@/lib/supabase/admin'
import CreateCourseForm from '@/components/admin/CreateCourseForm'

export const dynamic = 'force-dynamic'

export default async function AdminCoursesPage() {
  const [
    { data: courses },
    { data: purchases },
    { data: progressData },
    { data: quizResults },
    { data: certificates },
  ] = await Promise.all([
    adminFetchAll('courses', 'select=*&order=created_at.desc'),
    adminFetchAll('purchases', 'select=course_id,amount_paid,purchased_at'),
    adminFetchAll('progress', 'select=course_id,completion_percentage'),
    adminFetchAll('quiz_results', 'select=course_id,passed&eq.passed=true'),
    adminFetchAll('certificates', 'select=course_id'),
  ])

  const courseStats = (courses ?? []).map((c: any) => {
    const coursePurchases = (purchases ?? []).filter((p: any) => p.course_id === c.id)
    const courseProgress = (progressData ?? []).filter((p: any) => p.course_id === c.id)
    const courseQuizPasses = (quizResults ?? []).filter((q: any) => q.course_id === c.id && q.passed)
    const courseCerts = (certificates ?? []).filter((cert: any) => cert.course_id === c.id)

    const revenue = coursePurchases.reduce((sum: number, p: any) => sum + (p.amount_paid ?? 0), 0)
    const avgProgress = courseProgress.length > 0
      ? Math.round(courseProgress.reduce((sum: number, p: any) => sum + (p.completion_percentage ?? 0), 0) / courseProgress.length)
      : 0
    const completionRate = coursePurchases.length > 0
      ? Math.round((courseCerts.length / coursePurchases.length) * 100)
      : 0

    return {
      ...c,
      enrollments: coursePurchases.length,
      revenue,
      avgProgress,
      quizPasses: courseQuizPasses.length,
      certificates: courseCerts.length,
      completionRate,
    }
  })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-sm text-gray-500 mt-1">{courseStats.length} courses</p>
      </div>

      <CreateCourseForm />

      <div className="space-y-4">
        {courseStats.map((c: any) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{c.title}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{c.slug} · {c.level} · {c.total_modules} modules</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${(c.revenue / 100).toFixed(2)}</p>
                <p className="text-xs text-gray-400">total revenue</p>
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
          </div>
        ))}
      </div>
    </div>
  )
}
