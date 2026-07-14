'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function toSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const LEVELS = ['beginner', 'intermediate', 'advanced']

export default function CreateCourseForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    short_description: '',
    long_description: '',
    price_dollars: '',
    level: 'beginner',
    category: '',
    total_modules: '',
    total_hours: '',
    featured: false,
    is_published: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      // Auto-generate slug from title
      ...(name === 'title' && !prev.slug || name === 'title' && prev.slug === toSlug(prev.title)
        ? { slug: toSlug(value) }
        : {}),
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const price_usd = form.price_dollars
      ? Math.round(parseFloat(form.price_dollars) * 100)
      : 0

    try {
      const res = await fetch('/api/admin/create-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          short_description: form.short_description,
          long_description: form.long_description,
          price_usd,
          level: form.level,
          category: form.category,
          total_modules: parseInt(form.total_modules) || 0,
          total_hours: parseInt(form.total_hours) || 0,
          featured: form.featured,
          is_published: form.is_published,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Failed to create course')
        setLoading(false)
        return
      }

      setSuccess(`Course "${data.course?.title}" created! Now add its modules.`)
      setCreatedCourseId(data.course?.id ?? null)
      setForm({
        title: '', slug: '', short_description: '', long_description: '',
        price_dollars: '', level: 'beginner', category: '',
        total_modules: '', total_hours: '', featured: false, is_published: false,
      })
      setLoading(false)
      // Refresh server data
      router.refresh()
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-[#FF6F00] hover:bg-[#E65100] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          Add New Course
        </button>
      ) : (
        <div className="bg-white rounded-2xl border border-orange-200 shadow-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Add New Course</h2>
            <button
              onClick={() => { setOpen(false); setError(null); setSuccess(null) }}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title + Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Course Title <span className="text-red-500">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. AI for Beginners"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Slug <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(URL path)</span>
                </label>
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  required
                  placeholder="ai-for-beginners"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
            </div>

            {/* Short description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Short Description</label>
              <input
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="One-line summary shown on course cards"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
              />
            </div>

            {/* Long description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Long Description</label>
              <textarea
                name="long_description"
                value={form.long_description}
                onChange={handleChange}
                rows={3}
                placeholder="Full course description shown on the course detail page"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-none"
              />
            </div>

            {/* Price + Level + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Price (USD $)</label>
                <input
                  name="price_dollars"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price_dollars}
                  onChange={handleChange}
                  placeholder="19.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent bg-white"
                >
                  {LEVELS.map(l => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Machine Learning"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
            </div>

            {/* Modules + Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Modules</label>
                <input
                  name="total_modules"
                  type="number"
                  min="0"
                  value={form.total_modules}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Hours</label>
                <input
                  name="total_hours"
                  type="number"
                  min="0"
                  value={form.total_hours}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#FF6F00]"
                />
                <span className="text-sm text-gray-700 font-medium">Featured course</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={form.is_published}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#FF6F00]"
                />
                <span className="text-sm text-gray-700 font-medium">Publish immediately</span>
              </label>
            </div>

            {/* Feedback */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 flex items-center justify-between gap-4">
                <span>✅ {success}</span>
                {createdCourseId && (
                  <a
                    href={`/admin/modules?courseId=${createdCourseId}`}
                    className="shrink-0 px-4 py-1.5 bg-[#FF6F00] text-white text-xs font-semibold rounded-lg hover:bg-[#e65c00] transition-colors"
                  >
                    Add Modules →
                  </a>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </button>
              <button
                type="button"
                onClick={() => { setOpen(false); setError(null); setSuccess(null) }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
