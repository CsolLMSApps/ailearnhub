'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), { ssr: false })

// ── Sanitize text for Mermaid mindmap nodes ──────────────────────────────────
// Mermaid mindmap chokes on (), [], {}, ", :, #, and very long text
function sanitize(text: string, maxLen = 42): string {
  return text
    .replace(/[`*_]/g, '')              // strip markdown inline formatting
    .replace(/["()\[\]{}<>:#]/g, '')    // strip Mermaid-special chars
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen)
}

// ── Build Mermaid mindmap syntax from module title + markdown headings ────────
function buildMindmap(title: string, markdown: string): string {
  const root = sanitize(title, 38)

  // Parse h2 (##) and h3 (###) headings — skip ####
  const lines = markdown.split('\n')

  interface Node { level: 2 | 3; text: string }
  const nodes: Node[] = []

  for (const line of lines) {
    // Exact match: ## but not ### or ####
    if (/^##(?!#)/.test(line)) {
      const text = sanitize(line.replace(/^##\s*/, ''))
      if (text) nodes.push({ level: 2, text })
    } else if (/^###(?!#)/.test(line)) {
      const text = sanitize(line.replace(/^###\s*/, ''))
      if (text) nodes.push({ level: 3, text })
    }
  }

  // Fallback: if too few h2 headings, use KEY TAKEAWAY / DEFINITION labels
  const h2Count = nodes.filter(n => n.level === 2).length
  if (h2Count < 2) {
    const calloutRe = /^>\s*(KEY TAKEAWAY|DEFINITION|TIP|NOTE|EXAMPLE|WARNING)/gim
    let m: RegExpExecArray | null
    while ((m = calloutRe.exec(markdown)) !== null) {
      const text = sanitize(m[1])
      if (text && !nodes.some(n => n.text === text)) {
        nodes.push({ level: 2, text })
      }
    }
  }

  // Cap to keep diagram readable
  const MAX_H2      = 7
  const MAX_H3_EACH = 3

  let chart = `mindmap\n  root(("${root}"))\n`
  let h2Idx = 0
  let h3Count = 0

  for (const node of nodes) {
    if (node.level === 2) {
      if (h2Idx >= MAX_H2) continue
      h2Idx++
      h3Count = 0
      chart += `    ${node.text}\n`
    } else {
      if (h2Idx === 0 || h3Count >= MAX_H3_EACH) continue
      h3Count++
      chart += `      ${node.text}\n`
    }
  }

  return chart
}

// ── Component ─────────────────────────────────────────────────────────────────
interface Props {
  title:   string
  content: string
}

export default function MindMapPanel({ title, content }: Props) {
  const [open, setOpen] = useState(false)

  const chart = useMemo(() => buildMindmap(title, content), [title, content])

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">

      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 w-full text-left group mb-1"
      >
        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="2"/>
            <circle cx="5" cy="19" r="2"/>
            <circle cx="19" cy="19" r="2"/>
            <path d="M12 7v4m0 0-5 6m5-6 5 6"/>
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-semibold text-gray-800 text-sm group-hover:text-[#FF6F00] transition-colors">
            Mind map
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
          className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      <p className="text-xs text-gray-400 ml-9 mb-4">
        Visual overview of this module&apos;s key topics
      </p>

      {open && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden p-4">
          <MermaidDiagram chart={chart} />
        </div>
      )}
    </div>
  )
}
