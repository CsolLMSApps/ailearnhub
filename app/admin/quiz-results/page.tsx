// app/admin/quiz-results/page.tsx — All quiz attempts

import { adminFetchAll, adminFetchUsers } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export default async function AdminQuizResultsPage() {
  const [
    { data: quizResults },
    { data: users },
    { data: courses },
  ] = await Promise.all([
    adminFetchAll('quiz_results', 'select=*&order=completed_at.desc'),
    adminFetchUsers(),
    adminFetchAll('courses', 'select=id,title'),
  ])

  const userMap: Record<string, string> = {}
  ;(users ?? []).forEach((u: any) => { userMap[u.id] = u.email })

  const courseMap: Record<string, string> = {}
  ;(courses ?? []).forEach((c: any) => { courseMap[c.id] = c.title })

  const total = quizResults?.length ?? 0
  const passed = (quizResults ?? []).filter((r: any) => r.passed).length
  const failed = total - passed
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
  const avgScore = total > 0
    ? Math.round((quizResults ?? []).reduce((sum: number, r: any) => sum + (r.percentage ?? 0), 0) / total)
    : 0

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total attempts</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-gray-900">{total}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Attempts</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-green-600">{passed}</p>
          <p className="text-xs text-gray-500 mt-0.5">Passed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-red-500">{failed}</p>
          <p className="text-xs text-gray-500 mt-0.5">Failed</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-2xl font-bold text-[#FF6F00]">{passRate}%</p>
          <p className="text-xs text-gray-500 mt-0.5">Pass Rate (avg {avgScore}%)</p>
        </div>
      </div>

      {/* Results table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Course</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Score</th>
                <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(quizResults ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No quiz attempts yet</td></tr>
              )}
              {(quizResults ?? []).map((r: any) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                    {r.completed_at
                      ? new Date(r.completed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-3 py-3 text-gray-700">
                    {userMap[r.user_id] ?? (
                      <span className="text-gray-400 font-mono text-xs">{(r.user_id ?? '').slice(0, 8)}…</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-gray-700">{courseMap[r.course_id] ?? '—'}</td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${r.passed ? 'bg-green-500' : 'bg-red-400'}`}
                          style={{ width: `${r.percentage ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">{r.percentage ?? 0}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                      r.passed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {r.passed ? '✓ Passed' : '✗ Failed'}
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
