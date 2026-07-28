'use client'

// Shared blog editor component — used by /admin/blog/new and /admin/blog/[id]/edit

import { useState, useRef } from 'react'
import Image from 'next/image'

interface BlogEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
    excerpt: string
    category: string
    author_name: string
    cover_image_url: string
    is_published: boolean
  }
  mode: 'new' | 'edit'
}

const CATEGORIES = ['General', 'AI News', 'Tips & Tricks', 'Tutorials', 'Case Studies', 'Industry Insights', 'Product Updates']

export default function BlogEditor({ initialData, mode }: BlogEditorProps) {
  const [title, setTitle]           = useState(initialData?.title ?? '')
  const [content, setContent]       = useState(initialData?.content ?? '')
  const [excerpt, setExcerpt]       = useState(initialData?.excerpt ?? '')
  const [category, setCategory]     = useState(initialData?.category ?? 'General')
  const [authorName, setAuthorName] = useState(initialData?.author_name ?? 'AI Learn Hub Team')
  const [coverUrl, setCoverUrl]     = useState(initialData?.cover_image_url ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.is_published ?? false)

  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError]         = useState('')
  const [saving, setSaving]                 = useState(false)
  const [error, setError]                   = useState('')
  const [success, setSuccess]               = useState('')

  const imgRef = useRef<HTMLInputElement>(null)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    setImageUploading(true)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('/api/admin/blog/upload-image', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        setImageError(data.error || 'Image upload failed.')
      } else {
        setCoverUrl(data.url)
      }
    } catch {
      setImageError('Image upload failed. Try again.')
    } finally {
      setImageUploading(false)
    }
  }

  function insertFormat(before: string, after = '') {
    const ta = document.getElementById('blog-content') as HTMLTextAreaElement
    if (!ta) return
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    const selected = content.substring(start, end)
    const newContent = content.substring(0, start) + before + selected + after + content.substring(end)
    setContent(newContent)
    setTimeout(() => {
      ta.selectionStart = start + before.length
      ta.selectionEnd   = start + before.length + selected.length
      ta.focus()
    }, 0)
  }

  async function handleSave(publish?: boolean) {
    if (!title.trim()) { setError('Title is required.'); return }
    if (!content.trim()) { setError('Content is required.'); return }
    setError('')
    setSaving(true)

    const shouldPublish = publish !== undefined ? publish : isPublished

    try {
      const url    = mode === 'edit' ? `/api/admin/blog/${initialData?.id}` : '/api/admin/blog'
      const method = mode === 'edit' ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          category,
          author_name: authorName.trim(),
          cover_image_url: coverUrl || null,
          is_published: shouldPublish,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to save.')
      } else {
        setIsPublished(shouldPublish)
        setSuccess(shouldPublish ? 'Post published! 🎉' : 'Draft saved.')
        setTimeout(() => setSuccess(''), 3000)
        if (mode === 'new') {
          window.location.href = `/admin/blog/${data.post.id}/edit`
        }
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          placeholder="Enter blog post title…"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full text-xl font-bold border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        {/* Author */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Author</label>
          <input
            type="text"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Excerpt <span className="font-normal text-gray-400">(shown on blog listing page)</span>
        </label>
        <textarea
          rows={2}
          placeholder="Short summary of the post — 1-2 sentences…"
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] resize-none"
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            {coverUrl ? (
              <Image src={coverUrl} alt="Cover" width={160} height={112} className="object-cover w-full h-full" />
            ) : (
              <span className="text-3xl">🖼️</span>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              ref={imgRef}
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imgRef.current?.click()}
              disabled={imageUploading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {imageUploading ? 'Uploading…' : coverUrl ? 'Change Image' : 'Upload Image'}
            </button>
            {coverUrl && (
              <button
                type="button"
                onClick={() => setCoverUrl('')}
                className="ml-2 text-sm text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
            {imageError && <p className="text-xs text-red-600 mt-1">{imageError}</p>}
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP or GIF · Recommended: 1200×630px</p>
          </div>
        </div>
      </div>

      {/* Content editor */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>

        {/* Formatting toolbar */}
        <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 border border-gray-200 rounded-t-xl border-b-0">
          {[
            { label: 'H1', action: () => insertFormat('\n# ', '\n') },
            { label: 'H2', action: () => insertFormat('\n## ', '\n') },
            { label: 'H3', action: () => insertFormat('\n### ', '\n') },
            { label: 'B',  action: () => insertFormat('**', '**'), bold: true },
            { label: 'I',  action: () => insertFormat('*', '*'), italic: true },
            { label: '—',  action: () => insertFormat('\n\n---\n\n') },
            { label: '• List', action: () => insertFormat('\n- ') },
            { label: '1. List', action: () => insertFormat('\n1. ') },
            { label: '🔗 Link', action: () => insertFormat('[Link text](', ')') },
            { label: '💬 Quote', action: () => insertFormat('\n> ', '\n') },
          ].map(btn => (
            <button
              key={btn.label}
              type="button"
              onClick={btn.action}
              className={`px-2.5 py-1 text-xs rounded border border-gray-300 bg-white hover:bg-gray-100 transition-colors ${btn.bold ? 'font-bold' : ''} ${btn.italic ? 'italic' : ''}`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <textarea
          id="blog-content"
          rows={22}
          placeholder={`Write your blog post here…\n\nSupports Markdown:\n# Heading 1\n## Heading 2\n**bold**  *italic*\n- bullet list\n1. numbered list\n> blockquote\n[Link](https://example.com)`}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full border border-gray-300 rounded-b-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6F00] resize-y"
        />
        <p className="text-xs text-gray-400 mt-1">{content.length} characters · Supports Markdown formatting</p>
      </div>

      {/* Error / success */}
      {error   && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
      {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">{success}</p>}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pb-8">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : '💾 Save Draft'}
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="px-6 py-2.5 bg-[#FF6F00] text-white text-sm font-bold rounded-xl hover:bg-[#E65100] transition-colors disabled:opacity-50"
        >
          {saving ? 'Publishing…' : isPublished ? '✅ Update & Publish' : '🚀 Publish Post'}
        </button>
        {isPublished && (
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-2.5 border border-amber-300 text-amber-700 text-sm font-semibold rounded-xl hover:bg-amber-50 transition-colors disabled:opacity-50"
          >
            Unpublish
          </button>
        )}
        <a href="/admin/blog" className="ml-auto text-sm text-gray-400 hover:text-gray-600">
          ← Back to posts
        </a>
      </div>
    </div>
  )
}
