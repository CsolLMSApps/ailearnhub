// app/dashboard/page.tsx
// User Dashboard - Shows purchased courses and profile

import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-[#FF6F00]">
                AI Learn Hub
              </Link>
            </div>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-[#FF6F00] transition-colors"
              >
                Browse Courses
              </Link>
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-[#FF6F00] transition-colors"
              >
                My Learning
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-sm">
                  <div className="text-gray-900 font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </div>
                  <div className="text-gray-500 text-xs">{user.email}</div>
                </div>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-sm text-gray-700 hover:text-[#FF6F00] transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600">
            Continue your learning journey or explore new courses
          </p>
        </div>

        {/* My Courses Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
          
          {purchases && purchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase: any) => (
                <Link
                  key={purchase.id}
                  href={`/learn/${purchase.course_id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] flex items-center justify-center">
                    <div className="text-white text-6xl">📚</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {purchase.courses?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {purchase.courses?.short_description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {purchase.courses?.total_modules} modules
                      </span>
                      <span className="text-[#FF6F00] font-medium">
                        Continue →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No courses yet
              </h3>
              <p className="text-gray-600 mb-6">
                Start your AI learning journey today!
              </p>
              <Link
                href="/courses"
                className="inline-block bg-[#FF6F00] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#E65100] transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          )}
        </section>

        {/* Recommended Courses Section */}
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
                  <div className="h-48 bg-gradient-to-r from-[#212121] to-[#424242] flex items-center justify-center">
                    <div className="text-white text-6xl">🎓</div>
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
