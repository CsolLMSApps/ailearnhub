// app/api/admin/blog/route.ts
// GET  — list all posts (admin, includes unpublished)
// POST — create new post

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

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80)
}

export async function GET(request: NextRequest) {
  if (!await checkAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id, title, slug, excerpt, category, author_name, is_published, published_at, cover_image_url, created_at')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ posts: data })
}

export async function POST(request: NextRequest) {
  if (!await checkAdmin(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { title, content, excerpt, category, author_name, cover_image_url, is_published } = body

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
  }

  // Auto-generate unique slug
  let baseSlug = slugify(title)
  let slug = baseSlug
  let attempt = 0
  while (true) {
    const { data: existing } = await supabaseAdmin.from('blog_posts').select('id').eq('slug', slug).single()
    if (!existing) break
    attempt++
    slug = `${baseSlug}-${attempt}`
  }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert({
      title:           title.trim(),
      slug,
      content:         content.trim(),
      excerpt:         excerpt?.trim() || null,
      category:        category?.trim() || 'General',
      author_name:     author_name?.trim() || 'AI Learn Hub Team',
      cover_image_url: cover_image_url || null,
      is_published:    !!is_published,
      published_at:    is_published ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ post: data })
}
