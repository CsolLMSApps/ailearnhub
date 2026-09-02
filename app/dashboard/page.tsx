// app/dashboard/page.tsx
// User Dashboard - Shows purchased courses and profile

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetchAll } from '@/lib/supabase/admin'
import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { BundleSuccessBanner } from '@/components/BundleSuccessBanner'
import { PurchaseSuccessBanner } from '@/components/PurchaseSuccessBanner'
import SetupNotification from '@/components/dashboard/SetupNotification'
import SignOutButton from '@/components/dashboard/SignOutButton'

// Courses with custom JPG images — keep in sync with courses/page.tsx
const CUSTOM_IMAGE_SLUGS = new Set(['ai-for-beginners', 'chatgpt-mastery', 'ai-tools-productivity', 'email-marketing-ai', 'prompt-engineering-mastery', 'social-media-marketing-ai'])
function courseImageSrc(slug: string) {
  return CUSTOM_IMAGE_SLUGS.has(slug) ? `/images/courses/${slug}.jpg` : `/images/courses/${slug}.svg`
}

// Keep in sync with components/admin/AdminAuthGuard.tsx
const ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ purchase?: string; bundle?: string; course?: string }>
}) {
  const { purchase, bundle, course } = await searchParams
  const showBundleSuccess = purchase === 'success' && bundle === 'true'
  const showCourseSuccess = purchase === 'success' && !bundle && !!course
  const supabase = await createServerSupabaseClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Check if user is an admin (hardcoded super-admins OR dynamic admins in DB)
  const userEmail = user.email?.toLowerCase() ?? ''
  const isSuperAdmin = ADMIN_EMAILS.includes(userEmail)
  let isAdmin = isSuperAdmin
  if (!isAdmin) {
    const { data: adminRows } = await adminFetchAll(
      'admin_users',
      `email=eq.${encodeURIComponent(userEmail)}&select=email`
    )
    isAdmin = adminRows.length > 0
  }

  // Get user's purchased courses
  const { data: purchases } = await supabase
    .from('purchases')
    .select(`
      *,
      courses (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'completed')

  // Get all published courses for recommendations
  const { data: allCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)

  // Filter out already purchased courses
  const purchasedCourseIds = (purchases as any[])?.map((p: any) => p.course_id) || []
  const availableCourses = allCourses?.filter(
    (course: any) => !purchasedCourseIds.includes(course.id)
  ) || []

  // Get user's progress
  const { data: progressData } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)

  // Fetch certificates (bypasses RLS with service role key)
  const { data: certificates } = await adminFetchAll(
    'certificates',
    `user_id=eq.${user.id}&select=course_id`
  )
  const certCourseIds = new Set((certificates || []).map((c: any) => c.course_id))

  // Fetch all passed quiz results for the user (one query for all courses)
  // quiz_results rows are readable by authenticated users for their own data
  const { data: passedQuizzes } = await supabase
    .from('quiz_results')
    .select('course_id')
    .eq('user_id', user.id)
    .eq('passed', true)
  const passedQuizCourseIds = new Set((passedQuizzes || []).map((q: any) => q.course_id))

  // Calculate overall completion
  const totalModulesAcrossAllCourses = (purchases as any[])?.reduce((sum: number, p: any) => {
    return sum + (p.courses?.total_modules || 0)
  }, 0) || 0

  const totalCompletedModules = progressData?.reduce((sum: number, prog: any) => {
    return sum + (prog.completed_modules?.length || 0)
  }, 0) || 0

  const overallCompletion = totalModulesAcrossAllCourses > 0
    ? Math.round((totalCompletedModules / totalModulesAcrossAllCourses) * 100)
    : 0

  const certificatesEarned = certCourseIds.size

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#FF6F00]">AI Learn Hub</span>
              </Link>
              <Link href="/" className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF6F00] transition-colors">
                ← Home
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-[#FF6F00] font-medium border-b-2 border-[#FF6F00] pb-1">
                  Dashboard
                </Link>
                <Link href="/dashboard/bookmarks" className="text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  Bookmarks
                </Link>
                <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                  Browse Courses
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {/* Bell notification — only visible to users who haven't set a password */}
              <SetupNotification
                passwordSet={user.user_metadata?.password_set !== false}
                userEmail={user.email ?? ''}
                userName={user.user_metadata?.full_name ?? ''}
              />
              <Link href="/profile" className="text-right hidden sm:block hover:opacity-75 transition-opacity">
                <div className="text-sm font-medium text-gray-900">{user.user_metadata?.full_name || user.email?.split('@')[0]}</div>
                <div className="text-xs text-[#FF6F00] font-semibold">My Profile →</div>
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-semibold text-white bg-[#FF6F00] hover:bg-[#E65100] px-4 py-2 rounded-lg transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <SignOutButton
                passwordSet={user.user_metadata?.password_set !== false}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Purchase success banners */}
        {showBundleSuccess && <BundleSuccessBanner />}
        {showCourseSuccess && (
          <PurchaseSuccessBanner
            courseName={
              (purchases as any[])?.find((p: any) => p.courses?.slug === course)?.courses?.title
              ?? allCourses?.find((c: any) => c.slug === course)?.title
            }
          />
        )}

        {/* Hero Welcome Banner — Option A */}
        <div
          className="relative rounded-2xl overflow-hidden mb-6 px-8 py-7"
          style={{ background: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)' }}
        >
          {/* Decorative rings */}
          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full border-2 border-white/10 pointer-events-none" />
          <div className="absolute top-4 right-10 w-24 h-24 rounded-full border-2 border-white/10 pointer-events-none" />
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative flex items-center justify-between gap-6">
            {/* Left — welcome text */}
            <div>
              <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">
                Your learning dashboard
              </p>
              <h1 className="text-2xl font-bold text-white mb-1">
                Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
              </h1>
              <p className="text-white/75 text-sm">
                {overallCompletion > 0
                  ? `You're ${overallCompletion}% through your learning journey — keep going!`
                  : 'Start your AI learning journey today.'}
              </p>
            </div>

            {/* Right — big percentage */}
            <div className="shrink-0 text-right hidden sm:block">
              <p className="text-white text-5xl font-bold leading-none">{overallCompletion}%</p>
              <p className="text-white/60 text-xs mt-1">overall progress</p>
              <div className="mt-3 w-28 bg-white/20 rounded-full h-1.5 ml-auto">
                <div
                  className="h-1.5 rounded-full bg-white transition-all duration-500"
                  style={{ width: `${overallCompletion}%` }}
                />
              </div>
              <p className="text-white/60 text-xs mt-1">{totalCompletedModules} / {totalModulesAcrossAllCourses} modules</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">📚</div>
            <div>
              <p className="text-gray-500 text-xs">Enrolled courses</p>
              <p className="text-2xl font-bold text-gray-900">{(purchases as any[])?.length || 0}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">📈</div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs">Overall progress</p>
              <p className="text-2xl font-bold text-[#FF6F00]">{overallCompletion}%</p>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                <div
                  className="h-1.5 rounded-full bg-[#FF6F00]"
                  style={{ width: `${overallCompletion}%` }}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center text-2xl shrink-0">🏆</div>
            <div>
              <p className="text-gray-500 text-xs">Certificates earned</p>
              <p className="text-2xl font-bold text-gray-900">{certificatesEarned}</p>
            </div>
          </div>
        </div>

        {/* My Courses */}
        {purchases && (purchases as any[]).length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(purchases as any[]).map((purchase: any) => {
                const course = purchase.courses
                if (!course) return null
                const progress = progressData?.find((p: any) => p.course_id === course.id)
                const pct = progress?.completion_percentage || 0
                const isComplete = certCourseIds.has(course.id)
                const quizPassed = passedQuizCourseIds.has(course.id)
                // Last module only completes when quiz is passed, so at (N-1)/N modules
                // done the user is ready for the final quiz. E.g. 4/5 = 80%.
                const totalMods = course.total_modules || 0
                const completedCount = totalMods > 0 ? Math.round(pct / 100 * totalMods) : 0
                const quizRequired = completedCount >= totalMods - 1 && totalMods > 0 && !quizPassed && !isComplete

                return (
                  <Link
                    key={purchase.id}
                    href={`/learn/${course.slug}`}
                    className={`bg-white rounded-lg shadow-sm border-2 overflow-hidden hover:shadow-md transition-shadow ${
                      isComplete ? 'border-green-400' : quizRequired ? 'border-amber-400' : 'border-gray-200'
                    }`}
                  >
                    <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] relative overflow-hidden">
                      <Image
                        src={courseImageSrc(course.slug)}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      {/* Status badge on image */}
                      {isComplete && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          🏆 Completed
                        </div>
                      )}
                      {quizRequired && (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          📝 Quiz Required
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {course.short_description}
                      </p>
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">
                            {completedCount} of {totalMods} modules
                          </span>
                          <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-[#FF6F00]'}`}>
                            {isComplete ? '100' : pct}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${isComplete ? 'bg-green-500' : 'bg-[#FF6F00]'}`}
                            style={{ width: `${isComplete ? 100 : pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Final Quiz status row — always visible so users know a quiz exists */}
                      <div className={`flex items-center justify-between text-xs px-3 py-2 rounded-lg mb-3 ${
                        isComplete
                          ? 'bg-green-50 text-green-700'
                          : quizRequired
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-gray-50 text-gray-500'
                      }`}>
                        <span className="font-medium">
                          {isComplete ? '✅ Final Quiz Passed' : '📝 Course Final Quiz'}
                        </span>
                        <span className="font-bold">
                          {isComplete ? 'Passed' : quizRequired ? 'Pending →' : 'Required to complete'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">{course.total_modules} modules</span>
                          <span className="text-xs bg-orange-50 text-[#FF6F00] font-semibold px-2 py-0.5 rounded-full">📋 Templates</span>
                        </div>
                        {isComplete ? (
                          <span className="text-green-600 font-medium">View Certificate →</span>
                        ) : quizRequired ? (
                          <span className="text-amber-600 font-bold">Take Final Quiz →</span>
                        ) : (
                          <span className="text-[#FF6F00] font-medium">Continue →</span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center mb-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No courses yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your learning journey by enrolling in a course
            </p>
            <Link
              href="/courses"
              className="inline-block bg-[#FF6F00] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#E65100] transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}

        {/* ResumeBlast.ai Banner */}
        <section className="mb-12">
          <a
            href="https://www.resumeblast.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f172a] to-[#1e3a5f] p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow">
              {/* Decorative background circles */}
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />

              <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://www.google.com/s2/favicons?domain=resumeblast.ai&sz=64"
                      alt="ResumeBlast.ai"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#FF6F00]">Partner Offer</span>
                      <span className="text-xs bg-green-500 text-white font-bold px-2 py-0.5 rounded-full">Free to Start</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                      Ready to land your next AI job?
                    </h3>
                    <p className="text-sm text-gray-300 max-w-lg">
                      <span className="text-white font-semibold">ResumeBlast.ai</span> sends your résumé directly to 250–500 verified recruiters via AI-powered 3-wave email campaigns — automatically.
                    </p>
                  </div>
                </div>

                <div className="shrink-0 sm:text-right">
                  <div className="inline-flex items-center gap-2 bg-[#FF6F00] group-hover:bg-[#e65c00] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-md whitespace-nowrap">
                    Try Free Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">No credit card required</p>
                </div>
              </div>
            </div>
          </a>
        </section>

        {/* Recommended Courses */}
        {availableCourses.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.slice(0, 3).map((course: any) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] relative overflow-hidden">
                    <Image
                      src={courseImageSrc(course.slug)}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-[#FF6F00]">
                        ${(course.price_usd / 100).toFixed(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {course.short_description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{course.total_modules} modules</span>
                      <span className="text-xs bg-orange-50 text-[#FF6F00] font-semibold px-2 py-0.5 rounded-full">📋 Templates included</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
