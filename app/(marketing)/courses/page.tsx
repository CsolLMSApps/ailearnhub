import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock } from 'lucide-react'

const courses = [
  {
    slug: 'chatgpt-mastery',
    title: 'ChatGPT Mastery for Professionals',
    description: 'Master ChatGPT and transform your professional productivity with AI',
    level: 'Beginner to Advanced',
    duration: '4 hours',
    modules: 7,
    price: 19,
    originalPrice: 29,
    featured: true,
    features: [
      '50+ prompt templates & business email templates',
      'Advanced prompt engineering techniques',
      'Save 10+ hours weekly on business tasks',
      'Lifetime access to all updates',
    ],
  },
  {
    slug: 'ai-for-beginners',
    title: 'AI for Beginners',
    description: 'Start your AI journey from scratch - no technical background needed',
    level: 'Absolute Beginner',
    duration: '3 hours',
    modules: 6,
    price: 19,
    originalPrice: 29,
    featured: false,
    features: [
      'Understand AI in plain English',
      'Practical daily & work applications',
      '40+ templates for everyday use',
      'Certificate upon completion',
    ],
  },
]

export default function CoursesPage() {
  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <section className="bg-[#212121] text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="mb-4 text-5xl leading-tight font-normal">All Courses</h1>
          <p className="text-gray-300 text-lg leading-8 max-w-3xl">
            Professional AI training designed for busy professionals. Start learning today and transform how you work.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <Card key={course.slug} className="border border-gray-200 hover:border-[#FF6F00] transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    {course.featured ? (
                      <div className="bg-[#FF6F00]/10 text-[#FF6F00] px-3 py-1 uppercase tracking-wide text-xs font-medium">
                        Featured
                      </div>
                    ) : (
                      <div className="bg-[#424242]/10 text-[#424242] px-3 py-1 uppercase tracking-wide text-xs font-medium">
                        {course.level}
                      </div>
                    )}
                    <div className="text-right">
                      <div className="text-[#757575] line-through text-sm">${course.originalPrice}</div>
                      <div className="text-[#FF6F00] text-3xl font-normal">${course.price}</div>
                    </div>
                  </div>
                  <CardTitle className="text-[#212121] text-xl font-medium leading-7">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-[#424242] text-base leading-7">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-[#757575] mb-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div>•</div>
                    <div>{course.modules} modules</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {course.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6F00] mt-0.5 flex-shrink-0" />
                        <span className="text-[#424242] text-sm leading-6">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href={`/courses/${course.slug}`}>
                    <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-medium">
                      View course details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-[#212121] mb-4 text-3xl font-normal">Ready to get started?</h2>
          <p className="text-[#424242] mb-8 text-lg leading-7">
            Join hundreds of professionals already saving 10+ hours weekly with AI
          </p>
          <Link href="/auth/signup">
            <Button className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-3 text-base font-medium">
              Create free account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
