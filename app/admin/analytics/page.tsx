// app/admin/analytics/page.tsx — Revenue & Enrollment Analytics

import { adminFetchAll } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function monthLabel(key: string) {
  const [y, m] = key.split('-')
  return new Date(Number(y), Number(m) - 1).toLocaleString('en-US', { month: 'short', year: '2-digit' })
}

export default async function AdminAnalyticsPage() {
  const [
    { data: purchases },
    { data: courses },
    { data: progressData },
    { data: certificates },
  ] = await Promise.all([
    adminFetchAll('purchases', 'select=*&order=purchased_at.asc'),
    adminFetchAll('courses', 'select=id,title,slug'),
    adminFetchAll('progress', 'select=course_id,completion_percentage'),
    adminFetchAll('certificates', 'select=course_id,issued_at'),
  ])

  // --- Monthly Revenue ---
  const monthlyMap: Record<string, number> = {}
  const monthlyCount: Record<string, number> = {}
  ;(purchases ?? []).forEach((p: any) => {
    const d = new Date(p.purchased_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthlyMap[key] = (monthlyMap[key] ?? 0) + (p.amount_paid ?? 0)
    monthlyCount[key] = (monthlyCount[key] ?? 0) + 1
  })
  const monthKeys = Object.keys(monthlyMap).sort()
  const maxMonthRevenue = Math.max(...Object.values(monthlyMap), 1)
  const totalRevenue = Object.values(monthlyMap).reduce((a, b) => a + b, 0)

  // --- Course Revenue Breakdown ---
  const courseMap: Record<string, string> = {}
  ;(courses ?? []).forEach((c: any) => { courseMap[c.id] = c.title })

  const courseRevMap: Record<string, number> = {}
  const courseEnrollMap: Record<string, number> = {}
  ;(purchases ?? []).forEach((p: any) => {
    courseRevMap[p.course_id] = (courseRevMap[p.course_id] ?? 0) + (p.amount_paid ?? 0)
    courseEnrollMap[p.course_id] = (courseEnrollMap[p.course_id] ?? 0) + 1
  })
  const courseRevList = Object.entries(courseRevMap)
    .map(([id, rev]) => ({ id, title: courseMap[id] ?? id, rev, enrollments: courseEnrollMap[id] ?? 0 }))
    .sort((a, b) => b.rev - a.rev)
  const maxCourseRev = Math.max(...courseRevList.map(c => c.rev), 1)

  // --- Avg Progress per Course ---
  const courseProgMap: Record<string, number[]> = {}
  ;(progressData ?? []).forEach((p: any) => {
    if (!courseProgMap[p.course_id]) courseProgMap[p.course_id] = []
    courseProgMap[p.course_id].push(p.completion_percentage ?? 0)
  })

  // --- Certs per Course ---
  const courseCertMap: Record<string, number> = {}
  ;(certificates ?? []).forEach((c: any) => {
    courseCertMap[c.course_id] = (courseCertMap[c.course_id] ?? 0) + 1
  })

  // Trend: compare last 2 months
  const lastTwo = monthKeys.slice(-2)
  const prevRev = lastTwo.length === 2 ? (monthlyMap[lastTwo[0]] ?? 0) : 0
  const currRev = lastTwo.length >= 1 ? (monthlyMap[lastTwo[lastTwo.length - 1]] ?? 0) : 0
  const revTrend = prevRev > 0 ? Math.round(((currRev - prevRev) / prevRev) * 100) : 0

  const COLORS = ['#FF6F00', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Revenue Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Full picture of revenue, enrollments, and course performance</p>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold text-orange-100 uppercase tracking-wide">Total Revenue</p>
          <p className="text-2xl font-bold mt-1">${(totalRevenue / 100).toFixed(2)}</p>
          <p className="text-xs text-orange-200 mt-1">All time</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold text-indigo-100 uppercase tracking-wide">Total Sales</p>
          <p className="text-3xl font-bold mt-1">{purchases?.length ?? 0}</p>
          <p className="text-xs text-indigo-200 mt-1">Completed purchases</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
          <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wide">Avg Monthly Revenue</p>
          <p className="text-3xl font-bold mt-1">
            ${monthKeys.length ? ((totalRevenue / 100) / monthKeys.length).toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-emerald-200 mt-1">Per month avg</p>
        </div>
        <div className={`bg-gradient-to-br rounded-2xl p-5 text-white shadow-lg ${revTrend >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'}`}>
          <p className="text-xs font-semibold text-blue-100 uppercase tracking-wide">MoM Growth</p>
          <p className="text-3xl font-bold mt-1">{revTrend >= 0 ? '+' : ''}{revTrend}%</p>
          <p className="text-xs text-blue-200 mt-1">vs previous month</p>
        </div>
      </div>

      {/* Monthly Revenue Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Monthly Revenue</h2>
        <p className="text-xs text-gray-400 mb-6">{monthKeys.length} months of data</p>

        {monthKeys.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No purchase data yet</div>
        ) : (
          <div className="flex items-end gap-3 h-48 overflow-x-auto pb-2">
            {monthKeys.map((key) => {
              const rev = monthlyMap[key]
              const count = monthlyCount[key]
              const heightPct = Math.max(4, Math.round((rev / maxMonthRevenue) * 100))
              return (
                <div key={key} className="flex flex-col items-center gap-1 min-w-[48px] group">
                  <div className="relative w-full flex flex-col items-center">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      ${(rev / 100).toFixed(0)} · {count} sale{count !== 1 ? 's' : ''}
                    </div>
                    <div
                      className="w-10 rounded-t-lg bg-gradient-to-t from-orange-500 to-orange-400 transition-all hover:from-orange-600 hover:to-orange-500 cursor-default"
                      style={{ height: `${heightPct * 1.7}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{monthLabel(key)}</span>
                  <span className="text-[10px] font-bold text-gray-700">${(rev / 100).toFixed(0)}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Course Revenue Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Revenue by Course</h2>
        <p className="text-xs text-gray-400 mb-6">Which courses drive the most revenue</p>

        {courseRevList.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">No data yet</div>
        ) : (
          <div className="space-y-4">
            {courseRevList.map((course, i) => {
              const widthPct = Math.round((course.rev / maxCourseRev) * 100)
              const avgProg = courseProgMap[course.id]
                ? Math.round(courseProgMap[course.id].reduce((a: number, b: number) => a + b, 0) / courseProgMap[course.id].length)
                : 0
              const certs = courseCertMap[course.id] ?? 0
              const color = COLORS[i % COLORS.length]
              return (
                <div key={course.id} className="flex items-center gap-4">
                  <div className="w-40 shrink-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{course.title}</p>
                    <p className="text-xs text-gray-400">{course.enrollments} enrolled · {certs} certs</p>
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{ width: `${widthPct}%`, backgroundColor: color }}
                    />
                  </div>
                  <div className="w-20 text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900">${(course.rev / 100).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">avg {avgProg}% done</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Enrollment Timeline Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Month</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Sales</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Avg/Sale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monthKeys.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-400">No data yet</td></tr>
              )}
              {[...monthKeys].reverse().map((key) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="py-2.5 font-medium text-gray-800">{monthLabel(key)}</td>
                  <td className="py-2.5 text-right text-gray-600">{monthlyCount[key]}</td>
                  <td className="py-2.5 text-right font-semibold text-green-600">${(monthlyMap[key] / 100).toFixed(2)}</td>
                  <td className="py-2.5 text-right text-gray-500">
                    ${monthlyCount[key] ? ((monthlyMap[key] / 100) / monthlyCount[key]).toFixed(2) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
