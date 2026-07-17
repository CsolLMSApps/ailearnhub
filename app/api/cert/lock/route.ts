// app/api/cert/lock/route.ts
// Called after a user downloads their certificate.
// Locks course access for non-bundle purchases.

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { courseSlug } = await request.json()
    if (!courseSlug) {
      return NextResponse.json({ error: 'Missing courseSlug' }, { status: 400 })
    }

    // Get course ID
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('slug', courseSlug)
      .single()

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Only lock non-bundle purchases
    const { error } = await adminSupabase
      .from('purchases')
      .update({ certificate_downloaded: true })
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .eq('status', 'completed')
      .eq('is_bundle', false)

    if (error) {
      console.error('Lock error:', error)
      return NextResponse.json({ error: 'Failed to lock course' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Cert lock error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
