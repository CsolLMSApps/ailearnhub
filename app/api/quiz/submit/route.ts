import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

    // Get quiz with correct answers
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', course.id)
      .eq('module_number', moduleNumber)
      .single()

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

    // Get previous attempt number
    const { data: previousResults } = await supabase
      .from('quiz_results')
      .select('attempt_number')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('module_number', moduleNumber)
      .order('attempt_number', { ascending: false })
      .limit(1)

    const attemptNumber = (previousResults?.[0]?.attempt_number || 0) + 1

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

    // If passed, check if we should auto-complete the module
    if (passed) {
      // Get current progress
      const { data: progress } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', course.id)
        .single()

      if (progress && !progress.completed_modules.includes(moduleNumber)) {
        // Add module to completed list
        const updatedModules = [...progress.completed_modules, moduleNumber].sort((a: number, b: number) => a - b)
        
        // Get total modules for percentage calculation
        const { count } = await supabase
          .from('course_modules')
          .select('*', { count: 'exact', head: true })
          .eq('course_id', course.id)

        const completionPercentage = Math.round((updatedModules.length / (count || 1)) * 100)

        // Update progress
        await supabase
          .from('progress')
          .update({
            completed_modules: updatedModules,
            completion_percentage: completionPercentage,
            last_accessed: new Date().toISOString(),
            completed_at: completionPercentage === 100 ? new Date().toISOString() : null
          })
          .eq('user_id', user.id)
          .eq('course_id', course.id)
      }
    }

    return NextResponse.json({
      score,
      total_questions: totalQuestions,
      percentage,
      passed,
      attempt_number: attemptNumber,
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
