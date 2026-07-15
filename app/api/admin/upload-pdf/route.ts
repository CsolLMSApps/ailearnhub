// app/api/admin/upload-pdf/route.ts
// Accepts a PDF file upload, stores it in Supabase Storage, returns the public URL.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export async function POST(request: NextRequest) {
  // Verify admin via x-user-email header
  const headersList = await headers()
  const email = headersList.get('x-user-email')?.toLowerCase()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let isAdmin = email ? SUPER_ADMIN_EMAILS.includes(email) : false

  if (!isAdmin && email) {
    const { data } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email)
      .limit(1)
    isAdmin = (data?.length ?? 0) > 0
  }

  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const courseId = formData.get('course_id') as string | null
    const moduleNumber = formData.get('module_number') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
    }
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 400 })
    }

    const safeCourseId = (courseId ?? 'unknown').replace(/[^a-zA-Z0-9-]/g, '')
    const safeModule  = (moduleNumber ?? '0').replace(/[^0-9]/g, '')
    const fileName    = `${safeCourseId}/module-${safeModule}-${Date.now()}.pdf`

    const arrayBuffer = await file.arrayBuffer()
    const buffer      = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('module-pdfs')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('module-pdfs')
      .getPublicUrl(fileName)

    return NextResponse.json({ url: publicUrl })

  } catch (err: any) {
    console.error('PDF upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
