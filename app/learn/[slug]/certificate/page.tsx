// app/learn/[slug]/certificate/page.tsx
// Printable / downloadable certificate of completion

import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface CertPageProps {
  params: Promise<{ slug: string }>
}

export default async function CertificatePage({ params }: CertPageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, category')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!course) notFound()

  const { data: certificate } = await supabase
    .from('certificates')
    .select('*')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .single()

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No certificate found. Complete all modules first.</p>
          <Link href={`/learn/${slug}`} className="text-[#FF6F00] hover:underline">
            ← Back to Course
          </Link>
        </div>
      </div>
    )
  }

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Print / Back bar — hidden when printing */}
      <div className="print:hidden bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link href={`/learn/${slug}`} className="text-[#FF6F00] hover:underline text-sm font-medium">
          ← Back to Course
        </Link>
        <button
          onClick={() => window.print()}
          className="px-5 py-2 bg-[#FF6F00] text-white rounded-lg font-semibold text-sm hover:bg-[#E65100] transition-colors"
        >
          ⬇ Download / Print Certificate
        </button>
      </div>

      {/* Certificate */}
      <div className="flex items-center justify-center py-10 print:py-0">
        <div
          id="certificate"
          className="bg-white w-[800px] min-h-[560px] relative flex flex-col items-center justify-center text-center px-16 py-14 shadow-2xl print:shadow-none"
          style={{ border: '12px solid #FF6F00' }}
        >
          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-[#FF6F00]" />
          <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-[#FF6F00]" />
          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-[#FF6F00]" />
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-[#FF6F00]" />

          {/* Logo / Brand */}
          <p className="text-[#FF6F00] font-bold text-lg tracking-widest uppercase mb-6">
            AILearnHub.IO
          </p>

          {/* Title */}
          <p className="text-gray-500 text-sm uppercase tracking-[0.3em] mb-4">
            Certificate of Completion
          </p>

          <div className="w-24 h-0.5 bg-[#FF6F00] mx-auto mb-6" />

          {/* Recipient */}
          <p className="text-gray-500 text-sm mb-2">This certifies that</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {certificate.student_name}
          </h1>

          {/* Body */}
          <p className="text-gray-600 text-base mb-2">
            has successfully completed the course
          </p>
          <h2 className="text-2xl font-bold text-[#FF6F00] mb-6">
            {certificate.course_title}
          </h2>

          <div className="w-24 h-0.5 bg-gray-200 mx-auto mb-6" />

          {/* Meta */}
          <div className="flex gap-12 justify-center text-center">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Issued</p>
              <p className="text-sm font-semibold text-gray-700">{issuedDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Certificate ID</p>
              <p className="text-sm font-semibold text-gray-700 font-mono">{certificate.certificate_number}</p>
            </div>
          </div>

          {/* Signature line */}
          <div className="mt-10 border-t border-gray-300 pt-4 w-48 mx-auto">
            <p className="text-xs text-gray-400">AILearnHub.IO</p>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  )
}
