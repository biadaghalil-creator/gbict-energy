import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Schermt het statische webdashboard (public/webapp/*) af achter de login.
// Zonder geldige Supabase-sessie -> terug naar /login. Alleen toegestane
// e-mails mogen erin (privé-fase).
const ALLOWED_EMAILS = ['ghalil@gbict.nl']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(toSet) { toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options)) },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  const email = (user?.email ?? '').toLowerCase()
  if (!user || !ALLOWED_EMAILS.includes(email)) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return NextResponse.redirect(url)
  }
  return res
}

export const config = { matcher: ['/webapp/:path*'] }
