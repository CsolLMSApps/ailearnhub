// app/(marketing)/layout.tsx
// Marketing layout - hides header/footer for authenticated users

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Header handles logged-in vs guest state itself (shows Dashboard/Sign Out or Login/Sign Up)
  // Always render Header + Footer so all marketing pages have consistent navigation
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
