'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import dynamic from 'next/dynamic'
import { type ReactNode, Children, isValidElement } from 'react'

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), { ssr: false })

// ─── Callout types ────────────────────────────────────────────────────────────
type CalloutType = 'tip' | 'note' | 'warning' | 'example' | 'keytakeaway' | 'definition'

const CALLOUT_PATTERNS: Record<string, CalloutType> = {
  'TIP':           'tip',
  'NOTE':          'note',
  'WARNING':       'warning',
  'EXAMPLE':       'example',
  'KEY TAKEAWAY':  'keytakeaway',
  'DEFINITION':    'definition',
}

const CALLOUT_STYLES: Record<CalloutType, { bg: string; border: string; label: string; icon: string; text: string }> = {
  tip:          { bg: 'bg-green-50',  border: 'border-green-400',  label: 'Tip',           icon: '💡', text: 'text-green-800'  },
  note:         { bg: 'bg-blue-50',   border: 'border-blue-400',   label: 'Note',          icon: 'ℹ️',  text: 'text-blue-800'   },
  warning:      { bg: 'bg-amber-50',  border: 'border-amber-400',  label: 'Warning',       icon: '⚠️',  text: 'text-amber-800'  },
  example:      { bg: 'bg-purple-50', border: 'border-purple-400', label: 'Example',       icon: '📌', text: 'text-purple-800' },
  keytakeaway:  { bg: 'bg-orange-50', border: 'border-[#FF6F00]',  label: 'Key Takeaway',  icon: '🎯', text: 'text-orange-900' },
  definition:   { bg: 'bg-slate-50',  border: 'border-slate-400',  label: 'Definition',    icon: '📖', text: 'text-slate-800'  },
}

function detectCallout(children: ReactNode): { type: CalloutType; body: ReactNode } | null {
  const arr = Children.toArray(children)
  if (!arr.length) return null

  const first = arr[0]
  if (!isValidElement(first)) return null

  // blockquote wraps children in <p> elements
  const pChildren = Children.toArray((first as React.ReactElement<{ children: ReactNode }>).props.children)
  if (!pChildren.length) return null

  const textNode = pChildren[0]
  const raw = typeof textNode === 'string' ? textNode : ''

  for (const [keyword, type] of Object.entries(CALLOUT_PATTERNS)) {
    if (raw.startsWith(keyword)) {
      // Strip the keyword from the text
      const rest = raw.slice(keyword.length).replace(/^[:\s]+/, '')
      const newFirst = rest
        ? { ...(first as React.ReactElement<{ children: ReactNode }>), props: { ...((first as React.ReactElement<{ children: ReactNode }>).props), children: [rest, ...pChildren.slice(1)] } }
        : arr.slice(1)

      const body = rest ? [newFirst, ...arr.slice(1)] : arr.slice(1)
      return { type, body }
    }
  }
  return null
}

function Callout({ type, children }: { type: CalloutType; children: ReactNode }) {
  const s = CALLOUT_STYLES[type]
  return (
    <div className={`my-5 rounded-xl border-l-4 ${s.border} ${s.bg} px-5 py-4`}>
      <div className={`mb-1.5 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide ${s.text}`}>
        <span>{s.icon}</span>
        <span>{s.label}</span>
      </div>
      <div className={`text-sm leading-relaxed ${s.text}`}>{children}</div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="mt-10 mb-4 text-3xl font-bold text-gray-900 border-b-2 border-orange-100 pb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="mt-8 mb-3 text-2xl font-bold text-gray-900">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-6 mb-2 text-xl font-semibold text-gray-800">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="mt-4 mb-1.5 text-lg font-semibold text-[#FF6F00]">{children}</h4>
        ),

        // Paragraphs
        p: ({ children }) => (
          <p className="mb-4 leading-[1.85] text-gray-700 text-[15px]">{children}</p>
        ),

        // Lists
        ul: ({ children }) => (
          <ul className="mb-4 space-y-2 pl-2 text-gray-700">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-4 space-y-2 pl-2 text-gray-700 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex gap-2 text-[15px] leading-relaxed">
            <span className="mt-[6px] h-2 w-2 shrink-0 rounded-full bg-[#FF6F00]" />
            <span>{children}</span>
          </li>
        ),

        // Horizontal rule
        hr: () => <hr className="my-8 border-t-2 border-orange-100" />,

        // Strong / em
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-600">{children}</em>
        ),

        // Inline code
        code: ({ children, className }) => {
          const lang = className?.replace('language-', '') ?? ''

          // Mermaid block
          if (lang === 'mermaid') {
            return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />
          }

          // Fenced code block with language
          if (lang) {
            return (
              <SyntaxHighlighter
                language={lang}
                style={oneLight}
                customStyle={{
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  margin: '1.25rem 0',
                  border: '1px solid #e5e7eb',
                }}
                showLineNumbers={true}
                lineNumberStyle={{ color: '#9ca3af', fontSize: '0.75rem', userSelect: 'none' }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            )
          }

          // Inline code
          return (
            <code className="rounded bg-orange-50 px-1.5 py-0.5 font-mono text-sm text-[#FF6F00]">
              {children}
            </code>
          )
        },

        // Pre (wrapper for code blocks - delegate to code renderer above)
        pre: ({ children }) => <>{children}</>,

        // Blockquote — detects callout types
        blockquote: ({ children }) => {
          const callout = detectCallout(children)
          if (callout) {
            return <Callout type={callout.type}>{callout.body}</Callout>
          }
          return (
            <blockquote className="my-5 border-l-4 border-[#FF6F00] bg-orange-50/50 pl-5 pr-4 py-3 italic text-gray-600 rounded-r-lg">
              {children}
            </blockquote>
          )
        },

        // Tables
        table: ({ children }) => (
          <div className="my-6 overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-orange-50">{children}</thead>,
        th: ({ children }) => (
          <th className="px-5 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wide">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-5 py-3 text-sm text-gray-600 border-t border-gray-100">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="transition-colors hover:bg-gray-50">{children}</tr>
        ),

        // Images
        img: ({ src, alt }) => (
          <figure className="my-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt ?? ''}
              className="mx-auto max-w-full rounded-xl border border-gray-200 shadow-sm"
            />
            {alt && <figcaption className="mt-2 text-sm text-gray-500 italic">{alt}</figcaption>}
          </figure>
        ),

        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#FF6F00] underline underline-offset-2 hover:text-orange-700 transition-colors"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
