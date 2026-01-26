// components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#212121] text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-[#FF6F00] mb-4">AI Learn Hub</h3>
            <p className="text-gray-400 text-sm">
              Master AI tools and boost your productivity with expert-led courses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-gray-400 hover:text-[#FF6F00] transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-[#FF6F00] transition-colors">
                  Contact Form
                </Link>
              </li>
              <li>
                <a href="mailto:support@ailearnhub.io" className="hover:text-[#FF6F00] transition-colors">
                  support@ailearnhub.io
                </a>
              </li>
              <li>Austin, Texas, USA</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 AI Learn Hub LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
