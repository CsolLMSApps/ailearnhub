'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface CourseData {
  id: string
  title: string
  slug: string
  short_description?: string | null
  about_course?: string | null
  skill_tags?: string[] | null
  what_you_learn?: string[] | null
  what_is_included?: string[] | null
  banner_url?: string | null
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
  const [bannerUrl, setBannerUrl] = useState<string>(course.banner_url ?? '')
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bannerError, setBannerError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: course.title ?? '',
    slug: course.slug ?? '',
    short_description: course.short_description ?? '',
    about_course: course.about_course ?? '',
    skill_tags: (course.skill_tags ?? []).join(', '),
    what_you_learn: (course.what_you_learn ?? []).join('\n'),
    what_is_included: (course.what_is_included ?? []).join('\n'),
    price_dollars: course.price_usd ? (course.price_usd / 100).toFixed(2) : '',
    category: course.category ?? '',
    total_modules: course.total_modules?.toString() ?? '',
    featured: course.featured ?? false,
    is_published: course.is_published ?? false,
  })

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerUploading(true)
    setBannerError(null)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('course_slug', form.slug || course.id)
    try {
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setBannerError(data.error ?? 'Upload failed'); return }
      setBannerUrl(data.url)
    } catch {
      setBannerError('Upload failed — please try again')
    } finally {
      setBannerUploading(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
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

    const skill_tags = form.skill_tags
      .split(',').map(s => s.trim()).filter(Boolean)
    const what_you_learn = form.what_you_learn
      .split('\n').map(s => s.trim()).filter(Boolean)
    const what_is_included = form.what_is_included
      .split('\n').map(s => s.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/admin/update-course', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: course.id,
          title: form.title,
          slug: form.slug,
          short_description: form.short_description,
          about_course: form.about_course,
          skill_tags,
          what_you_learn,
          what_is_included,
          banner_url: bannerUrl,
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

      setSuccess('Course updated successfully!')
      setLoading(false)
      router.refresh()
      setTimeout(() => onClose(), 1200)
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-md mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">Edit Course</h2>
        <button
          onClick={onClose}
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Short description */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Short Description
            <span className="text-gray-400 font-normal ml-1">(shown on course cards)</span>
          </label>
          <input
            name="short_description"
            value={form.short_description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* About This Course */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            About This Course
            <span className="text-gray-400 font-normal ml-1">(full description paragraph)</span>
          </label>
          <textarea
            name="about_course"
            value={form.about_course}
            onChange={handleChange}
            rows={4}
            placeholder="Describe what this course covers, who it's for, and why someone should take it..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Skill Tags */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Skill Tags
            <span className="text-gray-400 font-normal ml-1">(comma-separated)</span>
          </label>
          <input
            name="skill_tags"
            value={form.skill_tags}
            onChange={handleChange}
            placeholder="ChatGPT, Prompt Engineering, AI Productivity"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* What You'll Learn */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            What You&apos;ll Learn
            <span className="text-gray-400 font-normal ml-1">(one item per line)</span>
          </label>
          <textarea
            name="what_you_learn"
            value={form.what_you_learn}
            onChange={handleChange}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>

        {/* What's Included */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            What&apos;s Included
            <span className="text-gray-400 font-normal ml-1">(one item per line)</span>
          </label>
          <textarea
            name="what_is_included"
            value={form.what_is_included}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
          />
        </div>

        {/* Banner Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Course Banner Image
            <span className="text-gray-400 font-normal ml-1">(optional — JPG, PNG, WebP, max 10 MB)</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerUpload}
            className="hidden"
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={bannerUploading}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              {bannerUploading ? 'Uploading...' : bannerUrl ? '↻ Change Image' : '↑ Upload Image'}
            </button>
            {bannerUrl && (
              <button
                type="button"
                onClick={() => { setBannerUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
          {bannerError && <p className="mt-1 text-xs text-red-600">{bannerError}</p>}
          {bannerUrl && (
            <img
              src={bannerUrl}
              alt="Banner preview"
              className="mt-2 h-24 w-full object-cover rounded-lg border border-gray-200"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
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
            <span className="text-sm text-gray-700 font-medium">Published</span>
          </label>
        </div>

        {/* Feedback */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            ✅ {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
