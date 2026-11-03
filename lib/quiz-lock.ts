// lib/quiz-lock.ts
// Shared "quiz attempt lock" logic used by both the student-facing quiz
// routes/pages and the admin unlock feature.
//
// Rule: a student gets MAX_QUIZ_ATTEMPTS attempts per course module since
// their last admin-granted unlock (or ever, if they've never been unlocked).
// If none of those attempts passed, the quiz locks and further submissions
// are rejected until an admin grants a fresh unlock from /admin/quiz-results
// (see app/actions/admin-quiz-unlock.ts). Once a student passes, the lock
// never applies to them again for that module — only failing streaks lock.

import { adminFetchAll } from '@/lib/supabase/admin'

export const MAX_QUIZ_ATTEMPTS = 3

export interface AttemptRecord {
  completed_at: string
  passed: boolean
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
 * user+course+module (just { completed_at, passed }), plus the most recent
 * quiz_unlocks.granted_at for that same user+course+module (or null if the
 * student has never been unlocked).
 */
export function computeQuizLockStatus(
  attempts: AttemptRecord[],
  lastUnlockAt: string | null
): QuizLockStatus {
  const unlockTime = lastUnlockAt ? new Date(lastUnlockAt).getTime() : null

  // Only attempts made after the most recent unlock count toward the cap —
  // this is what "resets" the 3 attempts once an admin grants one.
  const effectiveAttempts = unlockTime
    ? attempts.filter(a => new Date(a.completed_at).getTime() > unlockTime)
    : attempts

  const passedSinceUnlock = effectiveAttempts.some(a => a.passed)
  const attemptsUsed = effectiveAttempts.length
  const locked = !passedSinceUnlock && attemptsUsed >= MAX_QUIZ_ATTEMPTS

  return {
    locked,
    attemptsUsed,
    attemptsRemaining: Math.max(0, MAX_QUIZ_ATTEMPTS - attemptsUsed),
    maxAttempts: MAX_QUIZ_ATTEMPTS,
    lastUnlockAt,
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
      `&select=granted_at&order=granted_at.desc&limit=1`
  )

  const lastUnlockAt = unlocks?.[0]?.granted_at ?? null
  return computeQuizLockStatus(attempts, lastUnlockAt)
}