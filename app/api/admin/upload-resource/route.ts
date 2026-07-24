// app/api/admin/upload-resource/route.ts
// Admin-only: receives a multipart form POST, uploads the file to
// Supabase Storage (bucket: course-resources), then saves metadata
// to the course_resources table.
//
// Auth: x-user-email header must be a super-admin or admin_users entry.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  // Auth check
  const headersList = await headers()
  const userEmail = headersList.get('x-user-email')?.toLowerCase()
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(userEmail)
  if (!isSuperAdmin) {
    const { data } = await supabaseAdmin
      .from('admin_users')
      .select('email')
      .eq('email', userEmail)
      .limit(1)
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  try {
    const formData = await request.formData()
    const file       = formData.get('file') as File | null
    const courseId   = (formData.get('course_id') as string || '').trim()
    const name       = (formData.get('name') as string || '').trim()
    const description = (formData.get('description') as string || '').trim()
    const sortOrder  = parseInt(formData.get('sort_order') as string || '0', 10)

    if (!file || !courseId || !name) {
      return NextResponse.json({ error: 'file, course_id and name are required' }, { status: 400 })
    }

    // Build a safe storage path: courses/{courseId}/{timestamp}-{filename}
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const filePath = `courses/${courseId}/${Date.now()}-${safeName}`

    // Convert File to ArrayBuffer then Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('course-resources')
      .upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Save metadata to course_resources table
    const { data: resource, error: dbError } = await supabaseAdmin
      .from('course_resources')
      .insert({
        course_id: courseId,
        name,
        description: description || null,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type || 'application/octet-stream',
        file_size_bytes: file.size,
        sort_order: sortOrder,
      })
      .select()
      .single()

    if (dbError) {
      // Clean up the uploaded file if DB save fails
      await supabaseAdmin.storage.from('course-resources').remove([filePath])
      console.error('DB insert error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, resource })

  } catch (err: any) {
    console.error('upload-resource error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
