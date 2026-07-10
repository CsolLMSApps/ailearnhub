// lib/supabase/admin.ts
// Service-role client — bypasses RLS.
// ONLY use this AFTER you have already verified auth + purchase with the regular client.

import { createClient } from '@supabase/supabase-js'

export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  // Graceful fallback: if service role key isn't set yet, use anon key
  // (quizzes may not show until SUPABASE_SERVICE_ROLE_KEY is added to Vercel)
  const effectiveKey = key || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url || !effectiveKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL in environment variables')
  }

  return createClient(url, effectiveKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
