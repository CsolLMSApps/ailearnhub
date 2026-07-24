// app/api/admin/delete-resource/route.ts
// Admin-only: deletes a resource from both Supabase Storage and the DB.

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

export async function DELETE(request: NextRequest) {
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
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    // Fetch the resource to get its file_path
    const { data: resource, error: fetchErr } = await supabaseAdmin
      .from('course_resources')
      .select('file_path')
      .eq('id', id)
      .single()

    if (fetchErr || !resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
    }

    // Delete from storage
    await supabaseAdmin.storage
      .from('course-resources')
      .remove([resource.file_path])

    // Delete from DB
    const { error: dbErr } = await supabaseAdmin
      .from('course_resources')
      .delete()
      .eq('id', id)

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
