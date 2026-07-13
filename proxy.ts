import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // SEO redirects
  if (request.nextUrl.pathname === '/terms-of-service')
    return NextResponse.redirect(new URL('/terms', request.url), 301)
  if (request.nextUrl.pathname === '/privacy-policy')
    return NextResponse.redirect(new URL('/privacy', request.url), 301)

  const reqHeaders = new Headers(request.headers)
  let response = NextResponse.next({ request: { headers: reqHeaders } })

  const path = request.nextUrl.pathname

  // /admin auth is handled entirely by app/admin/layout.tsx (getUser + email check).
  // We do NOT call getUser() here for /admin — that API call can time out and
  // cause spurious redirects to /login. The layout is the auth gate for /admin.
  if (path.startsWith('/admin')) {
    return response
  }

  // For /dashboard and /learn: use Supabase to verify session
  if (path.startsWith('/dashboard') || path.startsWith('/learn')) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            const parts = (reqHeaders.get('cookie') ?? '')
              .split(';')
              .filter(c => !c.trim().startsWith(`${name}=`))
            parts.push(`${name}=${value}`)
            reqHeaders.set('cookie', parts.join('; '))
            response = NextResponse.next({ request: { headers: reqHeaders } })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            const parts = (reqHeaders.get('cookie') ?? '')
              .split(';')
              .filter(c => !c.trim().startsWith(`${name}=`))
            reqHeaders.set('cookie', parts.join('; '))
            response = NextResponse.next({ request: { headers: reqHeaders } })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
