import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-[#FF6F00] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <span className="text-xl font-bold text-white">AI Learn Hub</span>
            </div>
            <p className="text-sm text-gray-400">
              Master AI tools and transform your career with professional courses designed for real-world success.
            </p>
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-white font-semibold mb-4">Courses</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses/chatgpt-mastery" className="hover:text-[#FF6F00] transition-colors">
                  ChatGPT Mastery
                </Link>
              </li>
              <li>
                <Link href="/courses/ai-for-beginners" className="hover:text-[#FF6F00] transition-colors">
                  AI for Beginners
                </Link>
              </li>
              <li>
                <Link href="/courses/social-media-marketing-ai" className="hover:text-[#FF6F00] transition-colors">
                  Social Media Marketing
                </Link>
              </li>
              <li>
                <Link href="/courses/email-marketing-ai" className="hover:text-[#FF6F00] transition-colors">
                  Email Marketing with AI
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-[#FF6F00] transition-colors">
                  View All Courses →
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#FF6F00] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#FF6F00] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a 
                  href="https://x.com/DFWITJOBS1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#FF6F00] transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@ailearnhub.io" 
                  className="hover:text-[#FF6F00] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="hover:text-[#FF6F00] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#FF6F00] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#FF6F00] transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-[#FF6F00] transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/affiliate-agreement" className="hover:text-[#FF6F00] transition-colors">
                  Affiliate Agreement
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              © {currentYear} AI Learn Hub. All rights reserved.
            </p>
            <p className="mt-4 md:mt-0">
              Made with 🧡 for AI learners everywhere
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
