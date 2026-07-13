// app/admin/page.tsx — Admin Overview Dashboard

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default async function AdminOverviewPage() {
  const [
    { data: users },
    { data: courses },
    { data: purchases },
    { data: certificates },
    { data: quizResults },
  ] = await Promise.all([
    adminFetchUsers(),
    adminFetchAll('courses', 'select=id,title,slug,price_usd,total_modules&is_published=eq.true'),
    adminFetchAll('purchases', 'select=*,courses(title,slug)&order=purchased_at.desc'),
    adminFetchAll('certificates', 'select=id,student_name,course_title,issued_at'),
    adminFetchAll('quiz_results', 'select=id,passed,percentage,course_id,completed_at'),
  ])

  const totalUsers = users?.length ?? 0
  const totalRevenue = (purchases ?? []).reduce((sum: number, p: any) => sum + (p.amount_paid ?? 0), 0)
  const totalEnrollments = purchases?.length ?? 0
  const totalCerts = certificates?.length ?? 0
  const passedQuizzes = (quizResults ?? []).filter((q: any) => q.passed).length
  const totalQuizzes = quizResults?.length ?? 0
  const passRate = totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0

  const recentPurchases = (purchases ?? []).slice(0, 10)

  // Build user email map
  const userEmailMap: Record<string, string> = {}
  ;(users ?? []).forEach((u: any) => { userEmailMap[u.id] = u.email })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time snapshot of AI Learn Hub</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Users" value={totalUsers} color="text-gray-900" sub="Registered accounts" />
        <StatCard label="Total Revenue" value={`$${(totalRevenue / 100).toFixed(2)}`} color="text-green-600" sub="All time" />
        <StatCard label="Enrollments" value={totalEnrollments} color="text-[#FF6F00]" sub="Completed purchases" />
        <StatCard label="Certificates Issued" value={totalCerts} color="text-purple-600" sub="Courses completed" />
        <StatCard label="Quiz Pass Rate" value={`${passRate}%`} color="text-blue-600" sub={`${passedQuizzes} / ${totalQuizzes} attempts`} />
        <StatCard label="Courses Active" value={courses?.length ?? 0} color="text-gray-900" sub="Published courses" />
      </div>

      {/* Recent Purchases */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">Recent Purchases</h2>
          <a href="/admin/purchases" className="text-xs text-[#FF6F00] hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentPurchases.length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No purchases yet</td></tr>
              )}
              {recentPurchases.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-700">{userEmailMap[p.user_id] ?? p.user_id.slice(0, 8) + '…'}</td>
                  <td className="px-6 py-3 text-gray-700">{p.courses?.title ?? '—'}</td>
                  <td className="px-6 py-3 font-medium text-green-600">${(p.amount_paid / 100).toFixed(2)}</td>
                  <td className="px-6 py-3 text-gray-500">{new Date(p.purchased_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {p.status}
                    </span>
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
