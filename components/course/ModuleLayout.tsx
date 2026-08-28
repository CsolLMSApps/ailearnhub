'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Mod { module_number: number; title: string }

interface Props {
  slug: string
  courseTitle: string
  moduleNumber: number
  allModules: Mod[]
  completedModules: number[]
  doneCount: number
  totalModules: number
  overallPct: number
  children: React.ReactNode
}

export default function ModuleLayout({
  slug, courseTitle, moduleNumber, allModules,
  completedModules, doneCount, totalModules, overallPct, children,
}: Props) {
  const [open, setOpen] = useState(true)

  // Restore last preference
  useEffect(() => {
    try {
      const v = localStorage.getItem('ailh-sidebar')
      if (v !== null) setOpen(v === '1')
    } catch {}
  }, [])

  const toggle = () =>
    setOpen(prev => {
      try { localStorage.setItem('ailh-sidebar', prev ? '0' : '1') } catch {}
      return !prev
    })

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar panel ── */}
      <aside
        className={`flex flex-col bg-[#212121] fixed top-0 left-0 bottom-0 z-20 shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${
          open ? 'w-64' : 'w-0'
        }`}
      >
        {/* Inner wrapper keeps fixed width so content doesn't reflow */}
        <div className="w-64 flex flex-col h-full overflow-y-auto">

          {/* Course info + ✕ button */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center justify-between mb-3">
              <Link
                href={`/learn/${slug}`}
                className="flex items-center gap-1 text-white/50 hover:text-white text-xs font-medium transition-colors"
              >
                ← Back to course
              </Link>
              {/* Close / collapse button */}
              <button
                onClick={toggle}
                title="Collapse sidebar"
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-colors shrink-0"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <p className="text-white font-bold text-sm leading-snug mb-4">{courseTitle}</p>

            <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
              <span>{doneCount} of {totalModules} modules done</span>
              <span>{overallPct}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-[#FF6F00] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${overallPct}%` }}
              />
            </div>
          </div>

          {/* Module list */}
          <nav className="flex-1 py-3 overflow-y-auto">
            {allModules.map((m, idx) => {
              const isActive = m.module_number === moduleNumber
              const isDone   = completedModules.includes(m.module_number)
              const prevDone = idx === 0 || completedModules.includes(allModules[idx - 1].module_number)
              const isLocked = !prevDone && !isDone && !isActive

              if (isLocked) {
                return (
                  <div key={m.module_number} className="flex items-start gap-3 px-5 py-3 opacity-35 cursor-not-allowed">
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-xs text-white/30 flex-shrink-0 mt-0.5">
                      🔒
                    </div>
                    <span className="text-white/30 text-xs leading-snug">{m.title}</span>
                  </div>
                )
              }

              return (
                <Link
                  key={m.module_number}
                  href={`/learn/${slug}/module/${m.module_number}`}
                  className={`flex items-start gap-3 px-5 py-3 transition-colors border-r-2 ${
                    isActive
                      ? 'bg-[#FF6F00]/15 border-[#FF6F00]'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                    isDone    ? 'bg-green-500 text-white' :
                    isActive  ? 'bg-[#FF6F00] text-white' :
                                'border border-white/20 text-white/40'
                  }`}>
                    {isDone ? '✓' : m.module_number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-snug ${
                      isActive ? 'text-white font-semibold' :
                      isDone   ? 'text-white/50' :
                                 'text-white/65'
                    }`}>
                      {m.title}
                    </p>
                    {isActive && (
                      <p className="text-[#FF6F00] text-[10px] mt-0.5 font-medium">Currently reading</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Footer: Course Final Quiz */}
          <div className="p-4 border-t border-white/10">
            <Link
              href={`/learn/${slug}/quiz`}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#FF6F00]/20 hover:bg-[#FF6F00]/30 text-[#FF6F00] rounded-lg text-xs font-bold transition-colors"
            >
              📝 Course Final Quiz
            </Link>
          </div>

        </div>
      </aside>

      {/* ── Expand button — visible only when sidebar is closed ── */}
      <button
        onClick={toggle}
        title="Open sidebar"
        className={`fixed top-3.5 left-3 z-30 w-8 h-8 bg-[#212121] hover:bg-[#333] text-white rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 ${
          open ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Hamburger icon */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
          <rect width="15" height="1.8" rx="0.9" fill="currentColor"/>
          <rect y="5.1" width="15" height="1.8" rx="0.9" fill="currentColor"/>
          <rect y="10.2" width="15" height="1.8" rx="0.9" fill="currentColor"/>
        </svg>
      </button>

      {/* ── Main content — shifts right when sidebar is open ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${open ? 'lg:ml-64' : 'ml-0'}`}>
        {children}
      </div>

    </div>
  )
}
