// app/admin/users/page.tsx — All registered users with progress

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  const [
    { data: users },
    { data: purchases },
    { data: progressData },
    { data: certificates },
    { data: courses },
  ] = await Promise.all([
    adminFetchUsers(),
    adminFetchAll('purchases', 'select=user_id,course_id,purchased_at,amount_paid&order=purchased_at.desc'),
    adminFetchAll('progress', 'select=user_id,course_id,completion_percentage,last_accessed'),
    adminFetchAll('certificates', 'select=user_id,course_id'),
    adminFetchAll('courses', 'select=id,title,slug'),
  ])

  const courseMap: Record<string, string> = {}
  ;(courses ?? []).forEach((c: any) => { courseMap[c.id] = c.title })

  const certSet = new Set((certificates ?? []).map((c: any) => `${c.user_id}:${c.course_id}`))

  // Build per-user summary
  const userRows = (users ?? []).map((u: any) => {
    const userPurchases = (purchases ?? []).filter((p: any) => p.user_id === u.id)
    const userProgress = (progressData ?? []).filter((p: any) => p.user_id === u.id)
    const totalSpent = userPurchases.reduce((sum: number, p: any) => sum + (p.amount_paid ?? 0), 0)
    const avgProgress = userProgress.length > 0
      ? Math.round(userProgress.reduce((sum: number, p: any) => sum + (p.completion_percentage ?? 0), 0) / userProgress.length)
      : 0
    const certsEarned = userPurchases.filter((p: any) => certSet.has(`${u.id}:${p.course_id}`)).length

    return {
      id: u.id,
      email: u.email,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
      enrollments: userPurchases.length,
      totalSpent,
      avgProgress,
      certsEarned,
      courses: userPurchases.map((p: any) => courseMap[p.course_id] ?? p.course_id),
    }
  }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{userRows.length} registered accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Courses</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Progress</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Certs</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userRows.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
              )}
              {userRows.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="font-medium text-gray-900">{u.email}</div>
                    {u.courses.length > 0 && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">
                        {u.courses.join(', ')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="font-semibold text-[#FF6F00]">{u.enrollments}</span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#FF6F00] h-1.5 rounded-full"
                          style={{ width: `${u.avgProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{u.avgProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    {u.certsEarned > 0 ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        🏆 {u.certsEarned}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right font-medium text-green-600">
                    {u.totalSpent > 0 ? `$${(u.totalSpent / 100).toFixed(2)}` : '—'}
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
