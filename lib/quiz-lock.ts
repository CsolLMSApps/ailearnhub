// lib/quiz-lock.ts
// Shared "quiz attempt lock" logic used by both the student-facing quiz
// routes/pages and the admin unlock feature.
//
// Rule: a student gets DEFAULT_MAX_QUIZ_ATTEMPTS attempts per course module
// until an admin unlocks them. Once an admin grants an unlock, the admin
// also chooses how many attempts that unlock is worth (not fixed to 3) —
// only attempts made after that unlock count, and only up to the number the
// admin granted. If none of those attempts passed, the quiz locks again and
// further submissions are rejected until the next admin-granted unlock (see
// app/actions/admin-quiz-unlock.ts). Once a student passes, the lock never
// applies to them again for that module — only failing streaks lock.

import { adminFetchAll } from '@/lib/supabase/admin'

// Used only before a student has ever been unlocked. Once an admin grants an
// unlock, the attempts THEY chose for that unlock becomes the cap instead.
export const DEFAULT_MAX_QUIZ_ATTEMPTS = 3

// Kept as an alias so existing imports of MAX_QUIZ_ATTEMPTS keep working.
export const MAX_QUIZ_ATTEMPTS = DEFAULT_MAX_QUIZ_ATTEMPTS

export interface AttemptRecord {
  completed_at: string
  passed: boolean
}

// The most recent admin-granted unlock for a user+course+module, if any.
export interface UnlockInfo {
  grantedAt: string
  attemptsGranted: number
}

export interface QuizLockStatus {
  locked: boolean
  attemptsUsed: number
  attemptsRemaining: number
  maxAttempts: number
  lastUnlockAt: string | null
}

/**
 * Pure, synchronous lock calculation. Pass every quiz_results row for the
 * user+course+module (just { completed_at, passed }), plus that group's most
 * recent quiz_unlocks row (granted_at + the attempts_granted the admin chose
 * for it), or null if the student has never been unlocked.
 */
export function computeQuizLockStatus(
  attempts: AttemptRecord[],
  lastUnlock: UnlockInfo | null
): QuizLockStatus {
  const maxAttempts = lastUnlock ? lastUnlock.attemptsGranted : DEFAULT_MAX_QUIZ_ATTEMPTS
  const unlockTime = lastUnlock ? new Date(lastUnlock.grantedAt).getTime() : null

  // Only attempts made after the most recent unlock count toward the cap —
  // this is what "resets" attempts once an admin grants one.
  const effectiveAttempts = unlockTime
    ? attempts.filter(a => new Date(a.completed_at).getTime() > unlockTime)
    : attempts

  const passedSinceUnlock = effectiveAttempts.some(a => a.passed)
  const attemptsUsed = effectiveAttempts.length
  const locked = !passedSinceUnlock && attemptsUsed >= maxAttempts

  return {
    locked,
    attemptsUsed,
    attemptsRemaining: Math.max(0, maxAttempts - attemptsUsed),
    maxAttempts,
    lastUnlockAt: lastUnlock?.grantedAt ?? null,
  }
}

/**
 * Convenience I/O wrapper for the common single-user/course/module case
 * (used by the quiz API routes and the student quiz page). It fetches that
 * one group's most recent unlock itself.
 *
 * Admin pages that already have the full quiz_unlocks table loaded for many
 * users/modules at once should call computeQuizLockStatus() directly with
 * their own in-memory lookup instead, to avoid one query per group.
 */
export async function getQuizLockStatus(
  userId: string,
  courseId: string,
  moduleNumber: number,
  attempts: AttemptRecord[]
): Promise<QuizLockStatus> {
  const { data: unlocks } = await adminFetchAll(
    'quiz_unlocks',
    `user_id=eq.${userId}&course_id=eq.${courseId}&module_number=eq.${moduleNumber}` +
      `&select=granted_at,attempts_granted&order=granted_at.desc&limit=1`
  )

  const row = unlocks?.[0]
  const lastUnlock: UnlockInfo | null = row
    ? { grantedAt: row.granted_at, attemptsGranted: row.attempts_granted ?? DEFAULT_MAX_QUIZ_ATTEMPTS }
    : null

  return computeQuizLockStatus(attempts, lastUnlock)
}