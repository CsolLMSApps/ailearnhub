// app/admin/blog/new/page.tsx
export const dynamic = 'force-dynamic'

import BlogEditor from '../BlogEditor'

export default function NewBlogPostPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
        <p className="text-sm text-gray-500 mt-1">Write and publish a new post. You can save as draft and publish later.</p>
      </div>
      <BlogEditor mode="new" />
    </div>
  )
}
