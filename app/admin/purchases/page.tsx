// app/admin/purchases/page.tsx — All purchases

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminPurchasesPage() {
  const [
    { data: purchases },
    { data: users },
    { data: courses },
  ] = await Promise.all([
    adminFetchAll('purchases', 'select=*&order=purchased_at.desc'),
    adminFetchUsers(),
    adminFetchAll('courses', 'select=id,title'),
  ])

  const userMap: Record<string, string> = {}
  ;(users ?? []).forEach((u: any) => { userMap[u.id] = u.email })

  const courseMap: Record<string, string> = {}
  ;(courses ?? []).forEach((c: any) => { courseMap[c.id] = c.title })

  const totalRevenue = (purchases ?? []).reduce((sum: number, p: any) => sum + (p.amount_paid ?? 0), 0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchases</h1>
          <p className="text-sm text-gray-500 mt-1">{purchases?.length ?? 0} total transactions</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-right">
          <p className="text-xs text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">${(totalRevenue / 100).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Currency</th>
                <th className="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(purchases ?? []).length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No purchases yet</td></tr>
              )}
              {(purchases ?? []).map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(p.purchased_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-3 text-gray-700">
                    {userMap[p.user_id] ?? <span className="text-gray-400 font-mono text-xs">{p.user_id.slice(0,8)}…</span>}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{courseMap[p.course_id] ?? '—'}</td>
                  <td className="px-6 py-3 text-right font-semibold text-green-600">
                    ${(p.amount_paid / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-center text-gray-500 uppercase text-xs">{p.currency}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
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
