'use client'

// app/admin/quiz-results/UnlockButton.tsx
// Small inline form + button that grants a locked student 3 fresh quiz
// attempts (see app/actions/admin-quiz-unlock.ts and lib/quiz-lock.ts).

import { useActionState, useState, useEffect } from 'react'
import { grantQuizUnlock } from '@/app/actions/admin-quiz-unlock'

interface UnlockButtonProps {
  userId: string
  courseId: string
  moduleNumber: number
}

const initialState: { error?: string; success?: string } = {}

export default function UnlockButton({ userId, courseId, moduleNumber }: UnlockButtonProps) {
  const [state, formAction, pending] = useActionState(grantQuizUnlock, initialState)
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')

  // Once the unlock succeeds, collapse the note form back down.
  useEffect(() => {
    if (state.success) setOpen(false)
  }, [state.success])

  if (state.success) {
    return (
      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
        ✓ Unlocked
      </span>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-white bg-[#FF6F00] hover:bg-[#E65100] px-3 py-1.5 rounded-lg transition-colors"
      >
        🔓 Unlock
      </button>
    )
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="course_id" value={courseId} />
      <input type="hidden" name="module_number" value={moduleNumber} />
      <input
        type="text"
        name="note"
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Note (e.g. ticket #)"
        disabled={pending}
        className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 w-36 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={pending}
        className="text-xs font-semibold text-white bg-[#FF6F00] hover:bg-[#E65100] px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
      >
        {pending ? 'Granting…' : 'Confirm'}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        disabled={pending}
        className="text-xs text-gray-400 hover:text-gray-600"
      >
        Cancel
      </button>
      {state.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
    </form>
  )
}