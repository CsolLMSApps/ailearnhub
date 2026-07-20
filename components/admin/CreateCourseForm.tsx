'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

function toSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function CreateCourseForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bannerError, setBannerError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    short_description: '',
    about_course: '',
    skill_tags: '',         // comma-separated
    what_you_learn: '',     // one item per line
    what_is_included: '',   // one item per line
    price_dollars: '',
    category: '',
    total_modules: '',
    featured: false,
    is_published: false,
  })

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setBannerUploading(true)
    setBannerError(null)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('course_slug', form.slug || 'new-course')
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
      // Auto-generate slug from title
      ...(name === 'title' && (!prev.slug || prev.slug === toSlug(prev.title))
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

    // Parse array fields
    const skill_tags = form.skill_tags
      .split(',').map(s => s.trim()).filter(Boolean)
    const what_you_learn = form.what_you_learn
      .split('\n').map(s => s.trim()).filter(Boolean)
    const what_is_included = form.what_is_included
      .split('\n').map(s => s.trim()).filter(Boolean)

    try {
      const res = await fetch('/api/admin/create-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        setError(data.error ?? 'Failed to create course')
        setLoading(false)
        return
      }

      setSuccess(`Course "${data.course?.title}" created! Now add its modules.`)
      setCreatedCourseId(data.course?.id ?? null)
      setBannerUrl('')
      setForm({
        title: '', slug: '', short_description: '', about_course: '',
        skill_tags: '', what_you_learn: '', what_is_included: '',
        price_dollars: '', category: '',
        total_modules: '', featured: false, is_published: false,
      })
      setLoading(false)
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
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Short Description
                <span className="text-gray-400 font-normal ml-1">(shown on course cards)</span>
              </label>
              <input
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="One-line summary"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-none"
              />
            </div>

            {/* Skill Tags */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Skill Tags
                <span className="text-gray-400 font-normal ml-1">(comma-separated, e.g. Prompt Engineering, AI Tools)</span>
              </label>
              <input
                name="skill_tags"
                value={form.skill_tags}
                onChange={handleChange}
                placeholder="ChatGPT, Prompt Engineering, AI Productivity"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
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
                placeholder={`Write prompts that get professional results every time\nAutomate repetitive tasks with AI\nBuild a personal AI toolkit`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-none"
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
                placeholder={`50+ Prompt Templates\nCompletion Certificate\nLifetime Access`}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent resize-none"
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
                  placeholder="19.00"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
                />
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
