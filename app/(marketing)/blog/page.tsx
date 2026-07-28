// app/(marketing)/blog/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | AI Learn Hub',
  description: 'Tips, tutorials, and insights on AI tools, prompting, and productivity from the AI Learn Hub team.',
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, author_name, cover_image_url, published_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  const allPosts = posts ?? []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-[#212121] text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#FF6F00] text-sm font-bold uppercase tracking-widest mb-3">AI Learn Hub Blog</p>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Tips, Tutorials & AI Insights
          </h1>
          <p className="text-gray-300 text-lg">
            Stay ahead with practical guides on AI tools, prompt engineering, and productivity.
          </p>
        </div>
      </section>

      {/* Post grid */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        {allPosts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">✍️</p>
            <p className="text-gray-500 text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Cover image */}
                <div className="relative h-48 bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center overflow-hidden">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-5xl opacity-40">📝</span>
                  )}
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 bg-[#FF6F00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h2 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-[#FF6F00] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
                    <span>{post.author_name}</span>
                    <span>
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : ''}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
