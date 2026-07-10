'use client'

import Link from 'next/link'

export function CertificateActions({ slug }: { slug: string }) {
  return (
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
  )
}
