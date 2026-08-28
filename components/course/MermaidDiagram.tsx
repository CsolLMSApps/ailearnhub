'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
}

export default function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!chart || !ref.current) return

    const render = async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#FFF3E0',
            primaryTextColor: '#212121',
            primaryBorderColor: '#FF6F00',
            lineColor: '#FF6F00',
            secondaryColor: '#F5F5F5',
            tertiaryColor: '#ffffff',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '14px',
          },
          flowchart: { curve: 'basis', padding: 20 },
          sequence: { actorMargin: 80 },
        })

        const id = `mermaid-${Math.random().toString(36).slice(2)}`
        const { svg } = await mermaid.render(id, chart.trim())

        if (ref.current) {
          ref.current.innerHTML = svg
          setRendered(true)
          setError(null)
        }
      } catch (e) {
        setError('Unable to render diagram')
        console.error('Mermaid render error:', e)
      }
    }

    render()
  }, [chart])

  if (error) {
    return (
      <div className="my-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        <span className="font-semibold">Diagram error:</span> {error}
        <pre className="mt-2 text-xs text-red-400 whitespace-pre-wrap">{chart}</pre>
      </div>
    )
  }

  return (
    <div className="my-6 flex flex-col items-center">
      <div
        ref={ref}
        className={`w-full overflow-x-auto rounded-xl border border-orange-100 bg-orange-50/30 p-4 transition-opacity duration-300 ${rendered ? 'opacity-100' : 'opacity-0'}`}
      />
      {!rendered && (
        <div className="my-6 flex items-center gap-2 text-sm text-gray-400">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Rendering diagram…
        </div>
      )}
    </div>
  )
}
