// app/learn/[slug]/certificate/page.tsx
// Printable certificate of completion.
// Uses adminFetch to bypass RLS on certificates table.
// Print button is in CertificateActions (client component) — no event handlers here.

import { redirect, notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetch } from '@/lib/supabase/admin'
import { CertificateActions } from '@/components/CertificateActions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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

  // Use adminFetch to bypass RLS on certificates table
  const { data: certificate } = await adminFetch(
    'certificates',
    `user_id=eq.${user.id}&course_id=eq.${course.id}&select=*&limit=1`
  )

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

  // Check if this is a bundle purchase (bundle users keep access after download)
  const { data: bundlePurchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', course.id)
    .eq('status', 'completed')
    .eq('is_bundle', true)
    .limit(1)
    .single()

  const isBundleUser = !!bundlePurchase

  const rawDate = certificate.issued_at || certificate.created_at || new Date().toISOString()
  const issuedDate = new Date(rawDate).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <CertificateActions slug={slug} isBundleUser={isBundleUser} />

      {/* Warning banner for non-bundle users */}
      {!isBundleUser && (
        <div className="print:hidden bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-amber-800 text-sm">
            <svg className="w-4 h-4 shrink-0 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Note:</strong> Downloading your certificate will lock access to this course. To regain access, you will need to purchase the course again or{' '}
              <Link href="/pricing" className="underline font-medium">upgrade to the Pro Bundle</Link>.
            </span>
          </div>
        </div>
      )}

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

          {/* Brand */}
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

          <p className="text-gray-600 text-base mb-2">has successfully completed the course</p>
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

          <div className="mt-10 border-t border-gray-300 pt-4 w-48 mx-auto">
            <p className="text-xs text-gray-400">AILearnHub.IO</p>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  )
}
