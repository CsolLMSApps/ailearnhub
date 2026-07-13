// lib/supabase/admin.ts
// Uses raw fetch with service role key to bypass RLS.
// Avoids createClient to prevent version compatibility issues.
// ONLY call after auth + purchase are already verified.

const getConfig = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  key: (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ?? '',
})

/** GET a single row (mimics .select().single()) */
export async function adminFetch(
  table: string,
  queryParams: string
): Promise<{ data: any; error: Error | null }> {
  const { url, key } = getConfig()
  if (!url || !key) return { data: null, error: new Error('Missing Supabase config') }

  try {
    const res = await fetch(`${url}/rest/v1/${table}?${queryParams}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return { data: null, error: new Error(`HTTP ${res.status}`) }
    const rows = await res.json()
    const data = Array.isArray(rows) ? (rows[0] ?? null) : rows
    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}

/** Fetch all auth users via Supabase Auth Admin API (service role only) */
export async function adminFetchUsers(): Promise<{ data: any[]; error: Error | null }> {
  const { url, key } = getConfig()
  if (!url || !key) return { data: [], error: new Error('Missing Supabase config') }

  try {
    const res = await fetch(`${url}/auth/v1/admin/users?per_page=1000`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return { data: [], error: new Error(`HTTP ${res.status}`) }
    const json = await res.json()
    return { data: json.users ?? [], error: null }
  } catch (err: any) {
    return { data: [], error: err }
  }
}

/** GET all rows matching query (no .single() — returns full array) */
export async function adminFetchAll(
  table: string,
  queryParams: string
): Promise<{ data: any[]; error: Error | null }> {
  const { url, key } = getConfig()
  if (!url || !key) return { data: [], error: new Error('Missing Supabase config') }

  try {
    const res = await fetch(`${url}/rest/v1/${table}?${queryParams}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    if (!res.ok) return { data: [], error: new Error(`HTTP ${res.status}`) }
    const rows = await res.json()
    return { data: Array.isArray(rows) ? rows : [], error: null }
  } catch (err: any) {
    return { data: [], error: err }
  }
}

/** UPSERT a row and return it (mimics .upsert().select().single()) */
export async function adminUpsert(
  table: string,
  body: Record<string, any>,
  onConflict: string
): Promise<{ data: any; error: Error | null }> {
  const { url, key } = getConfig()
  if (!url || !key) return { data: null, error: new Error('Missing Supabase config') }

  try {
    const res = await fetch(
      `${url}/rest/v1/${table}?on_conflict=${onConflict}`,
      {
        method: 'POST',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation,resolution=merge-duplicates',
        },
        body: JSON.stringify(body),
        cache: 'no-store',
      }
    )
    if (!res.ok) {
      const errBody = await res.text()
      return { data: null, error: new Error(`HTTP ${res.status}: ${errBody}`) }
    }
    const rows = await res.json()
    const data = Array.isArray(rows) ? (rows[0] ?? null) : rows
    return { data, error: null }
  } catch (err: any) {
    return { data: null, error: err }
  }
}
