'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { adminFetchAll, adminUpsert, adminDeleteRow } from '@/lib/supabase/admin'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

async function checkAdmin(): Promise<boolean> {
  const headersList = await headers()
  const email = headersList.get('x-user-email')?.toLowerCase()
  if (!email) return false
  if (SUPER_ADMIN_EMAILS.includes(email)) return true
  const { data } = await adminFetchAll(
    'admin_users',
    `email=eq.${encodeURIComponent(email)}&select=email`
  )
  return data.length > 0
}

export async function saveQuiz(
  _prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  if (!(await checkAdmin())) return { error: 'Unauthorized' }

  const course_id      = formData.get('course_id') as string
  const module_number  = parseInt(formData.get('module_number') as string)
  const pass_percentage = parseInt(formData.get('pass_percentage') as string) || 70
  const questionsJson  = formData.get('questions') as string

  if (!course_id || !module_number) return { error: 'Course and module are required' }

  let questions: any[]
  try {
    questions = JSON.parse(questionsJson)
    if (!Array.isArray(questions)) throw new Error('Not an array')
  } catch {
    return { error: 'Invalid questions data' }
  }

  if (questions.length === 0) return { error: 'Add at least one question before saving' }

  // Re-index question IDs so they stay consistent
  const normalised = questions.map((q, i) => ({
    id: q.id || `q${i + 1}`,
    question: q.question,
    options: q.options,
    correct: q.correct,
  }))

  const { error } = await adminUpsert(
    'quizzes',
    { course_id, module_number, questions: normalised, pass_percentage },
    'course_id,module_number'
  )

  if (error) return { error: `Failed to save: ${error.message}` }

  revalidatePath('/admin/quiz')
  return { success: `Quiz saved — ${normalised.length} questions, ${pass_percentage}% to pass` }
}

export async function deleteQuiz(
  _prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  if (!(await checkAdmin())) return { error: 'Unauthorized' }

  const course_id     = formData.get('course_id') as string
  const module_number = formData.get('module_number') as string

  if (!course_id || !module_number) return { error: 'Missing parameters' }

  const { error } = await adminDeleteRow(
    'quizzes',
    `course_id=eq.${course_id}&module_number=eq.${module_number}`
  )

  if (error) return { error: `Failed to delete: ${error.message}` }

  revalidatePath('/admin/quiz')
  return { success: 'Quiz deleted for this module' }
}
