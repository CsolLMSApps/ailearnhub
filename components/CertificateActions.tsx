'use client'

import Link from 'next/link'
import { useState } from 'react'

export function CertificateActions({ slug }: { slug: string }) {
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      const el = document.getElementById('certificate')
      if (!el) throw new Error('Certificate element not found')

      // Dynamically import so they don't bloat the server bundle
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).default

      const canvas = await html2canvas(el, {
        scale: 3,           // high resolution
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')

      // A4 landscape: 297 × 210 mm
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()

      // Fit the certificate image to fill the page
      pdf.addImage(imgData, 'PNG', 0, 0, pageW, pageH)
      pdf.save('AILearnHub-Certificate.pdf')
    } catch (err) {
      console.error('Download failed:', err)
      alert('Download failed. Please use the Print button and save as PDF.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="print:hidden bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-3">
      <Link
        href={`/learn/${slug}`}
        className="text-[#FF6F00] hover:underline text-sm font-medium"
      >
        ← Back to Course
      </Link>

      <div className="flex items-center gap-3">
        {/* Download as PDF */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#FF6F00] text-white rounded-lg font-semibold text-sm hover:bg-[#E65100] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Generating PDF…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
              </svg>
              Download PDF
            </>
          )}
        </button>

        {/* Print */}
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" />
          </svg>
          Print
        </button>
      </div>
    </div>
  )
}
