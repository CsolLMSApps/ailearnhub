// app/api/notes/route.ts
// GET  — fetch note for a specific module
// POST — upsert (create or update) note

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const courseId     = searchParams.get('course_id')
  const moduleNumber = searchParams.get('module_number')

  if (!courseId || !moduleNumber) {
    return NextResponse.json({ error: 'Missing course_id or module_number' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('student_notes')
    .select('content, updated_at')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('module_number', parseInt(moduleNumber))
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found (fine)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ note: data ?? null })
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { course_id, module_number, content } = await request.json()

  if (!course_id || !module_number) {
    return NextResponse.json({ error: 'Missing course_id or module_number' }, { status: 400 })
  }

  const { error } = await supabase
    .from('student_notes')
    .upsert(
      {
        user_id:       user.id,
        course_id,
        module_number: parseInt(module_number),
        content:       content ?? '',
        updated_at:    new Date().toISOString(),
      },
      { onConflict: 'user_id,course_id,module_number' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
