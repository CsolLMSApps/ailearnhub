// app/admin/users/page.tsx

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'
import { DeleteUserButton, AddUserButton } from '@/components/admin/UserActions'

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

  const userRows = (users ?? []).map((u: any) => {
    const userPurchases = (purchases ?? []).filter((p: any) => p.user_id === u.id)
    const userProgress = (progressData ?? []).filter((p: any) => p.user_id === u.id)
    const totalSpent = userPurchases.reduce((sum: number, p: any) => sum + (p.amount_paid ?? 0), 0)
    const avgProgress = userProgress.length > 0
      ? Math.round(userProgress.reduce((sum: number, p: any) => sum + (p.completion_percentage ?? 0), 0) / userProgress.length)
      : 0
    const certsEarned = userPurchases.filter((p: any) => certSet.has(`${u.id}:${p.course_id}`)).length
    return {
      id: u.id, email: u.email,
      createdAt: u.created_at, lastSignIn: u.last_sign_in_at,
      enrollments: userPurchases.length, totalSpent, avgProgress, certsEarned,
      courseNames: userPurchases.map((p: any) => courseMap[p.course_id]).filter(Boolean),
    }
  }).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const totalRevenue = (purchases ?? []).reduce((s: number, p: any) => s + (p.amount_paid ?? 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-0.5">{userRows.length} registered accounts · ${(totalRevenue / 100).toFixed(2)} total revenue</p>
        </div>
        <AddUserButton />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-[#FF6F00]">{userRows.length}</p>
          <p className="text-xs text-gray-600 mt-0.5">Total Users</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{purchases?.length ?? 0}</p>
          <p className="text-xs text-gray-600 mt-0.5">Total Enrollments</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{(certificates ?? []).length}</p>
          <p className="text-xs text-gray-600 mt-0.5">Certificates Issued</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Joined</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Courses</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Avg Progress</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Certs</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Spent</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userRows.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400">No users yet</td></tr>
              )}
              {userRows.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.email?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{u.email}</div>
                        {u.courseNames.length > 0 && (
                          <div className="text-xs text-gray-400 truncate max-w-[200px]">{u.courseNames.join(', ')}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {u.lastSignIn ? new Date(u.lastSignIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-[#FF6F00] text-xs font-bold">
                      {u.enrollments}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-[#FF6F00] h-1.5 rounded-full" style={{ width: `${u.avgProgress}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 w-8">{u.avgProgress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {u.certsEarned > 0
                      ? <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">🏆 {u.certsEarned}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-green-600 text-sm">
                    {u.totalSpent > 0 ? `$${(u.totalSpent / 100).toFixed(2)}` : <span className="text-gray-300 font-normal">—</span>}
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <DeleteUserButton userId={u.id} email={u.email} />
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
