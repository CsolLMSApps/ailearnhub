// app/(marketing)/contact/page.tsx
// Contact page with smart form - FIXED TypeScript error

import { createServerSupabaseClient } from '@/lib/supabase/server'
import AuthenticatedLayout from '@/components/layouts/AuthenticatedLayout'
import ContactForm from '@/components/contact/ContactForm'

export default async function ContactPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  // For logged-in users, use authenticated layout
  if (user && user.email) {
    return (
      <AuthenticatedLayout user={{ email: user.email, user_metadata: user.user_metadata }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-gray-600">
              Have questions? We're here to help.
            </p>
          </div>
          <ContactForm 
            defaultName={user.user_metadata?.full_name || ''}
            defaultEmail={user.email}
            isAuthenticated={true}
          />
        </div>
      </AuthenticatedLayout>
    )
  }

  // For anonymous users, show marketing layout
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/" className="text-2xl font-bold text-[#FF6F00]">AI Learn Hub</a>
            <nav className="flex items-center gap-6">
              <a href="/courses" className="text-gray-700 hover:text-[#FF6F00]">Courses</a>
              <a href="/pricing" className="text-gray-700 hover:text-[#FF6F00]">Pricing</a>
              <a href="/contact" className="text-[#FF6F00] font-medium">Contact</a>
              <a href="/auth/login" className="text-gray-700 hover:text-[#FF6F00]">Login</a>
              <a href="/auth/signup" className="bg-[#FF6F00] text-white px-4 py-2 rounded-lg hover:bg-[#E65100]">Get Started</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600">Have questions? We're here to help.</p>
        </div>
        <ContactForm isAuthenticated={false} />
      </div>

      <footer className="bg-[#212121] text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 AI Learn Hub LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
