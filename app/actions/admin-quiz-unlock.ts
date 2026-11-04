'use server'

// app/actions/admin-quiz-unlock.ts
// Admin action: grant a student a fresh set of quiz attempts after they've
// been locked out (see lib/quiz-lock.ts for the attempt-cap logic). Used
// from /admin/quiz-results, typically after the student raises a support
// ticket asking to retake a quiz.

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { adminFetchAll, adminInsert } from '@/lib/supabase/admin'
import { DEFAULT_MAX_QUIZ_ATTEMPTS } from '@/lib/quiz-lock'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

async function getCallerEmail(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-user-email')
}

async function isAdmin(email: string): Promise<boolean> {
  if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) return true
  const { data } = await adminFetchAll(
    'admin_users',
    `email=eq.${encodeURIComponent(email.toLowerCase())}&select=email`
  )
  return data.length > 0
}

// ── Grant a quiz unlock (resets the attempt cap going forward) ────────────────
// The admin decides how many attempts this unlock is worth — it's no longer
// fixed to 3. If the admin leaves it blank, it falls back to
// DEFAULT_MAX_QUIZ_ATTEMPTS (the same default a never-unlocked student gets).
export async function grantQuizUnlock(
  _prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const callerEmail = await getCallerEmail()
  if (!callerEmail || !(await isAdmin(callerEmail))) {
    return { error: 'Unauthorized' }
  }

  const user_id = formData.get('user_id')?.toString().trim()
  const course_id = formData.get('course_id')?.toString().trim()
  const module_number = parseInt(formData.get('module_number')?.toString() ?? '0')
  const note = formData.get('note')?.toString().trim() ?? ''

  const attemptsRaw = formData.get('attempts')?.toString().trim()
  const attempts_granted = attemptsRaw ? parseInt(attemptsRaw) : DEFAULT_MAX_QUIZ_ATTEMPTS

  if (!user_id) return { error: 'Missing student.' }
  if (!course_id) return { error: 'Missing course.' }
  if (!module_number || module_number < 1) return { error: 'Missing module.' }
  if (!Number.isFinite(attempts_granted) || attempts_granted < 1) {
    return { error: 'Attempts to grant must be a whole number of 1 or more.' }
  }

  const { error } = await adminInsert('quiz_unlocks', {
    user_id,
    course_id,
    module_number,
    granted_by: callerEmail,
    note: note || null,
    attempts_granted,
  })

  if (error) return { error: `Failed to grant unlock: ${error.message}` }

  revalidatePath('/admin/quiz-results')
  return { success: `Quiz unlocked — the student now has ${attempts_granted} fresh attempt${attempts_granted === 1 ? '' : 's'}.` }
}