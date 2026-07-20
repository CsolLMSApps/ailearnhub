'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { saveModule, deleteModule } from '@/app/actions/admin-modules'

interface Course {
  id: string
  title: string
  slug: string
  total_modules: number
}

interface Module {
  id: string
  course_id: string
  module_number: number
  title: string
  content: string
  content_pdf_url?: string
  estimated_minutes: number
}

interface Props {
  courses: Course[]
  allModules: Module[]
  fetchError: string | null
  defaultCourseId?: string | null
}

const initialState = { error: undefined, success: undefined }

// ── Client-side PDF → Markdown extraction using PDF.js ──────────────────────

function loadPdfJs(): Promise<any> {
  const w = window as any
  if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    s.onload = () => {
      w.pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      resolve(w.pdfjsLib)
    }
    s.onerror = reject
    document.head.appendChild(s)
  })
}

async function extractMarkdownFromPdf(file: File): Promise<string> {
  const pdfjs = await loadPdfJs()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise

  type RawItem = { str: string; fontSize: number; x: number; y: number; w: number }
  type Line = { items: RawItem[]; y: number; topY: number }

  const allMd: string[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 1 })
    const pageWidth = viewport.width
    const pageHeight = viewport.height
    const tc = await page.getTextContent({ normalizeWhitespace: true })

    // Parse items for this page
    const rawItems: RawItem[] = (tc.items as any[])
      .filter(i => i.str?.trim().length > 0)
      .map(i => ({
        str: i.str.trim(),
        fontSize: Math.abs(i.transform?.[0] ?? 12),
        x: i.transform?.[4] ?? 0,
        y: i.transform?.[5] ?? 0,
        w: i.width ?? 0,
      }))

    if (!rawItems.length) continue

    // Average font size (trim outliers)
    const fontSizes = rawItems.map(i => i.fontSize).filter(s => s > 4 && s < 72)
    const avgFont = fontSizes.length
      ? fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length
      : 12

    // Group items into lines by PDF y (bottom-up), within 3pt
    const lineMap: Map<number, RawItem[]> = new Map()
    for (const item of rawItems) {
      const yKey = Math.round(item.y)
      let matched = false
      for (const k of lineMap.keys()) {
        if (Math.abs(k - yKey) <= 3) {
          lineMap.get(k)!.push(item)
          matched = true
          break
        }
      }
      if (!matched) lineMap.set(yKey, [item])
    }

    // Sort lines top→bottom (descending PDF y = ascending page position)
    const lines: Line[] = [...lineMap.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([y, items]) => ({
        y,
        topY: pageHeight - y,
        items: items.sort((a, b) => a.x - b.x),
      }))
      // Strip page header/footer (top 7% and bottom 7%)
      .filter(l => l.topY / pageHeight > 0.07 && l.topY / pageHeight < 0.93)

    if (!lines.length) continue

    // Median line gap (typical line height for this page)
    const yGaps = lines.slice(1)
      .map((l, i) => l.topY - lines[i].topY)
      .filter(g => g > 0 && g < 40)
    yGaps.sort((a, b) => a - b)
    const medianGap = yGaps.length ? yGaps[Math.floor(yGaps.length / 2)] : 14

    // ── Helper: detect table columns in a line ──────────────────────
    // Returns array of cell strings if multiple columns detected, else null
    function getTableCells(lineItems: RawItem[]): string[] | null {
      if (lineItems.length < 2) return null
      const sorted = [...lineItems].sort((a, b) => a.x - b.x)
      const colGapThreshold = pageWidth * 0.10 // 10% of page width = column gap
      const cols: string[] = []
      let cell = sorted[0].str
      for (let k = 1; k < sorted.length; k++) {
        // Gap = distance from end of previous item to start of next
        const prevEnd = sorted[k - 1].x + sorted[k - 1].w
        const gap = sorted[k].x - prevEnd
        if (gap > colGapThreshold) {
          cols.push(cell.trim())
          cell = sorted[k].str
        } else {
          cell += ' ' + sorted[k].str
        }
      }
      cols.push(cell.trim())
      return cols.length >= 2 ? cols : null
    }

    // ── Process lines ────────────────────────────────────────────────
    const pageMd: string[] = []
    let li = 0

    while (li < lines.length) {
      const line = lines[li]
      const lineText = line.items.map(i => i.str).join(' ').trim()

      // Skip junk: bare numbers (page numbers), very short lines
      if (!lineText || lineText.length < 2) { li++; continue }
      if (/^\d{1,4}$/.test(lineText)) { li++; continue }
      if (/^Page \d+/i.test(lineText)) { li++; continue }
      // Skip footer-style lines (contains •, ·, ©, and is short)
      if (lineText.length < 80 && /[•·©®]/.test(lineText) && lineText.split(' ').length < 10 && li > lines.length - 4) {
        li++; continue
      }

      // ── Divider line (---, ___, ===) ────────────────────────────
      if (/^[-_=]{3,}$/.test(lineText.replace(/\s/g, ''))) {
        if (pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
        pageMd.push('---')
        pageMd.push('')
        li++; continue
      }

      // ── Table detection ─────────────────────────────────────────
      const cells = getTableCells(line.items)
      if (cells && cells.length >= 2) {
        // Collect consecutive table rows with same column count
        const tableRows: string[][] = [cells]
        let tj = li + 1
        while (tj < lines.length) {
          const nextLine = lines[tj]
          const nextText = nextLine.items.map(i => i.str).join(' ').trim()
          if (!nextText || nextText.length < 2) { tj++; continue }
          if (/^\d{1,4}$/.test(nextText)) { tj++; break }
          const nextCells = getTableCells(nextLine.items)
          const yGap = nextLine.topY - lines[tj - 1].topY
          if (nextCells && yGap < medianGap * 4) {
            // Pad/trim to match header column count
            while (nextCells.length < cells.length) nextCells.push('')
            tableRows.push(nextCells.slice(0, cells.length))
            tj++
          } else {
            break
          }
        }

        if (tableRows.length >= 2) {
          // Emit markdown table
          if (pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
          const header = tableRows[0]
          pageMd.push('| ' + header.join(' | ') + ' |')
          pageMd.push('| ' + header.map(() => '---').join(' | ') + ' |')
          for (const row of tableRows.slice(1)) {
            pageMd.push('| ' + row.join(' | ') + ' |')
          }
          pageMd.push('')
          li = tj
          continue
        }
      }

      // ── Single bullet character (PDF puts • on its own item) ─────
      const isSoloBullet = /^[•·○●–]$/.test(lineText) || lineText === '-' || lineText === '*'
      if (isSoloBullet && li + 1 < lines.length) {
        const nextLine = lines[li + 1]
        const nextText = nextLine.items.map(i => i.str).join(' ').trim()
        const yGap = nextLine.topY - line.topY
        if (yGap <= medianGap * 1.8) {
          // Merge bullet + text, then look for continuation lines
          let bulletText = nextText
          let cj = li + 2
          while (cj < lines.length) {
            const cl = lines[cj]
            const ct = cl.items.map(i => i.str).join(' ').trim()
            if (!ct) break
            const cGap = cl.topY - lines[cj - 1].topY
            if (cGap > medianGap * 1.8) break
            if (/^[•·○●–\-\*\d#]/.test(ct) || /^[•·○●–]$/.test(ct)) break
            bulletText += ' ' + ct
            cj++
          }
          pageMd.push(`- ${bulletText}`)
          li = cj
          continue
        }
      }

      // ── Bullet line with text ────────────────────────────────────
      if (/^[•·○●–\-\*]\s/.test(lineText)) {
        let bulletText = lineText.slice(lineText.indexOf(' ') + 1).trim()
        // Merge continuation lines (wrapped bullet text)
        let cj = li + 1
        while (cj < lines.length) {
          const cl = lines[cj]
          const ct = cl.items.map(i => i.str).join(' ').trim()
          if (!ct) break
          const cGap = cl.topY - lines[cj - 1].topY
          if (cGap > medianGap * 1.8) break
          if (/^[•·○●–\-\*\d#]/.test(ct)) break
          const nextCells = getTableCells(cl.items)
          if (nextCells) break
          bulletText += ' ' + ct
          cj++
        }
        pageMd.push(`- ${bulletText}`)
        li = cj
        continue
      }

      // ── Numbered list ────────────────────────────────────────────
      if (/^\d+[\.\)]\s+\S/.test(lineText)) {
        pageMd.push(lineText)
        li++; continue
      }

      // ── Heading detection (conservative) ─────────────────────────
      const maxFont = Math.max(...line.items.map(i => i.fontSize))
      const wordCount = lineText.split(/\s+/).length
      const noTrailPunct = !/[.,;]$/.test(lineText)
      const isAllCaps = lineText === lineText.toUpperCase() && /[A-Z]/.test(lineText) && !/^\d/.test(lineText)
      // Check gap from previous line
      const prevTopY = li > 0 ? lines[li - 1].topY : 0
      const gapFromPrev = li > 0 ? line.topY - prevTopY : 0
      const afterBigGap = gapFromPrev > medianGap * 2.5

      // H1: large font, short
      if (maxFont >= avgFont * 1.5 && lineText.length < 120 && noTrailPunct) {
        if (pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
        pageMd.push(`# ${lineText}`)
        pageMd.push('')
        li++; continue
      }
      // H2: medium-large font, short, few words, no trailing period
      if (maxFont >= avgFont * 1.18 && wordCount <= 12 && lineText.length < 120 && noTrailPunct) {
        if (pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
        pageMd.push(`## ${lineText}`)
        pageMd.push('')
        li++; continue
      }
      // All-caps short line → H2
      if (isAllCaps && wordCount <= 8 && lineText.length < 80) {
        if (pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
        pageMd.push(`## ${lineText}`)
        pageMd.push('')
        li++; continue
      }
      // Short line after big gap that reads like a heading (title-case, no trailing punct, few words)
      if (afterBigGap && wordCount <= 6 && lineText.length < 60 && noTrailPunct && /^[A-Z]/.test(lineText)) {
        if (pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
        pageMd.push(`## ${lineText}`)
        pageMd.push('')
        li++; continue
      }

      // ── Regular paragraph — merge wrapped lines ──────────────────
      let paraText = lineText
      // Merge continuation if current line doesn't end a sentence
      if (!lineText.endsWith('.') && !lineText.endsWith('!') && !lineText.endsWith('?') && lineText.length > 10) {
        let cj = li + 1
        while (cj < lines.length) {
          const cl = lines[cj]
          const ct = cl.items.map(i => i.str).join(' ').trim()
          if (!ct) break
          const cGap = cl.topY - lines[cj - 1].topY
          if (cGap > medianGap * 1.9) break
          if (/^[•·○●–\-\*\d#]/.test(ct) || /^[•·○●–]$/.test(ct)) break
          const nextCells = getTableCells(cl.items)
          if (nextCells) break
          // Check if next line looks like a heading (large font)
          const nextMaxFont = Math.max(...cl.items.map(i => i.fontSize))
          if (nextMaxFont >= avgFont * 1.18) break
          paraText += ' ' + ct
          li = cj
          if (ct.endsWith('.') || ct.endsWith('!') || ct.endsWith('?')) { cj++; break }
          cj++
        }
      }

      if (afterBigGap && pageMd.length && pageMd[pageMd.length - 1] !== '') pageMd.push('')
      pageMd.push(paraText)
      li++
    }

    // Add page content with a blank line separator
    if (pageMd.length) {
      if (allMd.length && allMd[allMd.length - 1] !== '') allMd.push('')
      allMd.push(...pageMd)
    }
  }

  return allMd.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ModuleEditorClient({ courses, allModules, fetchError, defaultCourseId }: Props) {
  const [saveState, saveAction, savePending] = useActionState(saveModule, initialState)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteModule, initialState)

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    defaultCourseId && courses.find(c => c.id === defaultCourseId) ? defaultCourseId : (courses[0]?.id ?? '')
  )
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const arrivedFromNewCourse = !!defaultCourseId && allModules.filter(m => m.course_id === defaultCourseId).length === 0
  const [isAddingNew, setIsAddingNew] = useState(arrivedFromNewCourse)

  // PDF upload state
  const [contentTab, setContentTab] = useState<'markdown' | 'pdf'>('markdown')
  const [pdfUrl, setPdfUrl]         = useState<string>('')
  const [pdfFile, setPdfFile]       = useState<File | null>(null)
  const [uploading, setUploading]   = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  // Extracted / typed markdown content
  const [markdownContent, setMarkdownContent] = useState<string>('')
  // Extraction state
  const [extracting, setExtracting] = useState(false)
  const [extractError, setExtractError] = useState('')

  const formRef    = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const courseModules = allModules
    .filter(m => m.course_id === selectedCourseId)
    .sort((a, b) => a.module_number - b.module_number)

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  const nextModuleNumber = courseModules.length > 0
    ? Math.max(...courseModules.map(m => m.module_number)) + 1
    : 1

  // Clear form on save success
  useEffect(() => {
    if (saveState.success) {
      setEditingModule(null)
      setIsAddingNew(false)
      resetPdfState()
      formRef.current?.reset()
    }
  }, [saveState.success])

  useEffect(() => {
    if (deleteState.success) setEditingModule(null)
  }, [deleteState.success])

  function resetPdfState() {
    setPdfUrl('')
    setPdfFile(null)
    setUploadError('')
    setUploadSuccess(false)
    setExtractError('')
    setExtracting(false)
    setContentTab('markdown')
    setMarkdownContent('')
  }

  function startEdit(mod: Module) {
    setIsAddingNew(false)
    setEditingModule(mod)
    setMarkdownContent(mod.content ?? '')
    // If content exists, show markdown (even if PDF URL also exists)
    if (mod.content) {
      setContentTab('markdown')
      setPdfUrl(mod.content_pdf_url ?? '')
    } else if (mod.content_pdf_url) {
      setContentTab('pdf')
      setPdfUrl(mod.content_pdf_url)
    } else {
      setContentTab('markdown')
      setPdfUrl('')
    }
    setUploadSuccess(false)
    setUploadError('')
    setExtractError('')
    setPdfFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function startNew() {
    setEditingModule(null)
    setIsAddingNew(true)
    resetPdfState()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingModule(null)
    setIsAddingNew(false)
    resetPdfState()
  }

  // When a PDF file is selected, immediately extract text client-side
  async function handleFileSelect(f: File | null) {
    setPdfFile(f)
    setUploadSuccess(false)
    setUploadError('')
    setExtractError('')

    if (!f) return

    setExtracting(true)
    try {
      const md = await extractMarkdownFromPdf(f)
      if (md.trim()) {
        setMarkdownContent(md)
      } else {
        setExtractError('No text found in PDF — you can type content manually.')
      }
    } catch (err: any) {
      console.error('PDF extraction error:', err)
      setExtractError('Could not read PDF text. You can type content manually.')
    } finally {
      setExtracting(false)
    }
  }

  async function handleUploadPdf() {
    if (!pdfFile) return
    setUploading(true)
    setUploadError('')
    setUploadSuccess(false)

    try {
      const fd = new FormData()
      fd.append('file', pdfFile)
      fd.append('course_id', selectedCourseId)
      fd.append('module_number', String(editingModule?.module_number ?? nextModuleNumber))

      const res = await fetch('/api/admin/upload-pdf', { method: 'POST', body: fd })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      setPdfUrl(data.url)
      setUploadSuccess(true)
      // Switch to markdown tab to show extracted notes ready to save
      if (markdownContent.trim()) setContentTab('markdown')
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const isEditing = editingModule !== null || isAddingNew

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Module Editor</h1>
          <p className="text-sm text-gray-500 mt-1">Add, edit, or delete course modules.</p>
        </div>
        {!isEditing && (
          <button
            onClick={startNew}
            disabled={!selectedCourseId}
            className="px-4 py-2 bg-[#FF6F00] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00] disabled:opacity-40 transition-colors"
          >
            + Add Module
          </button>
        )}
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          ⚠️ Error loading data: {fetchError}
        </div>
      )}

      {/* Course selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
        <select
          value={selectedCourseId}
          onChange={e => { setSelectedCourseId(e.target.value); cancelEdit() }}
          className="w-full sm:w-96 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
        >
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.title} ({allModules.filter(m => m.course_id === c.id).length} modules)
            </option>
          ))}
        </select>
      </div>

      {/* ── Module Editor Form ──────────────────────────────────────────────── */}
      {isEditing && (
        <div className="bg-white rounded-xl border border-[#FF6F00] shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {isAddingNew
                ? `New Module for "${selectedCourse?.title}"`
                : `Editing: Module ${editingModule?.module_number} — ${editingModule?.title}`}
            </h2>
            <button onClick={cancelEdit} className="text-sm text-gray-400 hover:text-gray-600">
              ✕ Cancel
            </button>
          </div>

          {saveState.success && (
            <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
              ✅ {saveState.success}
            </p>
          )}
          {saveState.error && (
            <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              ❌ {saveState.error}
            </p>
          )}

          <form ref={formRef} action={saveAction} className="space-y-4">
            <input type="hidden" name="course_id" value={selectedCourseId} />
            {/* PDF URL hidden field — always sent regardless of active tab */}
            <input type="hidden" name="content_pdf_url" value={pdfUrl} />
            <input type="hidden" name="estimated_minutes" value="0" />

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Module Number *</label>
              <input
                type="number"
                name="module_number"
                min="1"
                defaultValue={editingModule?.module_number ?? nextModuleNumber}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Module Title *</label>
              <input
                type="text"
                name="title"
                defaultValue={editingModule?.title ?? ''}
                placeholder="e.g. Introduction to AI"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
              />
            </div>

            {/* ── Content Type Tabs ── */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Module Content *</label>

              <div className="flex gap-1 mb-3 bg-gray-100 rounded-lg p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setContentTab('markdown')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    contentTab === 'markdown'
                      ? 'bg-white text-[#FF6F00] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📝 Markdown / Notes
                </button>
                <button
                  type="button"
                  onClick={() => setContentTab('pdf')}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    contentTab === 'pdf'
                      ? 'bg-white text-[#FF6F00] shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📄 Upload PDF
                </button>
              </div>

              {/* ── Markdown tab ── */}
              {contentTab === 'markdown' && (
                <div>
                  {pdfUrl && (
                    <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-2">
                      ✅ PDF stored as reference — content below will be shown to students as notes.
                    </p>
                  )}
                  <textarea
                    name="content"
                    value={markdownContent}
                    onChange={e => setMarkdownContent(e.target.value)}
                    placeholder={`# Module Title\n\n## What You'll Learn\n- Point 1\n- Point 2\n\n## Section 1\n\nYour content here...`}
                    rows={24}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-y"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Write in Markdown — headings (#, ##), **bold**, *italic*, bullet lists (- item), numbered lists (1. item).
                  </p>
                </div>
              )}

              {/* ── PDF tab ── */}
              {contentTab === 'pdf' && (
                <div className="space-y-4">
                  {/* Hidden content field — markdown will be in the textarea when we switch tabs */}
                  <input type="hidden" name="content" value={markdownContent} />

                  {/* Extraction status */}
                  {extracting && (
                    <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                      <p className="text-sm text-blue-700 font-medium">Extracting text from PDF…</p>
                    </div>
                  )}

                  {extractError && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                      ⚠️ {extractError}
                    </p>
                  )}

                  {markdownContent && !extracting && (
                    <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <p className="text-sm text-green-800 font-semibold mb-1">
                        ✅ Text extracted — {markdownContent.length.toLocaleString()} characters ready
                      </p>
                      <p className="text-xs text-green-700">
                        Upload the PDF to storage, then the content will be saved as notes for students.
                      </p>
                    </div>
                  )}

                  {/* Current PDF preview */}
                  {pdfUrl && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-gray-700">
                          {uploadSuccess ? '✅ PDF uploaded to storage' : '📄 Current PDF (stored)'}
                        </p>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#FF6F00] hover:underline font-medium"
                        >
                          Open PDF ↗
                        </a>
                      </div>
                      {uploadSuccess && markdownContent && (
                        <p className="text-xs text-green-700 mt-1">
                          Click "Save Module" to store the extracted notes.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Upload area */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#FF6F00]/50 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={e => handleFileSelect(e.target.files?.[0] ?? null)}
                    />

                    {pdfFile ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-800">📄 {pdfFile.name}</p>
                        <p className="text-xs text-gray-400">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={handleUploadPdf}
                            disabled={uploading || extracting}
                            className="px-5 py-2 bg-[#FF6F00] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00] disabled:opacity-50 transition-colors"
                          >
                            {uploading ? 'Uploading…' : extracting ? 'Extracting…' : '⬆️ Upload PDF'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setPdfFile(null)
                              if (fileInputRef.current) fileInputRef.current.value = ''
                            }}
                            className="px-4 py-2 border border-gray-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-3xl mb-2">📄</p>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {pdfUrl ? 'Upload a new PDF to replace' : 'Upload a PDF — text will be extracted as notes'}
                        </p>
                        <p className="text-xs text-gray-400 mb-3">PDF only · Max 50 MB</p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-5 py-2 border-2 border-[#FF6F00] text-[#FF6F00] text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                        >
                          Choose PDF File
                        </button>
                      </div>
                    )}
                  </div>

                  {uploadError && (
                    <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                      ❌ {uploadError}
                    </p>
                  )}

                  {!pdfUrl && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                      ⚠️ Upload the PDF before saving.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savePending || (contentTab === 'pdf' && !pdfUrl) || extracting}
                className="px-6 py-2.5 bg-[#FF6F00] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {savePending ? 'Saving…' : '💾 Save Module'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete feedback */}
      {deleteState.success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          ✅ {deleteState.success}
        </p>
      )}
      {deleteState.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          ❌ {deleteState.error}
        </p>
      )}

      {/* ── Module List ──────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-4 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCourse?.title ?? 'Modules'}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({courseModules.length} modules)
            </span>
          </h2>
          {!isEditing && (
            <button onClick={startNew} className="text-sm text-[#FF6F00] font-semibold hover:underline">
              + Add Module
            </button>
          )}
        </div>

        {courseModules.length === 0 ? (
          <div className="px-3 py-12 text-center text-gray-400 text-sm">
            No modules yet.{' '}
            <button onClick={startNew} className="text-[#FF6F00] font-medium hover:underline">
              Add the first module
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-3 py-3 text-left w-10">#</th>
                <th className="px-3 py-3 text-left">Title</th>
                <th className="px-3 py-3 text-left">Content</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courseModules.map(mod => (
                <tr
                  key={mod.id ?? `${mod.course_id}-${mod.module_number}`}
                  className={`hover:bg-gray-50 transition-colors ${editingModule?.module_number === mod.module_number ? 'bg-orange-50' : ''}`}
                >
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FF6F00] text-white text-xs font-bold">
                      {mod.module_number}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-medium text-gray-900">{mod.title}</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">
                    {mod.content
                      ? `${Math.round(mod.content.length / 1024 * 10) / 10} KB`
                      : mod.content_pdf_url
                        ? <span className="text-orange-500 font-semibold">📄 PDF only</span>
                        : '—'}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => startEdit(mod)}
                        className="text-[#FF6F00] hover:text-[#e65c00] text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <form action={deleteAction}>
                        <input type="hidden" name="course_id" value={mod.course_id} />
                        <input type="hidden" name="module_number" value={mod.module_number} />
                        <button
                          type="submit"
                          disabled={deletePending}
                          className="text-red-500 hover:text-red-700 text-xs font-medium disabled:opacity-50 transition-colors"
                          onClick={e => {
                            if (!confirm(`Delete Module ${mod.module_number}: "${mod.title}"? This cannot be undone.`)) {
                              e.preventDefault()
                            }
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </div>

      {/* Markdown tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
        <p className="font-semibold mb-2">📝 Markdown Quick Reference</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-blue-700 text-xs font-mono">
          <span># Heading 1</span>
          <span>## Heading 2</span>
          <span>### Heading 3</span>
          <span>**bold text**</span>
          <span>*italic text*</span>
          <span>- bullet item</span>
          <span>1. numbered item</span>
          <span>`inline code`</span>
          <span>``` code block ```</span>
        </div>
      </div>
    </div>
  )
}
