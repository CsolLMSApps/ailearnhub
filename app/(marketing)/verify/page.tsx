'use client'

// app/(marketing)/verify/page.tsx
// Public certificate verification page.
// Accessible to anyone — no login required.
// Accepts ?id=CERT_NUMBER pre-filled (e.g. from the Verify button on the certificate page).

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

interface VerifyResult {
  valid: boolean
  certificateNumber?: string
  studentName?: string
  courseTitle?: string
  issuedAt?: string
}

function VerifyForm() {
  const searchParams = useSearchParams()
  const [certId, setCertId] = useState(searchParams?.get('id') || '')
  const [result, setResult] = useState<VerifyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-verify if URL has ?id= (from QR code scan)
  useEffect(() => {
    const idFromUrl = searchParams?.get('id')
    if (idFromUrl) {
      setCertId(idFromUrl)
      handleVerify(idFromUrl)
    }
  }, [])

  const handleVerify = async (id?: string) => {
    const query = (id || certId).trim().toUpperCase()
    if (!query) { inputRef.current?.focus(); return }

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`/api/certificates/verify?id=${encodeURIComponent(query)}`)
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ valid: false })
    } finally {
      setLoading(false)
    }
  }

  const issuedDate = result?.issuedAt
    ? new Date(result.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#FF6F00] to-[#E65100] text-white py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">🎓</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Certificate Verification</h1>
          <p className="text-white/80 text-base">
            Verify the authenticity of an AI Learn Hub certificate instantly.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium">
            ← Back to Home
          </Link>
        </div>

        {/* Search box */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Enter Certificate ID</h2>
          <p className="text-sm text-gray-500 mb-5">
            The certificate ID is printed on the certificate (e.g. <span className="font-mono text-gray-700">AILH-202608-K7M2N</span>). Hyphens are optional.
          </p>

          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={certId}
              onChange={e => { setCertId(e.target.value.toUpperCase()); setResult(null) }}
              onKeyDown={e => e.key === 'Enter' && handleVerify()}
              placeholder="e.g. AILH-202608-K7M2N"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent outline-none uppercase"
            />
            <button
              onClick={() => handleVerify()}
              disabled={loading || !certId.trim()}
              className="bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {loading ? 'Checking...' : 'Verify'}
            </button>
          </div>
        </div>

        {/* Result */}
        {result && (
          result.valid ? (
            <div className="bg-white rounded-2xl border-2 border-green-400 shadow-sm overflow-hidden">
              {/* Green header */}
              <div className="bg-green-50 border-b border-green-200 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-green-800 text-base">Certificate Verified ✓</p>
                  <p className="text-green-600 text-xs">This certificate is authentic and was issued by AI Learn Hub</p>
                </div>
              </div>

              {/* Certificate details */}
              <div className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Certificate Holder</p>
                    <p className="font-bold text-gray-900 text-lg">{result.studentName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Course Completed</p>
                    <p className="font-bold text-[#FF6F00] text-base leading-snug">{result.courseTitle}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Date Issued</p>
                    <p className="font-semibold text-gray-800">{issuedDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Certificate ID</p>
                    <p className="font-mono font-semibold text-gray-800 text-sm">{result.certificateNumber}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Verified by AI Learn Hub · ailearnhub.io
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-red-300 shadow-sm overflow-hidden">
              <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-red-800 text-base">Certificate Not Found</p>
                  <p className="text-red-600 text-xs">No certificate matching this ID was found in our records</p>
                </div>
              </div>
              <div className="px-6 py-5 text-sm text-gray-600 space-y-1">
                <p>Please double-check the certificate ID and try again.</p>
                <p>If you believe this is an error, contact <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">support@ailearnhub.io</a></p>
              </div>
            </div>
          )
        )}

        {/* Info section */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-3">About AI Learn Hub Certificates</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ Each certificate has a unique ID that can be verified here instantly</p>
            <p>✓ Certificates are issued after passing the final course quiz with 70%+</p>
            <p>✓ Certificate IDs are permanent and tied to the student's record</p>
            <p>✓ Certificates are issued by AI Learn Hub and cannot be forged</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF6F00]" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  )
}
