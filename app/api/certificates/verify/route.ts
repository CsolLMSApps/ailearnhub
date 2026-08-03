// app/api/certificates/verify/route.ts
// Public API — verifies a certificate by certificate_number.
// Returns only safe public fields. Never exposes user_id or email.

import { NextRequest, NextResponse } from 'next/server'
import { adminFetch } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const certNumber = searchParams.get('id')?.trim().toUpperCase()

  if (!certNumber) {
    return NextResponse.json({ error: 'Certificate number is required' }, { status: 400 })
  }

  const { data: cert, error } = await adminFetch(
    'certificates',
    `certificate_number=eq.${encodeURIComponent(certNumber)}&select=certificate_number,student_name,course_title,issued_at,created_at&limit=1`
  )

  if (error || !cert) {
    return NextResponse.json({ valid: false }, { status: 200 })
  }

  const issuedAt = cert.issued_at || cert.created_at
  return NextResponse.json({
    valid: true,
    certificateNumber: cert.certificate_number,
    studentName:       cert.student_name,
    courseTitle:       cert.course_title,
    issuedAt,
  })
}
