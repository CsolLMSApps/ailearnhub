// TEMPORARY DEBUG ROUTE — remove after fixing
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  // 1. Check raw cookies
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const supabaseCookies = allCookies
    .filter(c => c.name.includes('supabase') || c.name.includes('sb-'))
    .map(c => ({ name: c.name, length: c.value.length }))

  // 2. Try getSession
  const supabase = await createServerSupabaseClient()
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  // 3. Try getUser
  const { data: userData, error: userError } = await supabase.auth.getUser()

  return NextResponse.json({
    cookies_found: supabaseCookies,
    total_cookies: allCookies.length,
    session: sessionData.session ? {
      user_email: sessionData.session.user?.email,
      expires_at: sessionData.session.expires_at,
      expires_in_seconds: sessionData.session.expires_at
        ? sessionData.session.expires_at - Math.floor(Date.now() / 1000)
        : null,
    } : null,
    session_error: sessionError?.message ?? null,
    user: userData.user ? { email: userData.user.email } : null,
    user_error: userError?.message ?? null,
  })
}
