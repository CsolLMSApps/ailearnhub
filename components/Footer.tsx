import Link from 'next/link'
import { GraduationCap, Mail, Twitter, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">AI Learn Hub</span>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Professional AI courses for busy professionals. Master ChatGPT and AI tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/DFWITJOBS1" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:support@ailearnhub.io" className="text-gray-600 hover:text-blue-600">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold mb-4">Courses</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/courses/chatgpt-mastery" className="text-gray-600 hover:text-blue-600">ChatGPT Mastery</Link></li>
              <li><Link href="/courses/ai-for-beginners" className="text-gray-600 hover:text-blue-600">AI for Beginners</Link></li>
              <li><Link href="/courses" className="text-gray-600 hover:text-blue-600">All Courses</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-600 hover:text-blue-600">About Us</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link></li>
              <li><a href="mailto:support@ailearnhub.io" className="text-gray-600 hover:text-blue-600">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="text-gray-600 hover:text-blue-600">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} AI Learn Hub. All rights reserved.</p>
          <p className="mt-2">Built with ❤️ to help professionals master AI</p>
        </div>
      </div>
    </footer>
  )
}
