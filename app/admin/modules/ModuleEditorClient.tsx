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
    if (deleteState.success) {
      setEditingModule(null)
    }
  }, [deleteState.success])

  function resetPdfState() {
    setPdfUrl('')
    setPdfFile(null)
    setUploadError('')
    setUploadSuccess(false)
    setContentTab('markdown')
  }

  function startEdit(mod: Module) {
    setIsAddingNew(false)
    setEditingModule(mod)
    // Auto-select PDF tab if the module already has a PDF
    if (mod.content_pdf_url) {
      setContentTab('pdf')
      setPdfUrl(mod.content_pdf_url)
    } else {
      setContentTab('markdown')
      setPdfUrl('')
    }
    setUploadSuccess(false)
    setUploadError('')
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
            {/* PDF URL hidden field — populated by upload handler */}
            <input type="hidden" name="content_pdf_url" value={pdfUrl} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
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
                <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Time (minutes) *</label>
                <input
                  type="number"
                  name="estimated_minutes"
                  min="1"
                  defaultValue={editingModule?.estimated_minutes ?? 20}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
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

              {/* Tab switcher */}
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
                  📝 Markdown
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
                  📄 PDF Upload
                </button>
              </div>

              {/* ── Markdown tab ── */}
              {contentTab === 'markdown' && (
                <div>
                  <textarea
                    name="content"
                    defaultValue={editingModule?.content ?? ''}
                    placeholder={`# Module Title\n\n## What You'll Learn\n- Point 1\n- Point 2\n\n## Section 1\n\nYour content here...`}
                    rows={20}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-y"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Write in Markdown — headings (#, ##), **bold**, *italic*, bullet lists (- item), numbered lists (1. item), code blocks (```).
                  </p>
                </div>
              )}

              {/* ── PDF tab ── */}
              {contentTab === 'pdf' && (
                <div className="space-y-4">
                  {/* Hidden content field (empty string is fine when PDF URL is set) */}
                  <input type="hidden" name="content" value="" />

                  {/* Current PDF preview */}
                  {pdfUrl && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-green-800">
                          {uploadSuccess ? '✅ PDF uploaded successfully' : '📄 Current PDF'}
                        </p>
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-green-700 hover:underline font-medium"
                        >
                          Open in new tab ↗
                        </a>
                      </div>
                      <iframe
                        src={pdfUrl}
                        className="w-full h-64 rounded-lg border border-green-200"
                        title="PDF Preview"
                      />
                    </div>
                  )}

                  {/* Upload area */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#FF6F00]/50 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0] ?? null
                        setPdfFile(f)
                        setUploadSuccess(false)
                        setUploadError('')
                      }}
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
                            disabled={uploading}
                            className="px-5 py-2 bg-[#FF6F00] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00] disabled:opacity-50 transition-colors"
                          >
                            {uploading ? 'Uploading…' : '⬆️ Upload PDF'}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
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
                          {pdfUrl ? 'Upload a new PDF to replace the current one' : 'Upload a PDF file'}
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
                      ⚠️ Upload the PDF first before saving the module.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savePending || (contentTab === 'pdf' && !pdfUrl)}
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
            No modules yet for this course.{' '}
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
                <th className="px-3 py-3 text-left">Duration</th>
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
                  <td className="px-3 py-3 text-gray-500">{mod.estimated_minutes} min</td>
                  <td className="px-3 py-3 text-gray-400 text-xs">
                    {mod.content_pdf_url
                      ? <span className="text-orange-500 font-semibold">📄 PDF</span>
                      : mod.content
                        ? `${Math.round(mod.content.length / 1024 * 10) / 10} KB`
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
