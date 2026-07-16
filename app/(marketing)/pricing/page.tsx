import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import BundleCheckoutButton from '@/components/course/BundleCheckoutButton'

const CHECK = (
  <svg className="w-5 h-5 text-[#FF6F00] shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

const CHECK_WHITE = (
  <svg className="w-4 h-4 text-white shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
)

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true })

  // Fetch user's existing purchases to calculate upgrade price
  let alreadyPaidCents = 0
  let ownedCourseCount = 0
  let ownedCourseIds: string[] = []

  if (user) {
    const { data: purchases } = await supabase
      .from('purchases')
      .select('amount_paid, course_id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
    if (purchases) {
      ownedCourseCount = purchases.length
      alreadyPaidCents = purchases.reduce((sum, p) => sum + (p.amount_paid ?? 0), 0)
      ownedCourseIds = purchases.map((p: any) => p.course_id)
    }
  }

  const BUNDLE_PRICE_CENTS = 9900
  const upgradePriceCents = Math.max(0, BUNDLE_PRICE_CENTS - alreadyPaidCents)
  const totalCourses = courses?.length ?? 6
  const alreadyOwnsAll = ownedCourseCount >= totalCourses

  const totalModules = courses?.reduce((s, c) => s + (c.total_modules ?? 0), 0) ?? 34
  const totalHours   = courses?.reduce((s, c) => s + (c.total_hours ?? 0), 0) ?? 16

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
              ← Back to Home
            </Link>
          </div>

          <span className="inline-block bg-orange-100 text-[#FF6F00] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Best Value
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Complete AI Mastery Bundle
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto">
            Get all {totalCourses} AI courses in one plan — {totalModules} modules, {totalHours} hours of content, and {totalCourses} certificates. Everything you need to master AI.
          </p>

          {/* Price block */}
          <div className="inline-block bg-gray-50 border border-gray-200 rounded-2xl px-10 py-6 mb-6">
            {alreadyOwnsAll ? (
              <p className="text-2xl font-bold text-green-600">🎉 You already own all courses!</p>
            ) : ownedCourseCount > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-1">Your upgrade price</p>
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-xl text-gray-400 line-through">${(BUNDLE_PRICE_CENTS / 100).toFixed(0)}</span>
                  <span className="text-5xl font-black text-[#FF6F00]">${(upgradePriceCents / 100).toFixed(0)}</span>
                  <span className="text-gray-400 text-sm">USD</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  You've already paid <strong>${(alreadyPaidCents / 100).toFixed(0)}</strong> for {ownedCourseCount} course{ownedCourseCount > 1 ? 's' : ''} — deducted from bundle price
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-1">One-time payment · Lifetime access</p>
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-xl text-gray-400 line-through">$133</span>
                  <span className="text-5xl font-black text-[#FF6F00]">$99</span>
                  <span className="text-gray-400 text-sm">USD</span>
                </div>
                <p className="text-sm text-green-600 font-semibold mt-2">You save $34 compared to buying individually</p>
              </>
            )}
          </div>

          {/* CTA */}
          {!alreadyOwnsAll && (
            <div className="flex flex-col items-center gap-2">
              <BundleCheckoutButton
                upgradePriceCents={upgradePriceCents}
                ownedCourseCount={ownedCourseCount}
              />
              <p className="text-xs text-gray-400 mt-1">Secure checkout via Stripe · No subscription · Cancel anytime</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">{CHECK_WHITE && <svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>} Lifetime access</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {totalCourses} certificates</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Instant access</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> 30-day guarantee</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* ── What's included ── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">What's included in the bundle</h2>
          <p className="text-gray-500 mb-6">All {totalCourses} courses below are unlocked instantly after purchase</p>

          <div className="space-y-3">
            {courses?.map((course, i) => {
              const owned = ownedCourseIds.includes(course.id)
              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${owned ? 'border-green-200 bg-green-50/40' : 'border-gray-200'}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Number */}
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FF6F00] font-black text-sm flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{course.title}</h3>
                        {owned && (
                          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✓ Owned</span>
                        )}
                        {course.featured && !owned && (
                          <span className="text-xs font-semibold bg-orange-100 text-[#FF6F00] px-2 py-0.5 rounded-full">Popular</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{course.short_description}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 shrink-0 pl-13 sm:pl-0">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800">{course.total_modules}</p>
                      <p className="text-xs text-gray-400">modules</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800">{course.total_hours}h</p>
                      <p className="text-xs text-gray-400">content</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-800 capitalize">{course.level}</p>
                      <p className="text-xs text-gray-400">level</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-500 line-through">${(course.price_usd / 100).toFixed(0)}</p>
                      <p className="text-xs text-gray-400">included</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Totals row */}
          <div className="mt-4 bg-gray-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="font-bold">Complete Bundle — All {totalCourses} Courses</p>
                <p className="text-sm text-gray-400">{totalModules} modules · {totalHours} hours · {totalCourses} certificates</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm text-gray-400 line-through">$133 if bought separately</p>
              <p className="text-2xl font-black text-[#FF6F00]">$99 bundle price</p>
            </div>
          </div>
        </section>

        {/* ── Everything you get ── */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Everything included with the bundle</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              `All ${totalCourses} AI courses — instant access`,
              `${totalModules} comprehensive learning modules`,
              `${totalHours} hours of expert-led content`,
              `${totalCourses} certificates of completion`,
              'Lifetime access — no expiry',
              'Final quiz for each course',
              'Progress tracking dashboard',
              'New course updates included',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                {CHECK}
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        {!alreadyOwnsAll && (
          <section className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              {ownedCourseCount > 0 ? `Unlock the remaining ${totalCourses - ownedCourseCount} courses` : 'Start learning today'}
            </h2>
            <p className="text-white/80 mb-6 text-sm">
              {ownedCourseCount > 0
                ? `Pay just $${(upgradePriceCents / 100).toFixed(0)} to complete your bundle — already saved $${(alreadyPaidCents / 100).toFixed(0)}`
                : 'One payment. Lifetime access to everything.'}
            </p>
            <BundleCheckoutButton
              upgradePriceCents={upgradePriceCents}
              ownedCourseCount={ownedCourseCount}
            />
            <p className="text-xs text-white/60 mt-4">Secure checkout via Stripe · Instant access after payment</p>
          </section>
        )}

        {/* ── FAQ ── */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do I get all courses immediately after purchase?',
                a: 'Yes — all courses unlock instantly in your dashboard the moment your payment is confirmed.',
              },
              {
                q: 'I already bought one course. Can I still get the bundle?',
                a: `Absolutely. The price is automatically adjusted — what you've already paid is deducted from the $99 bundle price. You only pay for what you don't own yet.`,
              },
              {
                q: 'Is this a subscription or a one-time payment?',
                a: 'One-time payment. You pay once and have lifetime access — no monthly fees, no renewals.',
              },
              {
                q: 'Do I get a certificate for each course?',
                a: 'Yes — you earn a separate certificate for every course after passing the final quiz.',
              },
              {
                q: 'Do I need prior experience with AI?',
                a: 'No. The bundle includes beginner to intermediate courses. Most courses start from zero knowledge.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-1">{q}</h3>
                <p className="text-gray-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
