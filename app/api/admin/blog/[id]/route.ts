// app/api/admin/blog/[id]/route.ts
// PATCH  — update post
// DELETE — delete post

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPER_ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkAdmin(request: NextRequest) {
  const email = request.headers.get('x-user-email')?.toLowerCase()
  if (!email) return false
  if (SUPER_ADMIN_EMAILS.includes(email)) return true
  const { data } = await supabaseAdmin.from('admin_users').select('email').eq('email', email).single()
  return !!data
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const { title, content, excerpt, category, author_name, cover_image_url, is_published } = body

  // Fetch current to get existing published_at
  const { data: current } = await supabaseAdmin
    .from('blog_posts').select('is_published, published_at').eq('id', id).single()

  const wasPublished = current?.is_published
  const publishedAt = is_published && !wasPublished
    ? new Date().toISOString()     // first time publishing
    : (is_published ? current?.published_at : null)

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({
      title:           title?.trim(),
      content:         content?.trim(),
      excerpt:         excerpt?.trim() || null,
      category:        category?.trim() || 'General',
      author_name:     author_name?.trim() || 'AI Learn Hub Team',
      cover_image_url: cover_image_url ?? null,
      is_published:    !!is_published,
      published_at:    publishedAt,
      updated_at:      new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post: data })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!await checkAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params

  // Get cover image path to delete from storage too
  const { data: post } = await supabaseAdmin.from('blog_posts').select('cover_image_url').eq('id', id).single()

  if (post?.cover_image_url) {
    // Extract path from URL: .../storage/v1/object/public/blog-images/PATH
    const match = post.cover_image_url.match(/blog-images\/(.+)$/)
    if (match?.[1]) {
      await supabaseAdmin.storage.from('blog-images').remove([match[1]])
    }
  }

  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
