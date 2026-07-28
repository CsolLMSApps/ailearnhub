// app/admin/blog/page.tsx
export const dynamic = 'force-dynamic'

import { createClient } from '@supabase/supabase-js'
import BlogListClient from './BlogListClient'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function AdminBlogPage() {
  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, author_name, is_published, published_at, cover_image_url, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Write, publish, and manage your blog content.</p>
        </div>
        <a
          href="/admin/blog/new"
          className="px-4 py-2 bg-[#FF6F00] text-white text-sm font-bold rounded-lg hover:bg-[#E65100] transition-colors"
        >
          + New Post
        </a>
      </div>
      <BlogListClient posts={posts ?? []} />
    </div>
  )
}
