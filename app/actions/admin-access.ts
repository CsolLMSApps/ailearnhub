'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { adminFetchAll, adminUpsert, adminDeleteRow } from '@/lib/supabase/admin'

// Hardcoded superadmins — cannot be removed via the UI
const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

/** Verify the calling user is an admin before allowing mutations */
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

export async function addAdminEmail(
  _prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const callerEmail = await getCallerEmail()
  if (!callerEmail || !(await isAdmin(callerEmail))) {
    return { error: 'Unauthorized' }
  }

  const raw = formData.get('email')?.toString().trim().toLowerCase() ?? ''
  if (!raw) return { error: 'Email address is required.' }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    return { error: 'Please enter a valid email address.' }
  }

  // Don't allow adding superadmins (they're already permanent)
  if (SUPER_ADMIN_EMAILS.includes(raw)) {
    return { error: 'This email already has permanent admin access.' }
  }

  const { error } = await adminUpsert(
    'admin_users',
    { email: raw, added_by: callerEmail },
    'email'
  )

  if (error) return { error: `Failed to add admin: ${error.message}` }

  revalidatePath('/admin/admin-access')
  return { success: `${raw} has been granted admin access.` }
}

export async function removeAdminEmail(
  _prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const callerEmail = await getCallerEmail()
  if (!callerEmail || !(await isAdmin(callerEmail))) {
    return { error: 'Unauthorized' }
  }

  const raw = formData.get('email')?.toString().trim().toLowerCase() ?? ''
  if (!raw) return { error: 'Email is required.' }

  // Cannot remove superadmins via UI
  if (SUPER_ADMIN_EMAILS.includes(raw)) {
    return { error: 'Permanent admin accounts cannot be removed from here.' }
  }

  const { error } = await adminDeleteRow(
    'admin_users',
    `email=eq.${encodeURIComponent(raw)}`
  )

  if (error) return { error: `Failed to remove admin: ${error.message}` }

  revalidatePath('/admin/admin-access')
  return { success: `${raw} has been removed from admin access.` }
}
