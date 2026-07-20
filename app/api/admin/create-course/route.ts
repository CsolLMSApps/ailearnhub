// app/api/admin/create-course/route.ts
// Creates a new course row using the service role key (bypasses RLS).
// Auth-gated: only admin emails may call this.

import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/supabase/is-admin'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !(await isAdmin(user.email))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const {
    title,
    slug,
    short_description,
    long_description,
    price_usd,
    category,
    total_modules,
    featured,
    is_published,
  } = body

  if (!title || !slug) {
    return NextResponse.json({ error: 'title and slug are required' }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!url || !key) {
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  const res = await fetch(`${url}/rest/v1/courses`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      title,
      slug,
      short_description: short_description || null,
      long_description: long_description || null,
      price_usd: price_usd ?? 0,
      category: category || null,
      total_modules: total_modules ?? 0,
      total_hours: 0,
      featured: featured ?? false,
      is_published: is_published ?? false,
    }),
  })

  const json = await res.json()

  if (!res.ok) {
    const message = json?.message ?? json?.error ?? `HTTP ${res.status}`
    if (res.status === 409 || message.toLowerCase().includes('unique')) {
      return NextResponse.json({ error: 'A course with this slug already exists. Choose a different slug.' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: res.status })
  }

  return NextResponse.json({ course: Array.isArray(json) ? json[0] : json })
}
