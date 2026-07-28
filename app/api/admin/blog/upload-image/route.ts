// app/api/admin/blog/upload-image/route.ts
// Uploads a blog cover image to Supabase Storage (public bucket: blog-images)

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

export async function POST(request: NextRequest) {
  const email = request.headers.get('x-user-email')?.toLowerCase()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let hasAccess = SUPER_ADMIN_EMAILS.includes(email)
  if (!hasAccess) {
    const { data } = await supabaseAdmin.from('admin_users').select('email').eq('email', email).single()
    hasAccess = !!data
  }
  if (!hasAccess) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await request.formData()
  const file = formData.get('image') as File | null

  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP, or GIF images are allowed' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
  const filePath = `covers/${safeName}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadErr } = await supabaseAdmin.storage
    .from('blog-images')
    .upload(filePath, buffer, { contentType: file.type, upsert: false })

  if (uploadErr) {
    console.error('Image upload error:', uploadErr)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('blog-images')
    .getPublicUrl(filePath)

  return NextResponse.json({ url: publicUrl })
}
