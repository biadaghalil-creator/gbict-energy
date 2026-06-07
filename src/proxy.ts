import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

type Locale = 'en' | 'nl' | 'de' | 'fr'

function detectLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'en'
  // Accept-Language is typically like "nl-NL,nl;q=0.9,en;q=0.8"
  const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim().toLowerCase() ?? ''
  if (primary.startsWith('nl')) return 'nl'
  if (primary.startsWith('de')) return 'de'
  if (primary.startsWith('fr')) return 'fr'
  return 'en'
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const { pathname } = request.nextUrl

  // Resolve the signed-in user only when Supabase is configured. A missing or
  // failing auth backend must NEVER take down the public site, so this is
  // best-effort: on any problem we treat the visitor as logged out and let the
  // request continue. The auth-gating below still applies when it works.
  let user = null
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      })

      // Sessie verversen — NOOIT verwijderen, anders worden sessies niet bijgewerkt
      const {
        data: { user: signedInUser },
      } = await supabase.auth.getUser()
      user = signedInUser
    } catch {
      // Supabase niet bereikbaar of niet geconfigureerd — ga verder als
      // uitgelogd zodat de publieke pagina's blijven werken.
      user = null
    }
  }

  // ── FRAMER REDIRECT ────────────────────────────────────────────
  // Zodra NEXT_PUBLIC_FRAMER_URL is ingesteld in Vercel, worden de
  // publieke marketing-pagina's doorgestuurd naar de Framer site.
  // De app-routes (/login, /signup, /dashboard, /api) blijven in Next.js.
  const framerUrl = process.env.NEXT_PUBLIC_FRAMER_URL
  if (framerUrl) {
    const publicRoutes = ['/', '/pricing', '/about']
    if (publicRoutes.includes(pathname)) {
      const target = pathname === '/' ? framerUrl : `${framerUrl}${pathname}`
      return NextResponse.redirect(target, { status: 302 })
    }
  }
  // ──────────────────────────────────────────────────────────────

  // Dashboard-routes alleen toegankelijk voor ingelogde gebruikers
  if (!user && pathname.startsWith('/dashboard')) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Ingelogde gebruikers wegsturen van auth-pagina's
  if (user && (pathname === '/login' || pathname === '/signup')) {
    const dashboardUrl = request.nextUrl.clone()
    dashboardUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashboardUrl)
  }

  // Set locale cookie if not already present
  if (!request.cookies.has('GBICT_LOCALE')) {
    const acceptLanguage = request.headers.get('accept-language')
    const locale = detectLocale(acceptLanguage)
    supabaseResponse.cookies.set('GBICT_LOCALE', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
