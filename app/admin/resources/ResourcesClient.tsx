'use client'

// app/admin/resources/ResourcesClient.tsx
// Handles the upload form + resource list with delete buttons.

import { useState, useRef } from 'react'

interface Course {
  id: string
  title: string
  slug: string
}

interface Resource {
  id: string
  course_id: string
  name: string
  description?: string
  file_name: string
  file_type: string
  file_size_bytes?: number
  sort_order: number
  created_at: string
}

interface Props {
  courses: Course[]
  initialResources: Resource[]
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileIcon(type: string): string {
  if (type.includes('pdf')) return '📄'
  if (type.includes('spreadsheet') || type.includes('excel') || type.includes('csv')) return '📊'
  if (type.includes('word') || type.includes('document')) return '📝'
  if (type.includes('image')) return '🖼️'
  if (type.includes('zip')) return '🗜️'
  return '📁'
}

export default function ResourcesClient({ courses, initialResources }: Props) {
  const [resources, setResources] = useState<Resource[]>(initialResources)
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id ?? '')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Filter resources by selected course for the list view
  const [filterCourse, setFilterCourse] = useState('all')
  const visibleResources = filterCourse === 'all'
    ? resources
    : resources.filter(r => r.course_id === filterCourse)

  const courseMap = Object.fromEntries(courses.map(c => [c.id, c.title]))

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError('')
    setUploadSuccess('')

    const file = fileRef.current?.files?.[0]
    if (!file) { setUploadError('Please select a file.'); return }
    if (!name.trim()) { setUploadError('Please enter a resource name.'); return }
    if (!selectedCourse) { setUploadError('Please select a course.'); return }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('course_id', selectedCourse)
      formData.append('name', name.trim())
      formData.append('description', description.trim())
      formData.append('sort_order', sortOrder)

      const res = await fetch('/api/admin/upload-resource', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setUploadError(data.error || 'Upload failed.')
      } else {
        setResources(prev => [...prev, data.resource])
        setName('')
        setDescription('')
        setSortOrder('0')
        if (fileRef.current) fileRef.current.value = ''
        setUploadSuccess(`"${data.resource.name}" uploaded successfully.`)
        setTimeout(() => setUploadSuccess(''), 4000)
      }
    } catch (err: any) {
      setUploadError(err.message || 'Something went wrong.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch('/api/admin/delete-resource', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setResources(prev => prev.filter(r => r.id !== id))
      } else {
        const data = await res.json()
        alert(data.error || 'Delete failed.')
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-8">

      {/* Upload form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Upload new resource</h2>
        <form onSubmit={handleUpload} className="space-y-4">

          {/* Course selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Course *</label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                required
                disabled={uploading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Sort order</label>
              <input
                type="number"
                min="0"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                disabled={uploading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Resource name *</label>
            <input
              type="text"
              placeholder="e.g. 100+ Prompt Templates Library"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={uploading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description <span className="text-gray-400">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Ready-to-use prompts for writing, coding, research and more"
              value={description}
              onChange={e => setDescription(e.target.value)}
              disabled={uploading}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] disabled:opacity-50"
            />
          </div>

          {/* File picker */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">File *</label>
            <input
              type="file"
              ref={fileRef}
              required
              disabled={uploading}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.pptx,.zip,.txt"
              className="block w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-gray-300 file:text-xs file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 disabled:opacity-50"
            />
            <p className="text-xs text-gray-400 mt-0.5">PDF, Word, Excel, CSV, PPTX, ZIP — max 50 MB</p>
          </div>

          {uploadError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{uploadError}</p>
          )}
          {uploadSuccess && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{uploadSuccess}</p>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-[#FF6F00] text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-[#E65100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading…' : 'Upload Resource'}
          </button>
        </form>
      </div>

      {/* Resources list */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-900">
            All resources <span className="text-gray-400 font-normal">({visibleResources.length})</span>
          </h2>
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          >
            <option value="all">All courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {visibleResources.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No resources uploaded yet.</p>
        ) : (
          <div className="space-y-2">
            {visibleResources.map(r => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl shrink-0">{fileIcon(r.file_type)}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {courseMap[r.course_id] ?? '—'} · {r.file_name} · {formatBytes(r.file_size_bytes)}
                    </p>
                    {r.description && (
                      <p className="text-xs text-gray-500 truncate">{r.description}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(r.id, r.name)}
                  disabled={deletingId === r.id}
                  className="shrink-0 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deletingId === r.id ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
