// lib/supabase/is-admin.ts
// Shared helper: returns true if the email is a super-admin OR a dynamic admin in the DB.
// Use this in every admin API route so dynamic admins have full access.

import { adminFetchAll } from '@/lib/supabase/admin'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export async function isAdmin(email: string | null | undefined): Promise<boolean> {
  if (!email) return false
  const lower = email.toLowerCase()
  if (SUPER_ADMIN_EMAILS.includes(lower)) return true

  const { data } = await adminFetchAll(
    'admin_users',
    `email=eq.${encodeURIComponent(lower)}&select=email`
  )
  return data.length > 0
}
