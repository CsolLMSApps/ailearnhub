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
              <li>
                <Link href="/verify" className="text-[#FF6F00] hover:text-[#E65100] transition-colors font-medium">
                  🎓 Verify Certificate
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

        {/* Certificate verification callout */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="bg-[#2a2a2a] border border-[#FF6F00]/30 rounded-xl px-6 py-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <p className="text-white font-semibold text-sm">Verify an AI Learn Hub Certificate</p>
                <p className="text-gray-400 text-xs">Instantly confirm the authenticity of any certificate issued by us</p>
              </div>
            </div>
            <Link
              href="/verify"
              className="shrink-0 bg-[#FF6F00] hover:bg-[#E65100] text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors"
            >
              Verify Now →
            </Link>
          </div>

          <p className="text-center text-sm text-gray-400">&copy; 2026 AI Learn Hub LLC. All rights reserved.</p>
        </div>
      </div>

      {/* Directory badges — scrolling strip, list rendered twice for a seamless loop */}
      <div className="border-t border-gray-800 py-6 overflow-hidden">
        <div className="flex w-max animate-badge-marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-10 pr-10 shrink-0">
              <a href="https://smollaunch.com" target="_blank" rel="noopener">
                <img
                  src="https://smollaunch.com/badges/featured.svg"
                  alt="AILearnHub.io — Featured on Smol Launch"
                  loading="lazy"
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="https://alternativeto.net/software/ailearnhub-io/about/?utm_source=badge&utm_medium=referral"
                target="_blank"
                rel="noopener"
              >
                <img
                  src="https://alternativeto.net/static/badges/badge-compact-color.svg"
                  alt="AILearnHub.io | AlternativeTo"
                  loading="lazy"
                  className="h-10 w-auto"
                />
              </a>
              {/* StackShare doesn't provide an embeddable badge image — this is
                  a self-built card linking out to the listing instead. */}
              <a
                href="https://stackshare.io/info8956/ailearnhub"
                target="_blank"
                rel="noopener"
                className="h-10 flex items-center gap-2 px-4 rounded-lg border border-gray-700 bg-[#2a2a2a] hover:border-[#FF6F00] transition-colors"
              >
                <svg className="w-4 h-4 text-[#FF6F00] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2 2 7l10 5 10-5-10-5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2 17 10 5 10-5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2 12 10 5 10-5" />
                </svg>
                <span className="text-sm font-semibold text-white whitespace-nowrap">View us on StackShare</span>
              </a>
              <a href="https://turbo0.com/item/ai-learn-hub" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://img.turbo0.com/badge-listed-light.svg"
                  alt="Listed on Turbo0"
                  loading="lazy"
                  className="h-10 w-auto"
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}