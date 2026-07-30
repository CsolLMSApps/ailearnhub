'use client'

import { useState } from 'react'

const LOGO_URL = 'https://www.google.com/s2/favicons?domain=resumeblast.ai&sz=64'

function ResumeBlastLogo({ size = 24 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_URL}
      alt="ResumeBlast.ai logo"
      width={size}
      height={size}
      className="rounded-sm shrink-0"
    />
  )
}

export function ResumeBlastFloat() {
  const [dismissed, setDismissed] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (dismissed) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">

      {/* Expanded card */}
      {expanded && (
        <div className="bg-[#0f172a] text-white rounded-2xl shadow-2xl p-5 w-72 border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <ResumeBlastLogo size={22} />
              <span className="font-bold text-sm">ResumeBlast.ai</span>
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/40 hover:text-white/80 text-lg leading-none"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          <p className="text-white/70 text-xs leading-relaxed mb-4">
            Learning AI skills? Turn them into a job. Upload your resume and blast it to hundreds of employers instantly — free to start.
          </p>
          <a
            href="https://www.resumeblast.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-white text-[#0f172a] font-bold text-sm py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Try ResumeBlast.ai →
          </a>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#1e3a5f] transition-all border border-white/10 group"
        aria-label="ResumeBlast.ai"
      >
        <ResumeBlastLogo size={20} />
        <span className="text-sm font-bold whitespace-nowrap">Blast Your Resume</span>
        <svg
          className={`w-4 h-4 text-white/60 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>

    </div>
  )
}
