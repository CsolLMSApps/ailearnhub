// app/(marketing)/layout.tsx
// Marketing layout - hides header/footer for authenticated users

import { createServerSupabaseClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // For logged-in users, don't show marketing header/footer
  // The page itself (e.g., courses) will use AuthenticatedLayout
  if (user && user.email) {
    return <>{children}</>
  }

  // For anonymous users, show marketing header/footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
