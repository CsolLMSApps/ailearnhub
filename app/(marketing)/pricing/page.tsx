import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import BundleCheckoutButton from '@/components/course/BundleCheckoutButton'

export default async function PricingPage() {
  const supabase = await createServerSupabaseClient()
  
  // Fetch all published courses from database
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('Error fetching courses:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">← Back to Home</Link>
        </div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-xl text-gray-600">
            Professional AI courses at accessible prices
          </p>
          <p className="text-lg text-gray-500 mt-2">
            All courses include lifetime access • Certificate • 30-day guarantee
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {courses?.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-[#FF6F00]"
            >
              {/* Featured Badge */}
              {course.featured && (
                <div className="bg-[#FF6F00] text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  POPULAR
                </div>
              )}

              {/* Course Title */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {course.short_description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#FF6F00]">
                    ${(course.price_usd / 100).toFixed(0)}
                  </span>
                  <span className="text-gray-500 text-sm">USD</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{course.total_modules} Comprehensive Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{course.total_hours} Hours of Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="capitalize">{course.level} Level</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#FF6F00]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Lifetime Access</span>
                </div>
              </div>

              {/* CTA Button */}
              <a
                href={`/courses/${course.slug}`}
                className="block w-full bg-[#FF6F00] hover:bg-[#E65100] text-white font-semibold py-3 px-4 rounded-lg text-center transition-colors"
              >
                View Course
              </a>
            </div>
          ))}
        </div>

        {/* Bundle Option */}
        <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] rounded-lg p-8 text-white shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">🎓 Complete AI Mastery Bundle</h2>
            <p className="text-xl mb-6">Get all 6 courses and save $34</p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-2xl line-through opacity-75">$133</div>
              <div className="text-6xl font-bold">$99</div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6 text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>34 Modules • 16 Hours • All Certificates</span>
            </div>
            <BundleCheckoutButton />
            <p className="text-sm mt-4 opacity-90">Limited time offer • Lifetime access</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">What's included in each course?</h3>
              <p className="text-gray-600">
                Each course includes structured learning modules, quizzes, and a certificate of completion. You get lifetime access to all content.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">What if I'm not satisfied?</h3>
              <p className="text-gray-600">
                If you have any concerns about your purchase, please contact our support team and we'll do our best to help.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">Do I need prior experience?</h3>
              <p className="text-gray-600">
                Our courses range from beginner to intermediate levels. Check each course description 
                for specific prerequisites. Most courses are designed for beginners.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
