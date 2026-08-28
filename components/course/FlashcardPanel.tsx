'use client'

import { useState, useMemo } from 'react'

interface Flashcard {
  type: 'KEY TAKEAWAY' | 'DEFINITION'
  front: string
  back: string
}

function parseFlashcards(markdown: string): Flashcard[] {
  const cards: Flashcard[] = []

  // Match all blockquote blocks (consecutive lines starting with >)
  const blocks = markdown.match(/(?:^|\n)((?:>[ \t]?[^\n]*(?:\n|$))+)/g) ?? []

  for (const block of blocks) {
    const lines = block
      .trim()
      .split('\n')
      .map(l => l.replace(/^>[ \t]?/, '').trim())
    const nonEmpty = lines.filter(l => l)
    if (!nonEmpty.length) continue

    const label = nonEmpty[0].replace(/\*\*/g, '').trim().toUpperCase()
    if (label !== 'KEY TAKEAWAY' && label !== 'DEFINITION') continue

    const body = nonEmpty
      .slice(1)
      .join(' ')
      .replace(/\*\*/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (body.length < 5) continue

    if (label === 'DEFINITION') {
      const emDash = body.indexOf('—')
      const colon  = body.indexOf(':')
      // Prefer em-dash split, fall back to colon, within first 60 chars
      const split  =
        emDash > 0 && emDash < 60 ? emDash :
        colon  > 0 && colon  < 60 ? colon  : -1

      if (split > 0) {
        cards.push({
          type: 'DEFINITION',
          front: body.slice(0, split).trim(),
          back:  body.slice(split + 1).trim(),
        })
      } else {
        const words = body.split(' ')
        cards.push({
          type: 'DEFINITION',
          front: words.slice(0, 5).join(' '),
          back:  body,
        })
      }
    } else {
      // KEY TAKEAWAY — truncate front to ~45% of words, max 8
      const words = body.split(' ')
      const n = Math.min(8, Math.ceil(words.length * 0.45))
      cards.push({
        type:  'KEY TAKEAWAY',
        front: words.slice(0, n).join(' ') + (words.length > n ? '…' : ''),
        back:  body,
      })
    }
  }

  return cards
}

export default function FlashcardPanel({ content }: { content: string }) {
  const cards = useMemo(() => parseFlashcards(content), [content])

  const [open,    setOpen]    = useState(false)
  const [order,   setOrder]   = useState<number[]>(() => cards.map((_, i) => i))
  const [idx,     setIdx]     = useState(0)
  const [flipped, setFlipped] = useState(false)

  if (!cards.length) return null

  const currentCard = cards[order[idx] ?? 0]
  if (!currentCard) return null

  const flip = () => setFlipped(f => !f)

  const prev = () => {
    setIdx(i => Math.max(0, i - 1))
    setFlipped(false)
  }

  const next = () => {
    setIdx(i => Math.min(cards.length - 1, i + 1))
    setFlipped(false)
  }

  const jump = (n: number) => {
    setIdx(n)
    setFlipped(false)
  }

  const shuffle = () => {
    setOrder(o => {
      const a = [...o]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    })
    setIdx(0)
    setFlipped(false)
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">

      {/* ── Toggle header ── */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2.5 w-full text-left group mb-1"
      >
        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6F00" strokeWidth="2" strokeLinecap="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M12 4v16M2 12h10"/>
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-semibold text-gray-800 text-sm group-hover:text-[#FF6F00] transition-colors">
            Flashcards
          </span>
          <span className="text-gray-400 text-sm font-normal ml-1">({cards.length})</span>
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
        Auto-generated from key takeaways and definitions in this module
      </p>

      {/* ── Card panel ── */}
      {open && (
        <div>
          {/* Badge + counter */}
          <div className="flex items-center justify-between mb-3">
            <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              currentCard.type === 'DEFINITION'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-orange-50 text-[#E65100]'
            }`}>
              {currentCard.type}
            </span>
            <span className="text-xs text-gray-400">{idx + 1} of {cards.length}</span>
          </div>

          {/* Card face */}
          <div
            onClick={flip}
            role="button"
            aria-label={flipped ? 'Card back — click to flip to front' : 'Card front — click to flip to back'}
            className="rounded-2xl border border-gray-200 bg-gray-50 hover:border-[#FF6F00]/40 transition-all cursor-pointer min-h-[160px] flex flex-col items-center justify-center text-center px-8 py-8 mb-4 select-none"
          >
            {!flipped ? (
              <>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                  {currentCard.type === 'DEFINITION' ? 'Term' : 'Concept'}
                </p>
                <p className="text-gray-900 font-semibold text-base leading-snug">
                  {currentCard.front}
                </p>
                <p className="text-[11px] text-gray-300 mt-6 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 4v6h6"/><path d="M23 20v-6h-6"/>
                    <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
                  </svg>
                  Tap to reveal
                </p>
              </>
            ) : (
              <>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">
                  {currentCard.type === 'DEFINITION' ? 'Definition' : 'Full takeaway'}
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentCard.back}
                </p>
              </>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={idx === 0}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5m7-7l-7 7 7 7"/>
              </svg>
              Prev
            </button>

            <button
              onClick={shuffle}
              title="Shuffle cards"
              className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-orange-200 hover:text-[#FF6F00] transition-colors flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 3h5v5"/><path d="M4 20L21 3"/>
                <path d="M21 16v5h-5"/><path d="M15 15l5.1 5.1"/><path d="M4 4l5 5"/>
              </svg>
            </button>

            <button
              onClick={next}
              disabled={idx === cards.length - 1}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#FF6F00] text-white text-sm font-medium hover:bg-[#E65100] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14m-7-7l7 7-7 7"/>
              </svg>
            </button>
          </div>

          {/* Progress dots (only when ≤ 12 cards) */}
          {cards.length <= 12 && (
            <div className="flex justify-center gap-1.5 mt-4">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => jump(i)}
                  aria-label={`Go to card ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === idx
                      ? 'w-4 h-2 bg-[#FF6F00]'
                      : 'w-2 h-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
