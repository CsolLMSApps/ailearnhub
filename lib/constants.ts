export const SITE_NAME = 'AI Learn Hub'
export const SITE_DESCRIPTION = 'Master AI tools and automation for professional success'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ailearnhub.io'
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@ailearnhub.io'

export const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD' },
  CAD: { symbol: 'C$', rate: 1.35, label: 'CAD' },
  GBP: { symbol: '£', rate: 0.79, label: 'GBP' },
  AUD: { symbol: 'A$', rate: 1.52, label: 'AUD' },
  INR: { symbol: '₹', rate: 83, label: 'INR' },
} as const

export type CurrencyCode = keyof typeof CURRENCIES

export const DEFAULT_CURRENCY: CurrencyCode = 'USD'

export const QUIZ_PASS_PERCENTAGE = 70

export const REFUND_COMPLETION_THRESHOLD = 50 // Must be less than 50% to request refund

export const SOCIAL_LINKS = {
  twitter: 'https://x.com/DFWITJOBS1',
  linkedin: 'https://linkedin.com/in/ailearnhub',
  facebook: 'https://facebook.com/ailearnhub',
  instagram: 'https://instagram.com/ailearnhub',
}

export const COURSE_LEVELS = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
} as const

export const COURSE_CATEGORIES = {
  'ai-tools': 'AI Tools',
  'automation': 'Automation',
  'productivity': 'Productivity',
  'business': 'Business',
} as const
