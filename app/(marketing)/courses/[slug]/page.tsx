import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()
  
  // Fetch course by slug
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()
  
  if (error || !course) {
    notFound()
  }

  // Fetch course modules (if they exist)
  const { data: modules } = await supabase
    .from('course_modules')
    .select('*')
    .eq('course_id', course.id)
    .order('module_number', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 opacity-95">{course.short_description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  <span>{course.total_modules} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{course.total_hours} Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span className="capitalize">{course.level}</span>
                </div>
              </div>
            </div>

            {/* Price Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 h-fit">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2">
                  ${(course.price_usd / 100).toFixed(0)}
                </div>
                <div className="text-sm opacity-90">One-time payment</div>
              </div>

              <button className="w-full bg-white text-[#FF6F00] font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition-colors mb-4 text-lg">
                Enroll Now
              </button>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Templates & resources</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Description */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                About This Course
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {course.long_description}
                </p>
              </div>
            </div>

            {/* Curriculum */}
            {modules && modules.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Course Curriculum
                </h2>
                <div className="space-y-4">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className="border-2 border-gray-200 rounded-lg p-5 hover:border-[#FF6F00] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-[#FF6F00] text-white text-xs font-bold px-2 py-1 rounded">
                              Module {module.module_number}
                            </span>
                            <span className="text-sm text-gray-500">
                              {module.estimated_minutes} minutes
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-gray-600 text-sm">
                              {module.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Course Curriculum
                </h2>
                <p className="text-gray-600">
                  {course.total_modules} comprehensive modules covering all aspects of {course.title}.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sticky Enroll Card */}
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-[#FF6F00] mb-1">
                  ${(course.price_usd / 100).toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">One-time payment</div>
              </div>

              <button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold py-3 px-6 rounded-lg transition-colors mb-6">
                Enroll Now
              </button>

              <div className="border-t pt-6 space-y-3 text-sm text-gray-700">
                <h3 className="font-bold text-base mb-3">This course includes:</h3>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#FF6F00] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{course.total_hours} hours on-demand content</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#FF6F00] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Downloadable resources</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#FF6F00] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#FF6F00] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Access on mobile and desktop</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#FF6F00] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-[#FF6F00] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Optional: Generate static params for better performance
export async function generateStaticParams() {
  const supabase = await createServerSupabaseClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('slug')
    .eq('is_published', true)
  
  return courses?.map((course) => ({
    slug: course.slug,
  })) || []
}
