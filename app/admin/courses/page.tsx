// app/admin/courses/page.tsx — Course analytics + course creation

import { adminFetchAll } from '@/lib/supabase/admin'
import CreateCourseForm from '@/components/admin/CreateCourseForm'
import CourseList from '@/components/admin/CourseList'

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

      <CourseList courses={courseStats} />
    </div>
  )
}
