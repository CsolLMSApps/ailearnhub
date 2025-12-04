import { createServerSupabaseClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: course } = await supabase.from('courses').select('*').eq('slug', slug).eq('is_published', true).single()
  if (!course) notFound()

  const { data: modules } = await supabase.from('course_modules').select('*').eq('course_id', course.id).order('module_number', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl mb-6">{course.short_description}</p>
          <div className="flex gap-6 mb-6">
            <span>{course.total_modules} Modules</span>
            <span>{course.total_hours} Hours</span>
            <span className="capitalize">{course.level}</span>
          </div>
          <div className="text-5xl font-bold mb-4">${(course.price_usd / 100).toFixed(0)}</div>
          <button className="bg-white text-[#FF6F00] px-8 py-4 rounded-lg font-bold text-lg">Enroll Now</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">About This Course</h2>
          <p className="text-lg whitespace-pre-line">{course.long_description}</p>
        </div>
        {modules && modules.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Course Curriculum</h2>
            {modules.map((module) => (
              <div key={module.id} className="border-2 border-gray-200 rounded-lg p-5 mb-4 hover:border-[#FF6F00]">
                <div className="flex justify-between">
                  <div>
                    <span className="bg-[#FF6F00] text-white px-2 py-1 rounded text-xs font-bold">Module {module.module_number}</span>
                    <h3 className="font-bold text-lg mt-2">{module.title}</h3>
                    {module.description && <p className="text-gray-600 text-sm mt-1">{module.description}</p>}
                  </div>
                  <span className="text-sm text-gray-500">{module.estimated_minutes} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
