// app/admin/quiz/page.tsx

import { adminFetchAll } from '@/lib/supabase/admin'
import QuizEditorClient from './QuizEditorClient'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ courseId?: string; moduleNumber?: string }>
}

export default async function AdminQuizPage({ searchParams }: Props) {
  const { courseId, moduleNumber } = await searchParams

  // Always load courses for the selector
  const { data: courses } = await adminFetchAll(
    'courses',
    'select=id,title,slug&order=title.asc'
  )

  let modules: any[] = []
  let existingQuiz: any = null

  if (courseId) {
    const { data: moduleData } = await adminFetchAll(
      'course_modules',
      `course_id=eq.${courseId}&select=id,module_number,title&order=module_number.asc`
    )
    modules = moduleData

    if (moduleNumber) {
      const { data: quizData } = await adminFetchAll(
        'quizzes',
        `course_id=eq.${courseId}&module_number=eq.${moduleNumber}&select=*&limit=1`
      )
      existingQuiz = quizData[0] ?? null
    }
  }

  return (
    <QuizEditorClient
      courses={courses}
      modules={modules}
      existingQuiz={existingQuiz}
      defaultCourseId={courseId ?? ''}
      defaultModuleNumber={moduleNumber ? parseInt(moduleNumber) : null}
    />
  )
}
