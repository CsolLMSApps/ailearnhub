// app/pdf-viewer/page.tsx
// Redirects to the actual PDF viewer route handler at /api/pdf-viewer

import { redirect } from 'next/navigation'

interface Props {
  searchParams: Promise<{ url?: string }>
}

export default async function PdfViewerRedirectPage({ searchParams }: Props) {
  const { url } = await searchParams
  if (url) {
    redirect(`/api/pdf-viewer?url=${encodeURIComponent(url)}`)
  }
  redirect('/api/pdf-viewer')
}
