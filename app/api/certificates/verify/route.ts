// app/api/certificates/verify/route.ts
// Public API — verifies a certificate by certificate_number.
// Returns only safe public fields. Never exposes user_id or email.
// Normalizes input: accepts IDs with or without hyphens.

import { NextRequest, NextResponse } from 'next/server'
import { adminFetch } from '@/lib/supabase/admin'

/**
 * Returns candidate certificate IDs to try:
 * 1. The original input (as-is, uppercased)
 * 2. With all hyphens/spaces stripped
 * 3. Reformatted with dashes in the correct positions (AIH-TTTTTTTT-UUUUUU-CCCC)
 *    if the stripped value is exactly 21 chars and starts with AIH
 */
function candidateIds(raw: string): string[] {
  const base = raw.trim().toUpperCase()
  const stripped = base.replace(/[-\s]/g, '')
  const candidates = new Set<string>([base, stripped])

  // Standard format: AIH(3) + ts(8) + uid(6) + cid(4) = 21 chars
  if (stripped.length === 21 && stripped.startsWith('AIH')) {
    candidates.add(
      `${stripped.slice(0, 3)}-${stripped.slice(3, 11)}-${stripped.slice(11, 17)}-${stripped.slice(17)}`
    )
  }

  return [...candidates]
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('id')

  if (!raw?.trim()) {
    return NextResponse.json({ error: 'Certificate number is required' }, { status: 400 })
  }

  // Try each candidate ID until one matches
  let cert: any = null
  for (const candidate of candidateIds(raw)) {
    const { data, error } = await adminFetch(
      'certificates',
      `certificate_number=eq.${encodeURIComponent(candidate)}&select=certificate_number,student_name,course_title,issued_at,created_at&limit=1`
    )
    if (!error && data) { cert = data; break }
  }

  if (!cert) {
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
