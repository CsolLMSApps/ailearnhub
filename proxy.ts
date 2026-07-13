import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ADMIN_EMAILS = [
  'srikanth@ctekksolutions.net',
  'shuchitha@shiroapps.com',
  'info@shirotechnologies.com',
]

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  const requestHeaders = new Headers(request.headers)
  const cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing.split(';').map(s => s.trim()).filter(s => s && !s.startsWith(`${name}=`))
          updated.push(`${name}=${value}`)
          requestHeaders.set('cookie', updated.join('; '))
          cookiesToSet.push({ name, value, options })
        },
        remove(name: string, options: CookieOptions) {
          const existing = requestHeaders.get('cookie') ?? ''
          const updated = existing.split(';').map(s => s.trim()).filter(s => s && !s.startsWith(`${name}=`))
          requestHeaders.set('cookie', updated.join('; '))
          cookiesToSet.push({ name, value: '', options })
        },
      },
    }
  )

  // Refresh session — this is the ONLY job of the proxy.
  // getSession() reads from cookies directly (no network call to Supabase).
  // If the access token is expired it uses the refresh token to get a new one.
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  const path = request.nextUrl.pathname

  // Protect /dashboard and /learn — redirect to login if not signed in.
  // /admin is NOT protected here — the admin layout handles its own auth check
  // so a proxy failure never blocks the entire admin panel.
  if ((path.startsWith('/dashboard') || path.startsWith('/learn')) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options as any)
  }
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
