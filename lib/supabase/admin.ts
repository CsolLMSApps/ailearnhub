// lib/supabase/admin.ts
// Uses raw fetch with service role key to bypass RLS.
// Avoids createClient to prevent version compatibility issues.
// ONLY call after auth + purchase are already verified.

export async function adminFetch(
  table: string,
  queryParams: string
): Promise<{ data: any; error: Error | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return { data: null, error: new Error('Missing Supabase config') }
  }

  try {
    const res = await fetch(`${url}/rest/v1/${table}?${queryParams}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return { data: null, error: new Error(`HTTP ${res.status}`) }
    }

    const rows = await res.json()
    // Mimic .single() — return first row or null
    const data = Array.isArray(rows) ? (rows[0] ?? null) : rows
    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}
