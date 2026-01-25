'use client'

// components/course/CompleteModuleButton.tsx
// Client component for marking modules as complete

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CompleteModuleButtonProps {
  courseId: string
  moduleNumber: number
  nextModuleNumber?: number
  slug: string
}

export default function CompleteModuleButton({
  courseId,
  moduleNumber,
  nextModuleNumber,
  slug,
}: CompleteModuleButtonProps) {
  const router = useRouter()
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)

    try {
      const response = await fetch('/api/progress/complete-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          moduleNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark module as complete')
      }

      // Refresh the page to show updated status
      router.refresh()

      // If there's a next module, navigate to it
      if (nextModuleNumber) {
        router.push(`/learn/${slug}/module/${nextModuleNumber}`)
      } else {
        // Last module completed - go back to course overview
        router.push(`/learn/${slug}`)
      }
    } catch (error: any) {
      console.error('Error completing module:', error)
      alert(error.message || 'Failed to mark module as complete. Please try again.')
      setIsCompleting(false)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <button
        onClick={handleComplete}
        disabled={isCompleting}
        className="w-full sm:w-auto bg-[#FF6F00] hover:bg-[#E65100] text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isCompleting ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Completing...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Mark as Complete</span>
          </>
        )}
      </button>

      {nextModuleNumber && (
        <p className="text-sm text-gray-600">
          Continue to Module {nextModuleNumber} →
        </p>
      )}
    </div>
  )
}
