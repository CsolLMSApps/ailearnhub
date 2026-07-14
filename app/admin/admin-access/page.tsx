// app/admin/admin-access/page.tsx — Server component: fetches data, renders client UI

import { adminFetchAll } from '@/lib/supabase/admin'
import AdminAccessClient from './AdminAccessClient'

export const dynamic = 'force-dynamic'

// Permanent superadmins — hardcoded, cannot be removed
const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export default async function AdminAccessPage() {
  const { data: dynamicAdmins, error } = await adminFetchAll(
    'admin_users',
    'select=email,added_by,added_at&order=added_at.asc'
  )

  return (
    <AdminAccessClient
      superAdmins={SUPER_ADMIN_EMAILS}
      dynamicAdmins={dynamicAdmins ?? []}
      fetchError={error?.message ?? null}
    />
  )
}
