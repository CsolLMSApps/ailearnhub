// TEMPORARY DEBUG ROUTE — delete after fixing purchase history
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { adminFetchAll } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not logged in', authError })
  }

  // Query 1: authenticated client
  const { data: authPurchases, error: authQueryError } = await supabase
    .from('purchases')
    .select('id, status, course_id, user_id, created_at')
    .eq('user_id', user.id)

  // Query 2: no status filter
  const { data: allStatuses, error: allStatusError } = await supabase
    .from('purchases')
    .select('id, status, course_id, user_id')

  // Query 3: admin raw fetch
  const { data: adminPurchases, error: adminError } = await adminFetchAll(
    'purchases',
    `user_id=eq.${user.id}&select=id,status,course_id`
  )

  // Query 4: admin — no filter, first 10 rows
  const { data: adminAll } = await adminFetchAll(
    'purchases',
    `select=id,status,user_id,course_id&limit=10`
  )

  return NextResponse.json({
    user_id: user.id,
    user_email: user.email,
    authPurchasesCount: authPurchases?.length ?? 0,
    authPurchases,
    authQueryError,
    allStatusesCount: allStatuses?.length ?? 0,
    allStatuses,
    allStatusError,
    adminPurchasesCount: adminPurchases?.length ?? 0,
    adminPurchases,
    adminError,
    adminAllRows: adminAll,
  })
}
