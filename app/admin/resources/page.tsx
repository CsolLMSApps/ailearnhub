// app/admin/resources/page.tsx
// Admin page to upload and manage downloadable resources per course.

export const dynamic = 'force-dynamic'

import { adminFetchAll } from '@/lib/supabase/admin'
import ResourcesClient from './ResourcesClient'

export default async function AdminResourcesPage() {
  const { data: courses } = await adminFetchAll(
    'courses',
    'select=id,title,slug&is_published=eq.true&order=title.asc'
  )

  const { data: resources } = await adminFetchAll(
    'course_resources',
    'select=*&order=course_id.asc,sort_order.asc,created_at.asc'
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Resources</h1>
        <p className="text-sm text-gray-500 mt-1">
          Upload downloadable files for each course. Only enrolled students can download them.
        </p>
      </div>

      <ResourcesClient
        courses={courses ?? []}
        initialResources={resources ?? []}
      />
    </div>
  )
}
