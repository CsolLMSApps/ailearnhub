'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type FontSize = 'sm' | 'md' | 'lg' | 'xl'

interface Module { module_number: number; title: string }

interface Props {
  moduleNumber: number
  totalModules: number
  slug: string
  allModules: Module[]
}

export default function ReaderControls({ moduleNumber, totalModules, slug, allModules }: Props) {
  const [dark, setDark]           = useState(false)
  const [fontSize, setFontSize]   = useState<FontSize>('md')
  const [searchOpen, setSearch]   = useState(false)
  const [query, setQuery]         = useState('')

  // ── Restore prefs ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const d  = localStorage.getItem('reader-dark') === '1'
      const fs = (localStorage.getItem('reader-fs') ?? 'md') as FontSize
      setDark(d)
      setFontSize(fs)
      applyDark(d)
      applyFs(fs)
    } catch {}
  }, [])

  // ── Keyboard shortcut Ctrl/Cmd+K ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearch(s => !s)
      }
      if (e.key === 'Escape') setSearch(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Helpers ───────────────────────────────────────────────────────────────
  function applyDark(on: boolean) {
    if (on) document.documentElement.setAttribute('data-reader-dark', '1')
    else    document.documentElement.removeAttribute('data-reader-dark')
  }
  function applyFs(fs: FontSize) {
    document.documentElement.setAttribute('data-reader-fs', fs)
  }

  function toggleDark() {
    setDark(prev => {
      const next = !prev
      applyDark(next)
      try { localStorage.setItem('reader-dark', next ? '1' : '0') } catch {}
      return next
    })
  }

  const SIZES: FontSize[] = ['sm', 'md', 'lg', 'xl']
  function cycleFontSize(dir: 1 | -1) {
    setFontSize(prev => {
      const idx  = SIZES.indexOf(prev)
      const next = SIZES[Math.max(0, Math.min(SIZES.length - 1, idx + dir))]
      applyFs(next)
      try { localStorage.setItem('reader-fs', next) } catch {}
      return next
    })
  }

  // ── Search filter ─────────────────────────────────────────────────────────
  const filtered = allModules.filter(m =>
    m.title.toLowerCase().includes(query.toLowerCase())
  )

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Controls row */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Module label */}
        <span className={`text-xs mr-2 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
          Module {moduleNumber} / {totalModules}
        </span>

        {/* Search */}
        <button
          onClick={() => setSearch(s => !s)}
          title="Search modules  (Ctrl+K)"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            dark
              ? 'bg-white/10 hover:bg-white/20 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
          }`}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        {/* Font smaller */}
        <button
          onClick={() => cycleFontSize(-1)}
          disabled={fontSize === 'sm'}
          title="Decrease font size"
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors disabled:opacity-30 ${
            dark
              ? 'bg-white/10 hover:bg-white/20 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
          }`}
        >
          A
        </button>

        {/* Font larger */}
        <button
          onClick={() => cycleFontSize(1)}
          disabled={fontSize === 'xl'}
          title="Increase font size"
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-30 ${
            dark
              ? 'bg-white/10 hover:bg-white/20 text-gray-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
          }`}
        >
          A
        </button>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            dark
              ? 'bg-[#FF6F00]/30 text-[#FF9800]'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-500'
          }`}
        >
          {dark ? (
            /* Sun */
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
          ) : (
            /* Moon */
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>
      </div>

      {/* ── Search Modal ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          onClick={() => setSearch(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <svg width="16" height="16" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search modules…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              />
              <kbd className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">Esc</kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <p className="text-center text-sm text-gray-400 py-8">No modules found</p>
              ) : (
                filtered.map(m => (
                  <Link
                    key={m.module_number}
                    href={`/learn/${slug}/module/${m.module_number}`}
                    onClick={() => setSearch(false)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors ${
                      m.module_number === moduleNumber ? 'bg-orange-50' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      m.module_number === moduleNumber
                        ? 'bg-[#FF6F00] text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {m.module_number}
                    </div>
                    <span className={`text-sm ${m.module_number === moduleNumber ? 'font-semibold text-[#FF6F00]' : 'text-gray-700'}`}>
                      {m.title}
                    </span>
                    {m.module_number === moduleNumber && (
                      <span className="ml-auto text-[10px] text-[#FF6F00] font-medium">Current</span>
                    )}
                  </Link>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-gray-100 px-4 py-2 flex items-center gap-4">
              <span className="text-[11px] text-gray-400">↑↓ navigate</span>
              <span className="text-[11px] text-gray-400">↵ open</span>
              <span className="text-[11px] text-gray-400">Esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
