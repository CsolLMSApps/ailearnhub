'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { adminFetchAll, adminDeleteRow } from '@/lib/supabase/admin'

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

// ── Delete a course and all its modules ───────────────────────────────────────
export async function deleteCourse(
  _prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const callerEmail = await getCallerEmail()
  if (!callerEmail || !(await isAdmin(callerEmail))) {
    return { error: 'Unauthorized' }
  }

  const course_id = formData.get('course_id')?.toString().trim()
  const course_title = formData.get('course_title')?.toString().trim()

  if (!course_id) return { error: 'Course ID is required.' }

  // Delete all modules for this course first
  await adminDeleteRow('course_modules', `course_id=eq.${encodeURIComponent(course_id)}`)

  // Then delete the course itself
  const { error } = await adminDeleteRow('courses', `id=eq.${encodeURIComponent(course_id)}`)

  if (error) return { error: `Failed to delete course: ${error.message}` }

  revalidatePath('/admin/courses')
  revalidatePath('/admin/modules')
  return { success: `Course "${course_title}" and all its modules have been deleted.` }
}
