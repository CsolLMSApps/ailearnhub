// app/(marketing)/courses/page.tsx
// Courses listing page - adapts for logged-in users

import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient()
  
  // Check if user is logged in
  const { data: { user } } = await supabase.auth.getUser()

  // Get all published courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Different for logged in vs logged out */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold text-[#FF6F00]">
              AI Learn Hub
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/courses" 
                className="text-gray-700 hover:text-[#FF6F00] transition-colors"
              >
                Courses
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-700 hover:text-[#FF6F00] transition-colors"
              >
                Pricing
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-700 hover:text-[#FF6F00] transition-colors"
                  >
                    My Learning
                  </Link>
                  <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                    <span className="text-sm text-gray-700">
                      {user.email}
                    </span>
                    <form action="/auth/signout" method="post">
                      <button
                        type="submit"
                        className="text-sm bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-[#E65100] transition-colors"
                      >
                        Logout
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/login"
                    className="text-gray-700 hover:text-[#FF6F00] transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/auth/signup"
                    className="bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-[#E65100] transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - NO HERO for logged-in users */}
      {!user && (
        <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Master AI Skills with Expert-Led Courses
            </h1>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Learn from industry professionals and advance your career with practical AI knowledge
            </p>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {user && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Our Courses
            </h1>
            <p className="text-gray-600">
              Expand your skills with our comprehensive AI courses
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gradient-to-r from-[#FF6F00] to-[#E65100] flex items-center justify-center">
                <div className="text-white text-6xl">🎓</div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#FF6F00]">
                    ${(course.price_usd / 100).toFixed(0)}
                  </span>
                  <span className="text-xs text-gray-500 uppercase px-3 py-1 bg-gray-100 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.short_description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>{course.total_modules} modules</span>
                  <span>{course.total_hours} hours</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#212121] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#FF6F00]">AI Learn Hub</h3>
              <p className="text-gray-400 text-sm">
                Master AI skills with practical, hands-on courses.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Courses</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/courses" className="hover:text-[#FF6F00]">Browse All</Link></li>
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
