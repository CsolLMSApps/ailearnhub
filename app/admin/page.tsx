// app/admin/page.tsx — Admin Overview Dashboard

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminOverviewPage() {
  const [
    { data: users },
    { data: courses },
    { data: purchases },
    { data: certificates },
    { data: quizResults },
  ] = await Promise.all([
    adminFetchUsers(),
    adminFetchAll('courses', 'select=id,title,slug,total_modules&is_published=eq.true'),
    adminFetchAll('purchases', 'select=*&order=purchased_at.desc'),
    adminFetchAll('certificates', 'select=id,course_id,issued_at,student_name,course_title'),
    adminFetchAll('quiz_results', 'select=id,passed,percentage,course_id,user_id,completed_at&order=completed_at.desc'),
  ])

  const totalRevenue = (purchases ?? []).reduce((s: number, p: any) => s + (p.amount_paid ?? 0), 0)
  const passedQuizzes = (quizResults ?? []).filter((q: any) => q.passed).length
  const totalQuizzes = quizResults?.length ?? 0
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0

  const userEmailMap: Record<string, string> = {}
  ;(users ?? []).forEach((u: any) => { userEmailMap[u.id] = u.email })

  const courseMap: Record<string, string> = {}
  ;(courses ?? []).forEach((c: any) => { courseMap[c.id] = c.title })

  // Recent activity feed (last 8 across purchases + certs + quiz passes)
  type ActivityItem = { type: string; label: string; sub: string; time: Date; icon: string; color: string }
  const activity: ActivityItem[] = [
    ...(purchases ?? []).slice(0, 5).map((p: any) => ({
      type: 'purchase', icon: '💳', color: 'bg-green-100 text-green-700',
      label: userEmailMap[p.user_id] ?? 'Unknown',
      sub: `Enrolled in ${courseMap[p.course_id] ?? 'a course'} · $${(p.amount_paid / 100).toFixed(2)}`,
      time: new Date(p.purchased_at),
    })),
    ...(certificates ?? []).slice(0, 3).map((c: any) => ({
      type: 'cert', icon: '🏆', color: 'bg-amber-100 text-amber-700',
      label: c.student_name ?? 'A student',
      sub: `Earned certificate for ${c.course_title ?? 'a course'}`,
      time: new Date(c.issued_at),
    })),
    ...(quizResults ?? []).filter((q: any) => q.passed).slice(0, 3).map((q: any) => ({
      type: 'quiz', icon: '✅', color: 'bg-purple-100 text-purple-700',
      label: userEmailMap[q.user_id] ?? 'A user',
      sub: `Passed quiz for ${courseMap[q.course_id] ?? 'a course'} with ${q.percentage}%`,
      time: new Date(q.completed_at),
    })),
  ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 8)

  // This month vs last month
  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}`
  const thisMonthRev = (purchases ?? [])
    .filter((p: any) => p.purchased_at?.startsWith(thisMonth))
    .reduce((s: number, p: any) => s + (p.amount_paid ?? 0), 0)
  const lastMonthRev = (purchases ?? [])
    .filter((p: any) => p.purchased_at?.startsWith(lastMonth))
    .reduce((s: number, p: any) => s + (p.amount_paid ?? 0), 0)
  const revGrowth = lastMonthRev > 0 ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100) : 0

  const statCards = [
    { label: 'Total Users', value: users?.length ?? 0, sub: 'Registered accounts', icon: '👥', from: 'from-blue-500', to: 'to-blue-600', href: '/admin/users' },
    { label: 'Total Revenue', value: `$${(totalRevenue / 100).toFixed(2)}`, sub: `${revGrowth >= 0 ? '+' : ''}${revGrowth}% vs last month`, icon: '💰', from: 'from-green-500', to: 'to-green-600', href: '/admin/analytics' },
    { label: 'Enrollments', value: purchases?.length ?? 0, sub: 'Completed purchases', icon: '📚', from: 'from-orange-500', to: 'to-orange-600', href: '/admin/purchases' },
    { label: 'Certificates', value: certificates?.length ?? 0, sub: 'Courses completed', icon: '🏆', from: 'from-amber-500', to: 'to-amber-600', href: '/admin/courses' },
    { label: 'Quiz Pass Rate', value: `${passRate}%`, sub: `${passedQuizzes}/${totalQuizzes} attempts`, icon: '📝', from: 'from-purple-500', to: 'to-purple-600', href: '/admin/quiz-results' },
    { label: 'Active Courses', value: courses?.length ?? 0, sub: 'Published & live', icon: '🎓', from: 'from-indigo-500', to: 'to-indigo-600', href: '/admin/courses' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time snapshot of AI Learn Hub</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="block group">
            <div className={`bg-gradient-to-br ${card.from} ${card.to} rounded-2xl p-5 text-white shadow-md hover:shadow-xl transition-shadow`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{card.icon}</span>
                <span className="text-white/60 text-xs group-hover:text-white transition-colors">View →</span>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-xs font-semibold text-white/80 mt-1">{card.label}</p>
              <p className="text-xs text-white/60 mt-0.5">{card.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Activity</h2>
          {activity.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {activity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold shrink-0 ${item.color}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.label}</p>
                    <p className="text-xs text-gray-500 truncate">{item.sub}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {item.time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Recent Purchases</h2>
            <Link href="/admin/purchases" className="text-xs text-[#FF6F00] hover:underline">View all →</Link>
          </div>
          {(purchases ?? []).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No purchases yet</p>
          ) : (
            <div className="space-y-3">
              {(purchases ?? []).slice(0, 6).map((p: any) => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {(userEmailMap[p.user_id] ?? '?')[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{userEmailMap[p.user_id] ?? 'Unknown'}</p>
                    <p className="text-xs text-gray-400 truncate">{courseMap[p.course_id] ?? '—'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-green-600">${(p.amount_paid / 100).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{new Date(p.purchased_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
