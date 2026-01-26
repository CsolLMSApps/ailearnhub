// app/dashboard/page.tsx
// User Dashboard - Shows purchased courses and profile

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/login')
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
  const purchasedCourseIds = purchases?.map(p => p.course_id) || []
  const availableCourses = allCourses?.filter(
    course => !purchasedCourseIds.includes(course.id)
  ) || []

  // Get user's progress
  const { data: progressData } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user.id)

  // Calculate overall completion
  const totalModulesAcrossAllCourses = purchases?.reduce((sum: number, p: any) => {
    return sum + (p.courses?.total_modules || 0)
  }, 0) || 0

  const totalCompletedModules = progressData?.reduce((sum: number, prog: any) => {
    return sum + (prog.completed_modules?.length || 0)
  }, 0) || 0

  const overallCompletion = totalModulesAcrossAllCourses > 0 
    ? Math.round((totalCompletedModules / totalModulesAcrossAllCourses) * 100)
    : 0

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
              <nav className="hidden md:flex gap-6">
                <Link href="/dashboard" className="text-[#FF6F00] font-medium border-b-2 border-[#FF6F00] pb-1">
                  Dashboard
                </Link>
                <Link href="/courses" className="text-gray-600 hover:text-gray-900">
                  Browse Courses
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
              <Link
                href="/auth/signout"
                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back{user.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900">{purchases?.length || 0}</p>
              </div>
              <div className="text-4xl">📚</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Overall Progress</p>
                <p className="text-3xl font-bold text-[#FF6F00]">{overallCompletion}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Modules Completed</p>
                <p className="text-3xl font-bold text-gray-900">{totalCompletedModules}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        {purchases && purchases.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              My Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase: any) => {
                const course = purchase.courses
                const progress = progressData?.find((p: any) => p.course_id === course.id)
                
                return (
                  <Link
                    key={purchase.id}
                    href={`/learn/${course.slug}/module/1`}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] flex items-center justify-center relative">
                      <Image
                        src={`/images/courses/${course.slug}.svg`}
                        alt={course.title}
                        width={200}
                        height={200}
                        className="w-32 h-32"
                      />
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
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-[#FF6F00]">
                            {progress?.completion_percentage || 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FF6F00] h-2 rounded-full transition-all"
                            style={{ width: `${progress?.completion_percentage || 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                        <span>{course.total_modules} modules</span>
                        <span className="text-[#FF6F00] font-medium">Continue →</span>
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
                  <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] flex items-center justify-center relative">
                    <Image
                      src={`/images/courses/${course.slug}.svg`}
                      alt={course.title}
                      width={200}
                      height={200}
                      className="w-32 h-32"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-[#FF6F00]">
                        ${(course.price_usd / 100).toFixed(0)}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">
                        {course.level}
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
                      <span>{course.total_hours} hours</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#212121] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#FF6F00]">AI Learn Hub</h3>
              <p className="text-gray-400 text-sm">
                Master AI skills with practical, hands-on courses designed for professionals.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/courses" className="hover:text-[#FF6F00]">Browse All</Link></li>
                <li><Link href="/courses" className="hover:text-[#FF6F00]">Beginner</Link></li>
                <li><Link href="/courses" className="hover:text-[#FF6F00]">Advanced</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-[#FF6F00]">About</Link></li>
                <li><Link href="/terms" className="hover:text-[#FF6F00]">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-[#FF6F00]">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@ailearnhub.io" className="hover:text-[#FF6F00]">Contact</a></li>
                <li><Link href="/refund-policy" className="hover:text-[#FF6F00]">Refunds</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 AI Learn Hub LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
