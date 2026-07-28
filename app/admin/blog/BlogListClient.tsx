'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  category: string
  author_name: string
  is_published: boolean
  published_at?: string
  cover_image_url?: string
  created_at: string
}

export default function BlogListClient({ posts: initial }: { posts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initial)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const published = posts.filter(p => p.is_published).length
  const drafts    = posts.filter(p => !p.is_published).length

  async function togglePublish(post: Post) {
    setTogglingId(post.id)
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...post, is_published: !post.is_published }),
    })
    if (res.ok) {
      setPosts(prev => prev.map(p =>
        p.id === post.id ? { ...p, is_published: !p.is_published } : p
      ))
    }
    setTogglingId(null)
  }

  async function deletePost(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeletingId(id)
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
    if (res.ok) setPosts(prev => prev.filter(p => p.id !== id))
    setDeletingId(null)
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', count: posts.length, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-200' },
          { label: 'Published', count: published, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
          { label: 'Drafts', count: drafts, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Post list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">✍️</p>
            <p className="text-gray-500 text-sm">No blog posts yet.</p>
            <a href="/admin/blog/new" className="mt-4 inline-block text-[#FF6F00] text-sm font-semibold hover:underline">
              Write your first post →
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {posts.map(post => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {/* Cover thumbnail */}
                <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {post.cover_image_url ? (
                    <Image src={post.cover_image_url} alt={post.title} width={64} height={64} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-2xl">📝</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 text-sm truncate">{post.title}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      post.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {post.is_published ? '✅ Published' : '📝 Draft'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {post.category} · {post.author_name} · {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {post.excerpt && <p className="text-xs text-gray-400 truncate mt-0.5">{post.excerpt}</p>}
                </div>

                {/* Actions */}
                <div className="shrink-0 flex items-center gap-2">
                  {post.is_published && (
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      View ↗
                    </a>
                  )}
                  <a
                    href={`/admin/blog/${post.id}/edit`}
                    className="text-xs text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </a>
                  <button
                    onClick={() => togglePublish(post)}
                    disabled={togglingId === post.id}
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
                      post.is_published
                        ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                        : 'border-green-300 text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {togglingId === post.id ? '...' : post.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => deletePost(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === post.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
