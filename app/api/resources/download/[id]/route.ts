// app/api/resources/download/[id]/route.ts
// Generates a short-lived signed URL for a course resource.
// Only accessible to users who have a completed purchase for that course.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Must be logged in
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the resource to get course_id and file_path
  const { data: resource, error: resErr } = await supabaseAdmin
    .from('course_resources')
    .select('id, course_id, file_path, file_name')
    .eq('id', id)
    .single()

  if (resErr || !resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  // Verify the user has a completed purchase for this course
  const { data: purchase } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', resource.course_id)
    .eq('status', 'completed')
    .limit(1)
    .single()

  if (!purchase) {
    return NextResponse.json({ error: 'You have not purchased this course' }, { status: 403 })
  }

  // Generate signed URL — valid for 5 minutes
  const { data: signed, error: signErr } = await supabaseAdmin.storage
    .from('course-resources')
    .createSignedUrl(resource.file_path, 300, {
      download: resource.file_name,
    })

  if (signErr || !signed?.signedUrl) {
    console.error('Signed URL error:', signErr)
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
  }

  // Redirect to the signed URL — browser starts the download
  return NextResponse.redirect(signed.signedUrl)
}
