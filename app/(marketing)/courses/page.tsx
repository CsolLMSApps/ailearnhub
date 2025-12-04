import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock, BookOpen, Award, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'AI Courses - Learn AI, ChatGPT, Prompt Engineering | AI Learn Hub',
  description: 'Master AI with our comprehensive courses. From ChatGPT basics to advanced prompt engineering and social media marketing. Start learning today!',
}

interface Course {
  id: string
  slug: string
  title: string
  short_description: string
  price_usd: number
  level: string
  total_modules: number
  total_hours: number
  featured: boolean
}

export default async function CoursesPage() {
  const supabase = await createServerSupabaseClient()
  
  // Query all published courses from database
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, slug, title, short_description, price_usd, level, total_modules, total_hours, featured')
    .eq('is_published', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching courses:', error)
  }

  const allCourses: Course[] = courses || []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Courses for Everyone
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 max-w-3xl mx-auto">
              Master AI tools and transform your career with our comprehensive, hands-on courses
            </p>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200"
            >
              {/* Featured Badge */}
              {course.featured && (
                <div className="bg-[#FF6F00] text-white text-xs font-bold px-3 py-1 inline-block">
                  FEATURED
                </div>
              )}

              <div className="p-6">
                {/* Course Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {course.title}
                </h2>

                {/* Level Badge */}
                <span className="inline-block bg-orange-100 text-[#FF6F00] text-xs font-semibold px-3 py-1 rounded-full mb-4 capitalize">
                  {course.level}
                </span>

                {/* Description */}
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {course.short_description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{course.total_modules} modules</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.total_hours}h</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    <span>Certificate</span>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      ${(course.price_usd / 100).toFixed(0)}
                    </span>
                    <span className="text-gray-500 ml-1">USD</span>
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="inline-flex items-center px-4 py-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-medium rounded-lg transition-colors"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Courses Found */}
        {allCourses.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No courses available at the moment. Check back soon!
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students already learning AI
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-8 py-3 bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold rounded-lg text-lg transition-colors"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  )
}
