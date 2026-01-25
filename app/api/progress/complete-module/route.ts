import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const { courseId, moduleNumber } = await request.json()

    if (!courseId || !moduleNumber) {
      return NextResponse.json(
        { error: 'Course ID and module number are required' },
        { status: 400 }
      )
    }

    // Verify user owns the course
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'completed')
      .single()

    if (!purchase) {
      return NextResponse.json(
        { error: 'Course not purchased' },
        { status: 403 }
      )
    }

    // Get course module count
    const { count: totalModules } = await supabase
      .from('course_modules')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)

    // Get current progress
    let { data: progress } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .single()

    if (!progress) {
      // Create initial progress if it doesn't exist
      const { data: newProgress, error: createError } = await supabase
        .from('progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          current_module: moduleNumber,
          completed_modules: [moduleNumber],
          completion_percentage: totalModules ? Math.round((1 / totalModules) * 100) : 0,
        })
        .select()
        .single()

      if (createError) throw createError

      return NextResponse.json({
        success: true,
        progress: newProgress,
      })
    }

    // Update existing progress
    const completedModules: number[] = progress.completed_modules || []
    
    // Add module if not already completed
    if (!completedModules.includes(moduleNumber)) {
      completedModules.push(moduleNumber)
      completedModules.sort((a: number, b: number) => a - b) // Keep sorted - FIXED TYPE
    }

    // Calculate completion percentage
    const completionPercentage = totalModules 
      ? Math.round((completedModules.length / totalModules) * 100)
      : 0

    // Determine next module (current + 1, or stay on current if this is the last)
    const nextModule = moduleNumber + 1
    const isLastModule = totalModules && completedModules.length === totalModules

    // Update progress
    const { data: updatedProgress, error: updateError } = await supabase
      .from('progress')
      .update({
        completed_modules: completedModules,
        current_module: isLastModule ? moduleNumber : nextModule,
        completion_percentage: completionPercentage,
        completed_at: isLastModule ? new Date().toISOString() : null,
        last_accessed: new Date().toISOString(),
      })
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      progress: updatedProgress,
      isComplete: completionPercentage === 100,
    })

  } catch (error: any) {
    console.error('Error completing module:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete module' },
      { status: 500 }
    )
  }
}
