'use client'

import { useState, useEffect } from 'react'

export interface BookmarkEntry {
  courseId: string
  courseSlug: string
  courseTitle: string
  moduleNumber: number
  moduleTitle: string
  savedAt: string
}

const STORAGE_KEY = 'ailearnhub_bookmarks'

export function getBookmarks(): BookmarkEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveBookmarks(entries: BookmarkEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

interface Props {
  courseId: string
  courseSlug: string
  courseTitle: string
  moduleNumber: number
  moduleTitle: string
}

export default function BookmarkButton({ courseId, courseSlug, courseTitle, moduleNumber, moduleTitle }: Props) {
  const [bookmarked, setBookmarked] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Read initial state from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const existing = getBookmarks()
    setBookmarked(existing.some(b => b.courseId === courseId && b.moduleNumber === moduleNumber))
    setMounted(true)
  }, [courseId, moduleNumber])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  function toggle() {
    const entries = getBookmarks()
    const exists = entries.some(b => b.courseId === courseId && b.moduleNumber === moduleNumber)

    if (exists) {
      saveBookmarks(entries.filter(b => !(b.courseId === courseId && b.moduleNumber === moduleNumber)))
      setBookmarked(false)
      showToast('Bookmark removed')
    } else {
      saveBookmarks([
        { courseId, courseSlug, courseTitle, moduleNumber, moduleTitle, savedAt: new Date().toISOString() },
        ...entries,
      ])
      setBookmarked(true)
      showToast('Bookmarked!')
    }
  }

  if (!mounted) return null

  return (
    <div className="relative">
      <button
        onClick={toggle}
        aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this module'}
        title={bookmarked ? 'Remove bookmark' : 'Save to bookmarks'}
        className={`
          flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
          border transition-all duration-150 select-none cursor-pointer
          ${bookmarked
            ? 'bg-[#FF6F00] border-[#FF6F00] text-white shadow-sm shadow-orange-200'
            : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3.5 h-3.5 shrink-0"
          aria-hidden="true"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        {bookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>

      {toast && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-50 pointer-events-none">
          {toast}
        </div>
      )}
    </div>
  )
}
