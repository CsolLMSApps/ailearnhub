// app/admin/activity/page.tsx
// User Activity Dashboard — tracks engagement across progress, quiz_results, purchases, certificates

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'
import HorizontalBarChart from '@/components/admin/HorizontalBarChart'

export const dynamic = 'force-dynamic'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function isWithinDays(dateStr: string | null, days: number) {
  if (!dateStr) return false
  return Date.now() - new Date(dateStr).getTime() < days * 86400000
}

export default async function ActivityPage() {
  const now = new Date()

  const [
    { data: progressRows },
    { data: allPurchases },
    { data: certificates },
    { data: quizResults },
    { data: courses },
    { data: authUsers },
  ] = await Promise.all([
    adminFetchAll('progress', 'select=user_id,course_id,completion_percentage,completed_modules,last_accessed,completed_at'),
    adminFetchAll('purchases', 'select=user_id,course_id,status'),
    adminFetchAll('certificates', 'select=user_id,course_id,issued_at'),
    adminFetchAll('quiz_results', 'select=user_id,course_id,module_number,passed,percentage,attempt_number,created_at&order=created_at.desc&limit=200'),
    adminFetchAll('courses', 'select=id,title,slug,total_modules'),
    adminFetchUsers(),
  ])

  const progress = progressRows || []
  const purchases = allPurchases || []
  const certs = certificates || []
  const quizzes = quizResults || []
  const courseList = courses || []
  const users = authUsers || []

  // Maps
  const courseMap = new Map(courseList.map((c: any) => [c.id, c]))
  const userMap = new Map(users.map((u: any) => [u.id, u.email]))

  // ── KPI STATS ──────────────────────────────────────────────────
  const activeUsersToday = new Set(
    progress.filter((p: any) => isWithinDays(p.last_accessed, 1)).map((p: any) => p.user_id)
  ).size

  const activeUsers7d = new Set(
    progress.filter((p: any) => isWithinDays(p.last_accessed, 7)).map((p: any) => p.user_id)
  ).size

  const activeUsers30d = new Set(
    progress.filter((p: any) => isWithinDays(p.last_accessed, 30)).map((p: any) => p.user_id)
  ).size

  const totalModulesCompleted = progress.reduce(
    (sum: number, p: any) => sum + (p.completed_modules?.length || 0), 0
  )

  const quizzesToday = quizzes.filter((q: any) => isWithinDays(q.created_at, 1)).length
  const quizPassRate = quizzes.length
    ? Math.round((quizzes.filter((q: any) => q.passed).length / quizzes.length) * 100)
    : 0

  const certsThisMonth = certs.filter((c: any) => isWithinDays(c.issued_at, 30)).length

  // ── PER-USER ACTIVITY ──────────────────────────────────────────
  const userActivityMap = new Map<string, {
    userId: string
    email: string
    coursesEnrolled: number
    modulesCompleted: number
    certsEarned: number
    quizzesTaken: number
    lastActive: string | null
    avgProgress: number
  }>()

  // Seed from purchases
  purchases.filter((p: any) => p.status === 'completed').forEach((p: any) => {
    if (!userActivityMap.has(p.user_id)) {
      userActivityMap.set(p.user_id, {
        userId: p.user_id,
        email: userMap.get(p.user_id) || p.user_id.slice(0, 8) + '...',
        coursesEnrolled: 0,
        modulesCompleted: 0,
        certsEarned: 0,
        quizzesTaken: 0,
        lastActive: null,
        avgProgress: 0,
      })
    }
    userActivityMap.get(p.user_id)!.coursesEnrolled++
  })

  // Progress
  const userProgressTotals = new Map<string, number[]>()
  progress.forEach((p: any) => {
    const entry = userActivityMap.get(p.user_id)
    if (entry) {
      entry.modulesCompleted += p.completed_modules?.length || 0
      if (!entry.lastActive || (p.last_accessed && p.last_accessed > entry.lastActive)) {
        entry.lastActive = p.last_accessed
      }
      if (!userProgressTotals.has(p.user_id)) userProgressTotals.set(p.user_id, [])
      userProgressTotals.get(p.user_id)!.push(p.completion_percentage || 0)
    }
  })
  userProgressTotals.forEach((vals, uid) => {
    const entry = userActivityMap.get(uid)
    if (entry) entry.avgProgress = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  })

  // Certs
  certs.forEach((c: any) => {
    const entry = userActivityMap.get(c.user_id)
    if (entry) entry.certsEarned++
  })

  // Quizzes
  quizzes.forEach((q: any) => {
    const entry = userActivityMap.get(q.user_id)
    if (entry) entry.quizzesTaken++
  })

  const userRows = Array.from(userActivityMap.values())
    .sort((a, b) => {
      if (b.lastActive && a.lastActive) return b.lastActive.localeCompare(a.lastActive)
      return b.modulesCompleted - a.modulesCompleted
    })

  // ── COURSE ENGAGEMENT ──────────────────────────────────────────
  const courseEngagement = courseList.map((c: any) => {
    const courseProgress = progress.filter((p: any) => p.course_id === c.id)
    const active7d = courseProgress.filter((p: any) => isWithinDays(p.last_accessed, 7)).length
    const active30d = courseProgress.filter((p: any) => isWithinDays(p.last_accessed, 30)).length
    const enrolled = purchases.filter((p: any) => p.course_id === c.id && p.status === 'completed').length
    const completed = certs.filter((cert: any) => cert.course_id === c.id).length
    const avgPct = courseProgress.length
      ? Math.round(courseProgress.reduce((s: number, p: any) => s + (p.completion_percentage || 0), 0) / courseProgress.length)
      : 0
    return { ...c, active7d, active30d, enrolled, completed, avgPct }
  }).sort((a: any, b: any) => b.active7d - a.active7d)

  const maxEngagement = Math.max(...courseEngagement.map((c: any) => c.active30d), 1)

  // ── MODULE DROP-OFF PER COURSE ─────────────────────────────────
  // Find which module most users stop at (highest module completed by >50% of learners but next not reached)
  const dropoffData = courseList.map((c: any) => {
    const courseProgress = progress.filter((p: any) => p.course_id === c.id && (p.completed_modules?.length || 0) > 0)
    if (courseProgress.length === 0) return { ...c, dropoffModule: null, learners: 0, completionRate: 0 }

    const totalMods = c.total_modules || 1
    const enrolled = purchases.filter((p: any) => p.course_id === c.id && p.status === 'completed').length
    const completedFull = certs.filter((cert: any) => cert.course_id === c.id).length
    const completionRate = enrolled ? Math.round((completedFull / enrolled) * 100) : 0

    // Find module where learners stop: last module most people have completed
    const modCounts: Record<number, number> = {}
    courseProgress.forEach((p: any) => {
      const mods: number[] = p.completed_modules || []
      mods.forEach((m: number) => { modCounts[m] = (modCounts[m] || 0) + 1 })
    })

    // Find the highest module where count drops significantly
    let dropoffModule: number | null = null
    for (let m = 1; m < totalMods; m++) {
      const current = modCounts[m] || 0
      const next = modCounts[m + 1] || 0
      if (current > 0 && next < current * 0.6) {
        dropoffModule = m
        break
      }
    }

    return { ...c, dropoffModule, learners: courseProgress.length, completionRate }
  })

  // ── RECENT QUIZ ACTIVITY ───────────────────────────────────────
  const recentQuizzes = quizzes.slice(0, 20).map((q: any) => ({
    ...q,
    email: userMap.get(q.user_id) || 'Unknown',
    courseTitle: (courseMap.get(q.course_id) as any)?.title || 'Unknown Course',
  }))

  // ── RECENT MODULE COMPLETIONS ──────────────────────────────────
  const recentProgress = progress
    .filter((p: any) => p.last_accessed)
    .sort((a: any, b: any) => (b.last_accessed || '').localeCompare(a.last_accessed || ''))
    .slice(0, 20)
    .map((p: any) => ({
      ...p,
      email: userMap.get(p.user_id) || 'Unknown',
      courseTitle: (courseMap.get(p.course_id) as any)?.title || 'Unknown Course',
    }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Activity</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time engagement across all learners and courses</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active Today', value: activeUsersToday, sub: 'users with activity', color: 'from-orange-500 to-orange-600', light: 'text-orange-100', lighter: 'text-orange-200' },
          { label: 'Active (7 days)', value: activeUsers7d, sub: 'unique learners', color: 'from-indigo-500 to-indigo-600', light: 'text-indigo-100', lighter: 'text-indigo-200' },
          { label: 'Active (30 days)', value: activeUsers30d, sub: 'unique learners', color: 'from-emerald-500 to-emerald-600', light: 'text-emerald-100', lighter: 'text-emerald-200' },
          { label: 'Modules Completed', value: totalModulesCompleted, sub: 'all time', color: 'from-violet-500 to-violet-600', light: 'text-violet-100', lighter: 'text-violet-200' },
        ].map(({ label, value, sub, color, light, lighter }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <p className={`text-xs font-semibold ${light} uppercase tracking-wide`}>{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className={`text-xs ${lighter} mt-1`}>{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Quiz Attempts Today', value: quizzesToday, sub: 'submissions', color: 'from-pink-500 to-pink-600', light: 'text-pink-100', lighter: 'text-pink-200' },
          { label: 'Quiz Pass Rate', value: `${quizPassRate}%`, sub: `${quizzes.length} total attempts`, color: 'from-teal-500 to-teal-600', light: 'text-teal-100', lighter: 'text-teal-200' },
          { label: 'Certs This Month', value: certsThisMonth, sub: 'courses completed', color: 'from-amber-500 to-amber-600', light: 'text-amber-100', lighter: 'text-amber-200' },
          { label: 'Total Certificates', value: certs.length, sub: 'all time', color: 'from-blue-500 to-blue-600', light: 'text-blue-100', lighter: 'text-blue-200' },
        ].map(({ label, value, sub, color, light, lighter }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}>
            <p className={`text-xs font-semibold ${light} uppercase tracking-wide`}>{label}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className={`text-xs ${lighter} mt-1`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Course Engagement — SVG horizontal bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-0.5">Course Engagement (30 days)</h2>
          <p className="text-xs text-gray-400 mb-5">Active learners per course</p>
          {courseEngagement.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <HorizontalBarChart
              items={courseEngagement.map((c: any, i: number) => ({
                label: c.title,
                value: c.active30d,
                max: maxEngagement,
                subLabel: `${c.enrolled} enrolled · avg ${c.avgPct}%`,
                color: ['#FF6F00', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899'][i % 6],
              }))}
              formatValue={(v) => `${v}`}
            />
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-0.5">Course Completion Rate</h2>
          <p className="text-xs text-gray-400 mb-5">% of enrolled learners who earned a certificate</p>
          {courseEngagement.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data</div>
          ) : (
            <HorizontalBarChart
              items={courseEngagement.map((c: any, i: number) => ({
                label: c.title,
                value: c.enrolled > 0 ? Math.round((c.completed / c.enrolled) * 100) : 0,
                max: 100,
                subLabel: `${c.completed} / ${c.enrolled} completed`,
                color: (() => {
                  const rate = c.enrolled > 0 ? (c.completed / c.enrolled) * 100 : 0
                  return rate >= 50 ? '#10b981' : rate >= 25 ? '#f59e0b' : '#ef4444'
                })(),
              }))}
              formatValue={(v) => `${v}%`}
            />
          )}
        </div>
      </div>

      {/* Drop-off Analysis */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Module Drop-off Analysis</h2>
        <p className="text-xs text-gray-400 mb-5">Where learners stop progressing in each course</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dropoffData.map((c: any) => (
            <div key={c.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <p className="text-sm font-bold text-gray-800 mb-3 truncate">{c.title}</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Active learners</span>
                  <span className="font-semibold text-gray-800">{c.learners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Completion rate</span>
                  <span className={`font-semibold ${c.completionRate >= 50 ? 'text-green-600' : c.completionRate >= 25 ? 'text-amber-600' : 'text-red-500'}`}>
                    {c.completionRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Drop-off point</span>
                  <span className={`font-semibold ${c.dropoffModule ? 'text-red-500' : 'text-green-600'}`}>
                    {c.dropoffModule ? `After Module ${c.dropoffModule}` : c.learners === 0 ? 'No data' : 'Good retention'}
                  </span>
                </div>
              </div>
              {/* Progress bar showing completion rate */}
              <div className="mt-3 bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${c.completionRate >= 50 ? 'bg-green-500' : c.completionRate >= 25 ? 'bg-amber-500' : 'bg-red-400'}`}
                  style={{ width: `${c.completionRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Learner Activity</h2>
        <p className="text-xs text-gray-400 mb-5">All enrolled users sorted by most recently active</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2.5 text-xs font-semibold text-gray-500 uppercase pr-4">User</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-500 uppercase px-3">Courses</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-500 uppercase px-3">Modules Done</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-500 uppercase px-3">Avg Progress</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-500 uppercase px-3">Quizzes</th>
                <th className="text-center py-2.5 text-xs font-semibold text-gray-500 uppercase px-3">Certs</th>
                <th className="text-right py-2.5 text-xs font-semibold text-gray-500 uppercase">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {userRows.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-gray-400">No activity data yet</td></tr>
              )}
              {userRows.map((u) => {
                const isActiveToday = isWithinDays(u.lastActive, 1)
                const isActiveWeek = isWithinDays(u.lastActive, 7)
                return (
                  <tr key={u.userId} className="hover:bg-gray-50">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${isActiveToday ? 'bg-green-500' : isActiveWeek ? 'bg-amber-400' : 'bg-gray-300'}`} />
                        <span className="text-gray-800 font-medium text-xs truncate max-w-[180px]">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-600">{u.coursesEnrolled}</td>
                    <td className="py-3 text-center text-gray-600">{u.modulesCompleted}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-[#FF6F00]" style={{ width: `${u.avgProgress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{u.avgProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-center text-gray-600">{u.quizzesTaken}</td>
                    <td className="py-3 text-center">
                      {u.certsEarned > 0
                        ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{u.certsEarned} 🏆</span>
                        : <span className="text-xs text-gray-300">—</span>
                      }
                    </td>
                    <td className="py-3 text-right">
                      {u.lastActive ? (
                        <span className={`text-xs font-medium ${isActiveToday ? 'text-green-600' : isActiveWeek ? 'text-amber-600' : 'text-gray-400'}`}>
                          {timeAgo(u.lastActive)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">Never</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs text-gray-400">Active today</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-xs text-gray-400">Active this week</span></div>
          <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-gray-300" /><span className="text-xs text-gray-400">Inactive</span></div>
        </div>
      </div>

      {/* Recent Activity Feed — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Module Progress */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Learning Activity</h2>
          <div className="space-y-3">
            {recentProgress.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No activity yet</p>}
            {recentProgress.map((p: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-sm shrink-0">📚</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{p.email}</p>
                  <p className="text-xs text-gray-500 truncate">{p.courseTitle} · {p.completion_percentage}% complete</p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{p.last_accessed ? timeAgo(p.last_accessed) : '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Recent Quiz Attempts</h2>
          <div className="space-y-3">
            {recentQuizzes.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No quiz attempts yet</p>}
            {recentQuizzes.map((q: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${q.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                  {q.passed ? '✅' : '❌'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{q.email}</p>
                  <p className="text-xs text-gray-500 truncate">{q.courseTitle} · Module {q.module_number} · {q.percentage}%</p>
                </div>
                <span className={`text-xs font-bold shrink-0 ${q.passed ? 'text-green-600' : 'text-red-500'}`}>
                  {q.passed ? 'Pass' : 'Fail'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
