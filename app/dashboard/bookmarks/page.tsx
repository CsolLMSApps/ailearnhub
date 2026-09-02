'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getBookmarks, BookmarkEntry } from '@/components/course/BookmarkButton'

const STORAGE_KEY = 'ailearnhub_bookmarks'
const COLORS = ['#FF6F00', '#6366f1', '#10b981', '#f59e0b', '#3b82f6', '#ec4899']

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  return 'Just now'
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setBookmarks(getBookmarks())
    setMounted(true)
  }, [])

  function remove(courseId: string, moduleNumber: number) {
    const updated = bookmarks.filter(
      b => !(b.courseId === courseId && b.moduleNumber === moduleNumber)
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setBookmarks(updated)
  }

  // Group by course
  const grouped = bookmarks.reduce<Record<string, { courseSlug: string; courseTitle: string; courseId: string; items: BookmarkEntry[] }>>(
    (acc, b) => {
      if (!acc[b.courseId]) {
        acc[b.courseId] = { courseId: b.courseId, courseSlug: b.courseSlug, courseTitle: b.courseTitle, items: [] }
      }
      acc[b.courseId].items.push(b)
      return acc
    },
    {}
  )
  const groups = Object.values(grouped)

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-[#FF6F00]">AI Learn Hub</Link>
              <nav className="hidden md:flex gap-6 text-sm font-medium">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
                <Link href="/dashboard/bookmarks" className="text-[#FF6F00] border-b-2 border-[#FF6F00] pb-1 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  Bookmarks
                </Link>
                <Link href="/courses" className="text-gray-600 hover:text-gray-900">Browse Courses</Link>
              </nav>
            </div>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-[#FF6F00] transition-colors">
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF6F00" className="w-6 h-6" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            My Bookmarks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {bookmarks.length === 0
              ? 'No bookmarks yet — click the Bookmark button on any module to save it here'
              : `${bookmarks.length} module${bookmarks.length !== 1 ? 's' : ''} saved across ${groups.length} course${groups.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Empty state */}
        {groups.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth={1.5} className="w-8 h-8" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No bookmarks yet</h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              While studying a module, click the <strong>Bookmark</strong> button in the module header to save it here for quick access.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF6F00] text-white rounded-xl font-semibold text-sm hover:bg-[#E65100] transition-colors">
              Go to my courses
            </Link>
          </div>
        )}

        {/* Grouped by course */}
        <div className="space-y-6">
          {groups.map(({ courseId, courseSlug, courseTitle, items }, gi) => (
            <div key={courseId} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Course header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background: COLORS[gi % COLORS.length] }}
                  >
                    {courseTitle.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{courseTitle}</p>
                    <p className="text-xs text-gray-400">{items.length} bookmarked module{items.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <Link href={`/learn/${courseSlug}`} className="text-xs font-semibold text-[#FF6F00] hover:underline">
                  View course →
                </Link>
              </div>

              {/* Module rows */}
              <div className="divide-y divide-gray-50">
                {items.map((item) => (
                  <div key={`${item.courseId}-${item.moduleNumber}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-gray-500">{item.moduleNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.moduleTitle}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Saved {timeAgo(item.savedAt)}</p>
                    </div>
                    {/* Resume — appears on hover (desktop) */}
                    <Link
                      href={`/learn/${item.courseSlug}/module/${item.moduleNumber}`}
                      className="shrink-0 hidden md:flex items-center gap-1.5 px-4 py-1.5 bg-[#FF6F00] text-white text-xs font-bold rounded-full hover:bg-[#E65100] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Resume →
                    </Link>
                    {/* Always visible on mobile */}
                    <Link
                      href={`/learn/${item.courseSlug}/module/${item.moduleNumber}`}
                      className="shrink-0 md:hidden text-[#FF6F00] text-sm font-bold"
                      aria-label="Resume module"
                    >
                      →
                    </Link>
                    {/* Remove */}
                    <button
                      onClick={() => remove(item.courseId, item.moduleNumber)}
                      aria-label="Remove bookmark"
                      className="shrink-0 text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
