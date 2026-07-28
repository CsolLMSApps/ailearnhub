// app/(marketing)/blog/[slug]/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt, cover_image_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) return { title: 'Post Not Found | AI Learn Hub' }

  return {
    title:       `${post.title} | AI Learn Hub Blog`,
    description: post.excerpt ?? undefined,
    openGraph: {
      title:       post.title,
      description: post.excerpt ?? undefined,
      images:      post.cover_image_url ? [{ url: post.cover_image_url }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, excerpt, category, author_name, cover_image_url, published_at')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!post) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* Cover image hero */}
      {post.cover_image_url && (
        <div className="relative w-full h-64 md:h-96 bg-gray-100">
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-6">
          <Link href="/blog" className="hover:text-[#FF6F00] transition-colors">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{post.category}</span>
        </nav>

        {/* Category badge */}
        <span className="inline-block bg-orange-100 text-[#FF6F00] text-xs font-bold px-3 py-1 rounded-full mb-4">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 pb-8 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-[#FF6F00] flex items-center justify-center text-white font-bold text-sm shrink-0">
            {post.author_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-gray-700 font-medium text-sm">{post.author_name}</p>
            {post.published_at && (
              <p className="text-xs">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-[#FF6F00] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-[#FF6F00] prose-blockquote:bg-orange-50 prose-blockquote:py-1 prose-blockquote:rounded-r-lg prose-code:text-[#E65100] prose-code:bg-orange-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-900 max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm mb-4">Ready to level up your AI skills?</p>
          <Link
            href="/courses"
            className="inline-block bg-[#FF6F00] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#E65100] transition-colors"
          >
            Explore Our Courses →
          </Link>
          <div className="mt-6">
            <Link href="/blog" className="text-sm text-gray-400 hover:text-[#FF6F00] transition-colors">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
