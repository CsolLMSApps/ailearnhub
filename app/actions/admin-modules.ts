'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { adminFetchAll, adminUpsert, adminDeleteRow } from '@/lib/supabase/admin'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

async function getCallerEmail(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('x-user-email')
}

async function isAdmin(email: string): Promise<boolean> {
  if (SUPER_ADMIN_EMAILS.includes(email.toLowerCase())) return true
  const { data } = await adminFetchAll(
    'admin_users',
    `email=eq.${encodeURIComponent(email.toLowerCase())}&select=email`
  )
  return data.length > 0
}

// ── Save (create or update) a module ──────────────────────────────────────────
export async function saveModule(
  _prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const callerEmail = await getCallerEmail()
  if (!callerEmail || !(await isAdmin(callerEmail))) {
    return { error: 'Unauthorized' }
  }

  const course_id         = formData.get('course_id')?.toString().trim()
  const module_number     = parseInt(formData.get('module_number')?.toString() ?? '0')
  const title             = formData.get('title')?.toString().trim()
  const content           = formData.get('content')?.toString() ?? ''
  const content_pdf_url   = formData.get('content_pdf_url')?.toString().trim() ?? ''
  const estimated_minutes = parseInt(formData.get('estimated_minutes')?.toString() ?? '20')

  if (!course_id) return { error: 'Course is required.' }
  if (!module_number || module_number < 1) return { error: 'Module number must be 1 or greater.' }
  if (!title) return { error: 'Module title is required.' }
  if (!content.trim() && !content_pdf_url) return { error: 'Module content or a PDF file is required.' }

  const { error } = await adminUpsert(
    'course_modules',
    { course_id, module_number, title, content, content_pdf_url, estimated_minutes },
    'course_id,module_number'
  )

  if (error) return { error: `Failed to save module: ${error.message}` }

  revalidatePath('/admin/modules')
  return { success: `Module ${module_number} "${title}" saved successfully.` }
}

// ── Delete a module ────────────────────────────────────────────────────────────
export async function deleteModule(
  _prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const callerEmail = await getCallerEmail()
  if (!callerEmail || !(await isAdmin(callerEmail))) {
    return { error: 'Unauthorized' }
  }

  const course_id = formData.get('course_id')?.toString().trim()
  const module_number = formData.get('module_number')?.toString().trim()

  if (!course_id || !module_number) return { error: 'Missing course or module.' }

  const { error } = await adminDeleteRow(
    'course_modules',
    `course_id=eq.${encodeURIComponent(course_id)}&module_number=eq.${module_number}`
  )

  if (error) return { error: `Failed to delete module: ${error.message}` }

  revalidatePath('/admin/modules')
  return { success: `Module ${module_number} deleted.` }
}
