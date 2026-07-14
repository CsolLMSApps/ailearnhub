// app/admin/modules/page.tsx — Server component: fetches courses + modules, renders editor

import { adminFetchAll } from '@/lib/supabase/admin'
import ModuleEditorClient from './ModuleEditorClient'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ courseId?: string }>
}

export default async function AdminModulesPage({ searchParams }: Props) {
  const { courseId } = await searchParams

  const { data: courses, error: coursesError } = await adminFetchAll(
    'courses',
    'select=id,title,slug,total_modules&order=title.asc'
  )

  const { data: modules, error: modulesError } = await adminFetchAll(
    'course_modules',
    'select=id,course_id,module_number,title,content,estimated_minutes&order=course_id.asc,module_number.asc'
  )

  return (
    <ModuleEditorClient
      courses={courses ?? []}
      allModules={modules ?? []}
      fetchError={coursesError?.message ?? modulesError?.message ?? null}
      defaultCourseId={courseId ?? null}
    />
  )
}
