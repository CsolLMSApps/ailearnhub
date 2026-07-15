'use client'

// PdfIframe.tsx
// Auto-resizes to the PDF's full rendered height so no internal scrollbar appears.

import { useEffect, useRef, useState } from 'react'

interface Props {
  src: string
  title: string
}

export default function PdfIframe({ src, title }: Props) {
  const [height, setHeight] = useState(900)
  const ref = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (e.data?.type === 'pdf-height' && typeof e.data.height === 'number') {
        setHeight(e.data.height)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <iframe
      ref={ref}
      src={src}
      title={title}
      style={{
        width: '100%',
        height: `${height}px`,
        border: 'none',
        display: 'block',
        overflow: 'hidden',
      }}
      scrolling="no"
    />
  )
}
