// components/BackButton.tsx
// Reusable back navigation button used across all pages

import Link from 'next/link'

interface BackButtonProps {
  href: string
  label: string
}

export function BackButton({ href, label }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-[#FF6F00] hover:text-[#E65100] hover:underline text-sm font-medium transition-colors"
    >
      ← {label}
    </Link>
  )
}
