import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; moduleNumber: string }> }
) {
  try {
    const { slug, moduleNumber } = await params
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

    // Verify user has purchased course
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('status', 'completed')
      .single()

    if (!purchase) {
      return NextResponse.json({ error: 'Course not purchased' }, { status: 403 })
    }

    // Get quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('course_id', course.id)
      .eq('module_number', parseInt(moduleNumber))
      .single()

    if (quizError || !quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    // Get previous quiz results (for attempt number)
    const { data: previousResults } = await supabase
      .from('quiz_results')
      .select('attempt_number, percentage, passed')
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('module_number', parseInt(moduleNumber))
      .order('attempt_number', { ascending: false })
      .limit(1)

    return NextResponse.json({
      quiz: quiz.questions,
      passPercentage: quiz.pass_percentage,
      previousAttempt: previousResults?.[0] || null,
      slug,
      moduleNumber: parseInt(moduleNumber)
    })

  } catch (error: any) {
    console.error('Quiz fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
