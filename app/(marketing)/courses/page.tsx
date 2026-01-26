// app/(marketing)/courses/page.tsx
// Courses listing page with custom SVG icons

import Link from 'next/link'
import Image from 'next/image'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  // If user is logged in AND has email, use authenticated layout
  if (user && user.email) {
    return (
      <AuthenticatedLayout user={{ email: user.email, user_metadata: user.user_metadata }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Our Courses
            </h1>
            <p className="text-gray-600">
              Expand your skills with our comprehensive AI courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses?.map((course) => (
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
      </AuthenticatedLayout>
    )
  }

  // Anonymous user - NO HEADER HERE! Marketing layout provides it
  // Just render hero section + content
  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Master AI Skills with Expert-Led Courses
          </h1>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Learn from industry professionals and advance your career
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses?.map((course) => (
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
    </>
  )
}
