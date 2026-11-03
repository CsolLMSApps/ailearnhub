import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetch } from '@/lib/supabase/admin'
import { getQuizLockStatus } from '@/lib/quiz-lock'

export async function POST(request: NextRequest) {
  try {
    const { slug, moduleNumber, answers } = await request.json()
    const supabase = await createServerSupabaseClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, slug, title')
      .eq('slug', slug)
      .single()

    if (courseError || !course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Get quiz with correct answers — adminFetch bypasses RLS on quizzes table
    const { data: quiz, error: quizError } = await adminFetch(
      'quizzes',
      `course_id=eq.${course.id}&module_number=eq.${moduleNumber}&select=*&limit=1`
    )

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Calculate score
    const questions = quiz.questions.questions || quiz.questions
    let score = 0

    questions.forEach((question: any) => {
      if (answers[question.id] === question.correct) {
        score++
      }
    })

    const totalQuestions = questions.length
    const percentage = Math.round((score / totalQuestions) * 100)
    const passed = percentage >= quiz.pass_percentage

    // Get every previous attempt (needed both for the next attempt_number
    // and for the 3-attempt lock check below)
    const { data: previousResults } = await supabase
      .from('quiz_results')
      .select('attempt_number, completed_at, passed')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('module_number', moduleNumber)
      .order('attempt_number', { ascending: false })

    const attemptNumber = (previousResults?.[0]?.attempt_number || 0) + 1

    // Enforce the 3-attempt cap: if the student has already used 3 attempts
    // since their last admin-granted unlock (or ever, if never unlocked)
    // without passing, reject this submission before it's recorded. An
    // admin can grant a fresh unlock from /admin/quiz-results.
    const lockStatus = await getQuizLockStatus(
      user.id,
      course.id,
      moduleNumber,
      (previousResults ?? []).map(r => ({ completed_at: r.completed_at, passed: r.passed }))
    )

    if (lockStatus.locked) {
      return NextResponse.json(
        {
          error: 'Quiz locked: maximum attempts reached',
          locked: true,
          attemptsUsed: lockStatus.attemptsUsed,
          maxAttempts: lockStatus.maxAttempts,
        },
        { status: 403 }
      )
    }

    // Save quiz result
    const { data: result, error: saveError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        course_id: course.id,
        module_number: moduleNumber,
        score,
        total_questions: totalQuestions,
        percentage,
        passed,
        answers,
        attempt_number: attemptNumber
      })
      .select()
      .single()

    if (saveError) {
      console.error('Save quiz result error:', saveError)
      return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
    }

    // If passed, update or create progress record
    if (passed) {
      const { count: totalModules } = await supabase
        .from('course_modules')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', course.id)

      const total = totalModules || 1

      const { data: progress } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()

      if (!progress) {
        const completionPercentage = Math.round((1 / total) * 100)
        await supabase
          .from('progress')
          .insert({
            user_id: user.id,
            course_id: course.id,
            completed_modules: [moduleNumber],
            current_module: moduleNumber,
            completion_percentage: completionPercentage,
            last_accessed: new Date().toISOString(),
            completed_at: completionPercentage === 100 ? new Date().toISOString() : null,
          })
      } else {
        const existing: number[] = progress.completed_modules || []
        if (!existing.includes(moduleNumber)) {
          const updatedModules = [...existing, moduleNumber].sort((a: number, b: number) => a - b)
          const completionPercentage = Math.round((updatedModules.length / total) * 100)

          await supabase
            .from('progress')
            .update({
              completed_modules: updatedModules,
              current_module: moduleNumber,
              completion_percentage: completionPercentage,
              last_accessed: new Date().toISOString(),
              completed_at: completionPercentage === 100 ? new Date().toISOString() : null,
            })
            .eq('user_id', user.id)
            .eq('course_id', course.id)
        }
      }
    }

    // Recompute remaining attempts including the one just saved, so the
    // client can show "locked after this" / "2 attempts left" accurately.
    const attemptsRemainingAfterThis = passed
      ? lockStatus.maxAttempts
      : Math.max(0, lockStatus.attemptsRemaining - 1)
    const willBeLockedNext = !passed && attemptsRemainingAfterThis === 0

    return NextResponse.json({
      score,
      total_questions: totalQuestions,
      percentage,
      passed,
      attempt_number: attemptNumber,
      attempts_remaining: attemptsRemainingAfterThis,
      locked: willBeLockedNext,
      max_attempts: lockStatus.maxAttempts,
      slug,
      moduleNumber
    })

  } catch (error: any) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}