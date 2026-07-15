import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'
import PWARegister from '@/components/PWARegister'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ailearnhub.io'),
  title: {
    default: 'AI Learn Hub - Master AI & ChatGPT with Professional Online Courses',
    template: '%s | AI Learn Hub',
  },
  description: 'Learn AI, ChatGPT, and prompt engineering with expert-led online courses. Master AI-powered productivity, email marketing, social media, and more. Lifetime access, certificates included.',
  keywords: [
    'AI course',
    'ChatGPT course',
    'learn ChatGPT',
    'prompt engineering',
    'AI for beginners',
    'ChatGPT training',
    'artificial intelligence course',
    'online AI course',
    'ChatGPT certification',
    'AI productivity tools',
    'email marketing AI',
    'social media AI',
    'AI course online',
    'ChatGPT mastery',
    'learn AI online',
    'AI education',
    'ChatGPT for professionals',
    'AI marketing course',
    'prompt engineering mastery',
    'AI tools training',
  ],
  authors: [{ name: 'Srikanth Merianda', url: 'https://ailearnhub.io/about' }],
  creator: 'AI Learn Hub LLC',
  publisher: 'AI Learn Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ailearnhub.io',
    siteName: 'AI Learn Hub',
    title: 'AI Learn Hub - Master AI & ChatGPT with Professional Online Courses',
    description: 'Learn AI, ChatGPT, and prompt engineering with expert-led online courses. Master AI-powered productivity, email marketing, social media, and more.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Learn Hub - Master AI & ChatGPT',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Learn Hub - Master AI & ChatGPT with Professional Online Courses',
    description: 'Learn AI, ChatGPT, and prompt engineering with expert-led online courses. Lifetime access, certificates included.',
    site: '@DFWITJOBS1',
    creator: '@DFWITJOBS1',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://ailearnhub.io',
  },
  category: 'education',
  classification: 'Online Education',
  other: {
    'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE', // User needs to add this
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <head>
        <link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6F00" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Learn Hub" />
        {/* Capture install prompt ASAP — before React mounts — so it's never missed */}
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('beforeinstallprompt', function(e) {
            e.preventDefault();
            window.__pwaInstallPrompt = e;
          });
        `}} />
        <GoogleAnalytics />
      </head>
      <body className="antialiased">
        {children}
        <CookieConsent />
        <PWARegister />
      </body>
    </html>
  )
}
