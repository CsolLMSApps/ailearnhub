// app/thank-you/page.tsx
//
// Shown right after a successful payment, before the buyer continues on to
// their dashboard. Both flows land here now:
//   - Logged-in buyer: Stripe's success_url points straight here
//     (app/api/stripe/checkout/route.ts).
//   - Guest buyer: Stripe → /api/auth/purchase-complete (account created) →
//     /auth/post-purchase (signed in) → here.
// Either way, by the time this page renders the visitor is authenticated —
// neither flow reaches this page without a completed sign-in first.
//
// The "Continue to Dashboard" button below goes to the exact same
// /dashboard?purchase=success... URL this page used to redirect to
// directly, so the existing dashboard banners (PurchaseSuccessBanner /
// BundleSuccessBanner) behave exactly as before — this page is purely an
// extra stop in between, nothing downstream changed.

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const CHECK = (
  <svg className="w-3.5 h-3.5 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l5 5L19 7" />
  </svg>
)

const CHECK_WHITE = (
  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l5 5L19 7" />
  </svg>
)

// Kept in sync with the same constant in app/api/stripe/checkout/route.ts
// and app/(marketing)/pricing/page.tsx — the bundle is always a flat $99.
const BUNDLE_PRICE_CENTS = 9900

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string; bundle?: string }>
}) {
  const { course: slug, bundle } = await searchParams
  const isBundle = bundle === 'true'

  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  const purchaseDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // ── Bundle purchase ───────────────────────────────────────────────────────
  if (isBundle) {
    const { data: courses } = await supabase
      .from('courses')
      .select('id, title, price_usd')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    const totalIndividual = (courses ?? []).reduce((sum: number, c: any) => sum + (c.price_usd ?? 0), 0)
    const savings = Math.max(totalIndividual - BUNDLE_PRICE_CENTS, 0)

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="px-6 sm:px-14 py-7">
          <Link href="/" className="text-2xl font-bold text-[#FF6F00]">AI Learn Hub</Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 pb-14">
          <div className="w-full max-w-5xl grid md:grid-cols-2 border border-gray-200 rounded-[26px] overflow-hidden shadow-[0_30px_60px_-24px_rgba(33,33,33,0.16)]">

            {/* Left — celebration */}
            <div
              className="p-11 sm:p-14 flex flex-col justify-center relative overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #FF6F00 0%, #E65100 100%)' }}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-6">
                {CHECK_WHITE}
              </div>
              <h1 className="text-3xl font-black text-white mb-3 leading-tight">
                All {courses?.length ?? 6} courses unlocked!
              </h1>
              <p className="text-white/90 text-[15px] leading-relaxed mb-8 max-w-sm">
                You now have lifetime access to the entire AI Learn Hub catalog
                {savings > 0 ? ` — you saved $${(savings / 100).toFixed(0)} versus buying each course separately.` : '.'}
              </p>
              <Link
                href="/dashboard?purchase=success&bundle=true"
                className="inline-block bg-white text-[#FF6F00] font-extrabold text-[15px] px-7 py-3.5 rounded-xl w-fit hover:bg-gray-50 transition-colors"
              >
                Continue to Dashboard →
              </Link>
            </div>

            {/* Right — receipt */}
            <div className="bg-[#FAFAF9] p-10 sm:p-11">
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider mb-5">
                Order summary
              </h2>

              <div className="flex flex-col gap-3 mb-5">
                {(courses ?? []).map((c: any) => (
                  <div key={c.id} className="flex items-center gap-3">
                    {CHECK}
                    <span className="text-sm text-gray-700">{c.title}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 my-4" />

              {savings > 0 && (
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-sm text-gray-500">Complete Bundle</span>
                  <span className="text-sm text-gray-500 line-through">${(totalIndividual / 100).toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total paid</span>
                <span className="text-2xl font-black text-gray-900">${(BUNDLE_PRICE_CENTS / 100).toFixed(0)}</span>
              </div>

              <p className="text-xs text-gray-400 mt-5 pt-4 border-t border-dashed border-gray-300">
                Purchased {purchaseDate} · A receipt was emailed to you.
              </p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // ── Single-course purchase ──────────────────────────────────────────────────
  if (slug) {
    const { data: purchasedCourse } = await supabase
      .from('courses')
      .select('title, total_modules, price_usd')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    // Shouldn't happen in practice (slug comes straight from our own checkout
    // route), but fall through to the dashboard rather than show a broken page.
    if (!purchasedCourse) {
      redirect(`/dashboard?purchase=success&course=${slug}`)
    }

    return (
      <div className="min-h-screen bg-white">
        <div
          className="relative overflow-hidden px-6 sm:px-14 pt-7 pb-16"
          style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative">
            <Link href="/" className="text-lg font-bold text-white">AI Learn Hub</Link>
          </div>

          <div className="relative max-w-xl mx-auto mt-10 text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-5">
              {CHECK_WHITE}
            </div>
            <p className="text-xs font-bold tracking-[3px] uppercase text-white/75 mb-2.5">Payment successful</p>
            <h1 className="text-3xl font-black text-white mb-3 leading-tight">
              Welcome to {purchasedCourse.title}
            </h1>
            <p className="text-white/85">Lifetime access unlocked — let's get started.</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-8 -mt-10 pb-16 relative">
          <div className="flex flex-col md:flex-row gap-6">

            <div className="md:flex-[1.4] min-w-0 bg-white border border-gray-200 rounded-[22px] shadow-[0_24px_48px_-24px_rgba(33,33,33,0.18)] p-8">
              <h2 className="text-base font-extrabold text-gray-900 mb-4">What you get</h2>
              <ul className="flex flex-col gap-3.5">
                <li className="flex items-center gap-3">
                  <span className="w-[26px] h-[26px] rounded-full bg-[#FFF1E3] flex items-center justify-center shrink-0">{CHECK}</span>
                  <span className="text-sm text-gray-700">
                    {purchasedCourse.total_modules ?? 0} structured modules, start to finish
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-[26px] h-[26px] rounded-full bg-[#FFF1E3] flex items-center justify-center shrink-0">{CHECK}</span>
                  <span className="text-sm text-gray-700">Certificate of completion</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-[26px] h-[26px] rounded-full bg-[#FFF1E3] flex items-center justify-center shrink-0">{CHECK}</span>
                  <span className="text-sm text-gray-700">Lifetime access, no subscription</span>
                </li>
              </ul>
            </div>

            <div className="md:flex-1 min-w-0 bg-[#FAFAF9] border border-gray-200 rounded-[22px] p-7">
              <h2 className="text-base font-extrabold text-gray-900 mb-4">Receipt</h2>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 shrink-0">Course</span>
                  <span className="text-gray-900 font-semibold text-right">{purchasedCourse.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="text-gray-900 font-semibold">{purchaseDate}</span>
                </div>
                <div className="border-t border-gray-200 my-1" />
                <div className="flex justify-between">
                  <span className="text-gray-900 font-bold">Total paid</span>
                  <span className="text-gray-900 font-extrabold text-base">
                    ${(purchasedCourse.price_usd / 100).toFixed(0)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">A copy of this receipt was emailed to you.</p>
            </div>
          </div>

          <div className="text-center mt-9">
            <Link
              href={`/dashboard?purchase=success&course=${slug}`}
              className="inline-block min-w-[320px] bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold text-base px-10 py-4 rounded-2xl transition-colors"
            >
              Continue to Dashboard →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // No course/bundle context (shouldn't happen via the normal flow) — go
  // straight to the dashboard rather than show an empty page.
  redirect('/dashboard')
}
