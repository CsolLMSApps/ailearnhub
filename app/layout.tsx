import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import CookieConsent from '@/components/CookieConsent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Learn Hub - Master AI & ChatGPT',
  description: 'Professional AI courses for everyone. Learn ChatGPT, AI automation, and more in hours, not months.',
  keywords: 'AI courses, ChatGPT training, AI education, prompt engineering, AI for beginners',
  authors: [{ name: 'AI Learn Hub' }],
  icons: {
    icon: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  openGraph: {
    title: 'AI Learn Hub - Master AI & ChatGPT',
    description: 'Professional AI courses for everyone',
    url: 'https://ailearnhub.io',
    siteName: 'AI Learn Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Learn Hub - Master AI & ChatGPT',
    description: 'Professional AI courses for everyone',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
