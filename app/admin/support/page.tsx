// app/admin/support/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import SupportClient from './SupportClient'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function SupportPage() {
  // Fetch all tickets newest first
  const { data: tickets } = await supabaseAdmin
    .from('support_tickets')
    .select('id, ticket_number, name, email, subject, status, created_at, updated_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="text-sm text-gray-500 mt-1">
          All messages from the contact form. Reply directly from here.
        </p>
      </div>
      <SupportClient tickets={tickets ?? []} />
    </div>
  )
}
