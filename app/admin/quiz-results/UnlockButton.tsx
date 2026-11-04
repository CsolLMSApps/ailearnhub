'use client'

// app/admin/quiz-results/UnlockButton.tsx
// Small inline form + button that sets how many fresh quiz attempts a
// student gets from right now — usable for any not-yet-passed student, not
// only ones who are already locked out, so an admin can top them up
// proactively. The admin chooses the count (see
// app/actions/admin-quiz-unlock.ts and lib/quiz-lock.ts).

import { useActionState, useState, useEffect } from 'react'
import { grantQuizUnlock } from '@/app/actions/admin-quiz-unlock'
import { DEFAULT_MAX_QUIZ_ATTEMPTS } from '@/lib/quiz-lock'

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
  const [attempts, setAttempts] = useState(String(DEFAULT_MAX_QUIZ_ATTEMPTS))

  // Once the unlock succeeds, collapse the note form back down.
  useEffect(() => {
    if (state.success) setOpen(false)
  }, [state.success])

  if (state.success) {
    return (
      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
        ✓ Attempts set
      </span>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-semibold text-white bg-[#FF6F00] hover:bg-[#E65100] px-3 py-1.5 rounded-lg transition-colors"
      >
        ⚙️ Set Attempts
      </button>
    )
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="course_id" value={courseId} />
      <input type="hidden" name="module_number" value={moduleNumber} />
      <label className="flex items-center gap-1 text-xs text-gray-500">
        Attempts
        <input
          type="number"
          name="attempts"
          min={1}
          step={1}
          value={attempts}
          onChange={e => setAttempts(e.target.value)}
          disabled={pending}
          className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 w-14 text-center focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
        />
      </label>
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