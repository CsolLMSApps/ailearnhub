// app/profile/page.tsx
// User profile — edit name, change password, purchase history, danger zone.

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetchAll } from '@/lib/supabase/admin'
import EditProfileForm from '@/components/profile/EditProfileForm'
import ChangePasswordForm from '@/components/profile/ChangePasswordForm'
import DeleteAccountButton from '@/components/profile/DeleteAccountButton'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Purchases — use adminFetchAll (service role) to bypass any RLS differences between routes
  const { data: rawPurchases } = await adminFetchAll(
    'purchases',
    `user_id=eq.${user.id}&status=eq.completed&select=id,created_at,course_id&order=created_at.desc`
  )
  const purchases = rawPurchases || []

  // Fetch course details for each purchase
  let courseMap: Map<string, any> = new Map()
  if (purchases.length > 0) {
    const courseIds = [...new Set(purchases.map((p: any) => p.course_id))].join(',')
    const { data: courses } = await adminFetchAll(
      'courses',
      `id=in.(${courseIds})&select=id,title,slug,price_usd`
    )
    courseMap = new Map((courses || []).map((c: any) => [c.id, c]))
  }

  // Certificates
  const { data: certificates } = await adminFetchAll(
    'certificates',
    `user_id=eq.${user.id}&select=course_id,certificate_number,issued_at,created_at`
  )
  const certMap = new Map((certificates || []).map((c: any) => [c.course_id, c]))

  // Progress stats
  const { data: progressRows } = await supabase
    .from('progress')
    .select('completed_modules')
    .eq('user_id', user.id)

  const totalModulesDone = (progressRows || []).reduce(
    (sum, p) => sum + (p.completed_modules?.length || 0), 0
  )

  const fullName = (user.user_metadata?.full_name || user.user_metadata?.name || '').trim()
  const email = user.email || ''

  // Avatar initials
  const initials = fullName
    ? fullName.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
    : email.slice(0, 2).toUpperCase()

  const totalCourses = purchases.length
  const totalCerts = certMap.size

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Hero banner ── */}
      <div
        className="relative overflow-hidden px-6 py-10"
        style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/[0.07] pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/[0.06] pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition-colors">
            ← Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-white/20 border-4 border-white/40 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
              {initials}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">{fullName || 'My Profile'}</h1>
              <p className="text-white/70 text-sm mt-0.5">{email}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full">
                🎓 Active Learner
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            {[
              { n: totalCourses, label: 'Courses' },
              { n: totalCerts, label: 'Certificates' },
              { n: totalModulesDone, label: 'Modules Done' },
            ].map(({ n, label }) => (
              <div key={label} className="bg-white/10 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-extrabold text-white">{n}</div>
                <div className="text-white/60 text-[10px] uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Edit Profile + Change Password — 2 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Edit Profile */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span>✏️</span> Edit Profile
            </h2>
            <EditProfileForm initialName={fullName} />
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="text"
                value={email}
                disabled
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-400 bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span>🔒</span> Change Password
            </h2>
            <ChangePasswordForm email={email} />
          </div>
        </div>

        {/* Purchase History */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span>🧾</span> Purchase History
          </h2>

          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No purchases yet.</p>
              <Link href="/courses" className="text-[#FF6F00] hover:text-[#E65100] text-sm font-semibold mt-2 inline-block">
                Browse Courses →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {(purchases as any[]).map((purchase) => {
                const course = courseMap.get(purchase.course_id)
                const cert = certMap.get(purchase.course_id)
                const purchaseDate = new Date(purchase.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric',
                })
                const price = course ? `$${(course.price_usd / 100).toFixed(0)}` : ''

                return (
                  <div key={purchase.id} className="flex items-center gap-4 py-4">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6F00] to-[#E65100] flex items-center justify-center text-white text-lg flex-shrink-0">
                      🎓
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {course?.title || 'Course'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {purchaseDate} · {price}
                      </p>
                    </div>

                    {/* Status badge */}
                    {cert ? (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-700 flex-shrink-0">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-[#FF6F00] flex-shrink-0">
                        In Progress
                      </span>
                    )}

                    {/* Certificate link */}
                    {cert && course ? (
                      <Link
                        href={`/learn/${course.slug}/certificate`}
                        className="text-xs text-[#FF6F00] hover:text-[#E65100] font-semibold flex-shrink-0"
                      >
                        View Certificate →
                      </Link>
                    ) : (
                      <span className="text-xs text-gray-300 flex-shrink-0">—</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
            <span>⚠️</span> Danger Zone
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Permanently deletes your account, all progress, and certificates. This cannot be undone.
          </p>
          <DeleteAccountButton />
        </div>

      </div>
    </div>
  )
}
