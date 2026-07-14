// app/auth/signout/route.ts
// POST-only — GET requests (e.g. Next.js Link prefetch) must NOT trigger signout.

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  const url = new URL(request.url)
  return NextResponse.redirect(new URL('/login', url.origin), { status: 303 })
}

// Explicitly reject GET so prefetches can never trigger a signout
export async function GET() {
  return new NextResponse('Method not allowed', { status: 405 })
}
