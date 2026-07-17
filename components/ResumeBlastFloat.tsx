'use client'

import { useState } from 'react'

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
              <span className="text-xl">🚀</span>
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
            Learning AI skills? Turn them into a job. Build an AI-powered resume and blast it to hundreds of employers — free to start.
          </p>
          <a
            href="https://www.resumeblast.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-white text-[#0f172a] font-bold text-sm py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Try ResumeBlast.ai →
          </a>
          <p className="text-center text-white/30 text-xs mt-2">Free to start · No credit card</p>
        </div>
      )}

      {/* Floating bubble button */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="flex items-center gap-2 bg-[#0f172a] text-white px-4 py-3 rounded-full shadow-2xl hover:bg-[#1e3a5f] transition-all border border-white/10 group"
        aria-label="ResumeBlast.ai"
      >
        <span className="text-lg">🚀</span>
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
