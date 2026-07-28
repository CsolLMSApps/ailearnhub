// app/admin/blog/[id]/edit/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import BlogEditor from '../../BlogEditor'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: post } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, content, excerpt, category, author_name, cover_image_url, is_published, published_at')
    .eq('id', id)
    .single()

  if (!post) notFound()

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            post.is_published ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {post.is_published ? '✅ Published' : '📝 Draft'}
          </span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          {post.is_published && post.published_at
            ? `Published ${new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
            : 'Not yet published'}
          {' · '}
          <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#FF6F00] hover:underline">
            /blog/{post.slug} ↗
          </a>
        </p>
      </div>
      <BlogEditor
        mode="edit"
        initialData={{
          id:              post.id,
          title:           post.title,
          content:         post.content,
          excerpt:         post.excerpt ?? '',
          category:        post.category,
          author_name:     post.author_name,
          cover_image_url: post.cover_image_url ?? '',
          is_published:    post.is_published,
        }}
      />
    </div>
  )
}
