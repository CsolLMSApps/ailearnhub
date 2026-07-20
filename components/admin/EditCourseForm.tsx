'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface CourseData {
  id: string
  title: string
  slug: string
  short_description?: string | null
  long_description?: string | null
  price_usd?: number
  category?: string | null
  total_modules?: number
  featured?: boolean
  is_published?: boolean
}

interface Props {
  course: CourseData
  onClose: () => void
}

export default function EditCourseForm({ course, onClose }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: course.title ?? '',
    slug: course.slug ?? '',
    short_description: course.short_description ?? '',
    long_description: course.long_description ?? '',
    price_dollars: course.price_usd ? (course.price_usd / 100).toFixed(2) : '',
    category: course.category ?? '',
    total_modules: course.total_modules?.toString() ?? '',
    featured: course.featured ?? false,
    is_published: course.is_published ?? false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
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
      const res = await fetch('/api/admin/update-course', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: course.id,
          title: form.title,
          slug: form.slug,
          short_description: form.short_description,
          long_description: form.long_description,
          price_usd,
          category: form.category,
          total_modules: parseInt(form.total_modules) || 0,
          featured: form.featured,
          is_published: form.is_published,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Failed to update course')
        setLoading(false)
        return
      }

      setSuccess('Course updated!')
      setLoading(false)
      router.refresh()
      setTimeout(() => onClose(), 1000)
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-md mt-4">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Edit Course</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Slug <span className="text-gray-400 font-normal ml-1">(URL path)</span>
            </label>
            <input
              name="slug"
              value={form.slug}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Price (USD $)</label>
            <input
              name="price_dollars"
              type="number"
              min="0"
              step="0.01"
              value={form.price_dollars}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Total Modules */}
        <div className="w-1/2 pr-2">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Total Modules</label>
          <input
            name="total_modules"
            type="number"
            min="0"
            value={form.total_modules}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-[#FF6F00]" />
            <span className="text-sm text-gray-700 font-medium">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_published" checked={form.is_published} onChange={handleChange} className="w-4 h-4 accent-[#FF6F00]" />
            <span className="text-sm text-gray-700 font-medium">Published</span>
          </label>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">✅ {success}</div>}

        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
