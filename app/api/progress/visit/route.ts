import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// Marks a module as visited/complete.
// Called automatically when user opens a module page (for non-final modules only).
// Final module is only completed via /api/quiz/submit after passing.

export async function POST(request: NextRequest) {
  try {
    const { slug, moduleNumber } = await request.json()
    const supabase = await createServerSupabaseClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

    // Total module count — needed to calculate completion percentage
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
      // First time visiting any module — create record
      await supabase.from('progress').insert({
        user_id: user.id,
        course_id: course.id,
        completed_modules: [moduleNumber],
        current_module: moduleNumber,
        completion_percentage: Math.round((1 / total) * 100),
        last_accessed: new Date().toISOString(),
        completed_at: null,
      })
    } else {
      const existing: number[] = progress.completed_modules || []

      if (!existing.includes(moduleNumber)) {
        // Add this module to completed list
        const updated = [...existing, moduleNumber].sort((a, b) => a - b)
        const pct = Math.round((updated.length / total) * 100)

        await supabase
          .from('progress')
          .update({
            completed_modules: updated,
            current_module: moduleNumber,
            completion_percentage: pct,
            last_accessed: new Date().toISOString(),
            // Only set completed_at when truly 100% (quiz passed on final module)
            completed_at: pct === 100 ? new Date().toISOString() : progress.completed_at,
          })
          .eq('user_id', user.id)
          .eq('course_id', course.id)
      } else {
        // Already marked — just update current position
        await supabase
          .from('progress')
          .update({
            current_module: moduleNumber,
            last_accessed: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('course_id', course.id)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('progress/visit error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
