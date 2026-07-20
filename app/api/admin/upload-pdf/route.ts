// app/api/admin/upload-pdf/route.ts
// Accepts a PDF file upload, stores it in Supabase Storage, extracts text as markdown.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { isAdmin } from '@/lib/supabase/is-admin'
import { createServerSupabaseClient } from '@/lib/supabase/server'

// ── Text → Markdown converter ────────────────────────────────────────────────
function pdfTextToMarkdown(raw: string): string {
  const lines = raw.split('\n').map(l => l.trimEnd())
  const out: string[] = []
  let prevWasBlank = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    // Skip empty lines (collapse to one blank)
    if (!line) {
      if (!prevWasBlank && out.length > 0) out.push('')
      prevWasBlank = true
      continue
    }
    prevWasBlank = false

    // Skip lone page numbers or very short decorative artifacts
    if (/^\d{1,3}$/.test(line) && line.length <= 3) continue
    if (/^Page \d+( of \d+)?$/i.test(line)) continue
    if (line.length < 2) continue

    // Numbered section headings like "7.1 Claude — Best for..." or "1.2.3 Something"
    if (/^\d+\.\d+(\.\d+)?\s+\S/.test(line) && line.length < 120) {
      out.push(`\n### ${line}\n`)
      continue
    }

    // Module-level heading patterns: "MODULE 1 • AI LEARN HUB", "SECTION 2: ..."
    if (/^(MODULE|SECTION|CHAPTER|UNIT|PART)\s+\d+/i.test(line) && line.length < 80) {
      out.push(`\n## ${line}\n`)
      continue
    }

    // Known section title patterns
    if (
      /^(What You'?ll Learn|Key Takeaways?|Learning Objectives?|Summary|Introduction|Conclusion|Overview|Key Points?|Practice|Exercise|Activity|Note:|Important:|Tip:|Warning:|Reminder:)/i.test(line) &&
      line.length < 80
    ) {
      out.push(`\n## ${line}\n`)
      continue
    }

    // Short all-caps line (likely a heading, e.g. "WHAT IS AI?")
    if (
      line === line.toUpperCase() &&
      /[A-Z]/.test(line) &&
      line.length >= 4 &&
      line.length <= 70 &&
      !/^[\d\s\W]+$/.test(line)
    ) {
      out.push(`\n## ${line}\n`)
      continue
    }

    // Standalone short line that reads like a heading (Title Case, no punctuation at end)
    // and previous line was blank → treat as heading
    if (
      out[out.length - 1] === '' &&
      line.length < 80 &&
      !line.endsWith('.') &&
      !line.endsWith(',') &&
      /^[A-Z]/.test(line) &&
      line.split(' ').length <= 10
    ) {
      // peek ahead: if next non-empty line starts a body sentence → heading
      const next = lines.slice(i + 1).find(l => l.trim().length > 0)?.trim() ?? ''
      if (next.length > 30 || /^[•\-\*]/.test(next)) {
        out.push(`\n## ${line}\n`)
        continue
      }
    }

    // Bullet points (•, ·, ○, –, -, *)
    if (/^[•·○●–\-\*]\s/.test(line)) {
      out.push(`- ${line.slice(line.indexOf(' ') + 1).trim()}`)
      continue
    }

    // Numbered list items "1. Something" or "1) Something"
    if (/^\d+[\.\)]\s+\S/.test(line)) {
      out.push(line)
      continue
    }

    // Bold label pattern "Term: explanation" → **Term**: explanation
    if (/^[A-Z][^:]{1,30}:\s+\S/.test(line) && !line.includes('.')) {
      const colonIdx = line.indexOf(':')
      const label = line.slice(0, colonIdx)
      const rest = line.slice(colonIdx + 1).trim()
      out.push(`**${label}**: ${rest}`)
      continue
    }

    // Regular paragraph line
    out.push(line)
  }

  // Collapse 3+ consecutive blanks to 1
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.email))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

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

    // ── Upload to Supabase Storage ──
    const { error: uploadError } = await adminClient.storage
      .from('module-pdfs')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = adminClient.storage
      .from('module-pdfs')
      .getPublicUrl(fileName)

    // ── Extract text from PDF ──
    let extractedContent = ''
    try {
      // Dynamic import so build doesn't break if types aren't resolved yet
      const pdfParse = (await import('pdf-parse')).default
      const parsed = await pdfParse(buffer)
      extractedContent = pdfTextToMarkdown(parsed.text)
    } catch (parseErr) {
      console.warn('PDF text extraction failed (non-fatal):', parseErr)
      // Fall through — extractedContent stays ''
    }

    return NextResponse.json({ url: publicUrl, extractedContent })

  } catch (err: any) {
    console.error('PDF upload error:', err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
