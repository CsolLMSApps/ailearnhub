'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface StudentNotesProps {
  courseId:     string
  moduleNumber: number
  initialNote:  string
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export default function StudentNotes({ courseId, moduleNumber, initialNote }: StudentNotesProps) {
  const [isOpen,     setIsOpen]     = useState(false)
  const [content,    setContent]    = useState(initialNote)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus textarea when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 100)
  }, [isOpen])

  const saveNote = useCallback(async (text: string) => {
    setSaveStatus('saving')
    try {
      const res = await fetch('/api/notes', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id:     courseId,
          module_number: moduleNumber,
          content:       text,
        }),
      })
      setSaveStatus(res.ok ? 'saved' : 'error')
    } catch {
      setSaveStatus('error')
    }
    // Reset to idle after 2 seconds
    setTimeout(() => setSaveStatus('idle'), 2000)
  }, [courseId, moduleNumber])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setContent(text)
    setSaveStatus('idle')

    // Debounce: save 1 second after user stops typing
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => saveNote(text), 1000)
  }

  // Save immediately when panel closes (flush any pending debounce)
  const handleToggle = () => {
    if (isOpen && debounceRef.current) {
      clearTimeout(debounceRef.current)
      saveNote(content)
    }
    setIsOpen(prev => !prev)
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-gray-50 hover:bg-orange-50 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg">📓</span>
          <span className="font-semibold text-gray-800 text-sm">My Notes</span>
          {content.trim() && (
            <span className="text-xs bg-orange-100 text-[#FF6F00] font-semibold px-2 py-0.5 rounded-full">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'saving' && (
            <span className="text-xs text-gray-400 animate-pulse">Saving…</span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-green-600">✓ Saved</span>
          )}
          {saveStatus === 'error' && (
            <span className="text-xs text-red-500">Save failed</span>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Notes panel */}
      {isOpen && (
        <div className="p-4 bg-white">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            placeholder={`Jot down your notes for Module ${moduleNumber}…\n\nKey points, questions, things to try — whatever helps you learn.`}
            rows={10}
            className="w-full text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] resize-y placeholder-gray-300 font-[inherit]"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">Notes are private to you · Auto-saved as you type</p>
            {content.trim() && (
              <button
                onClick={() => {
                  setContent('')
                  saveNote('')
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear notes
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
