'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

/**
 * Getoond aan ingelogde gebruikers die (nog) geen toegang hebben tijdens de
 * privé-fase. Geen redirect — voorkomt login-loops. Wel uitloggen mogelijk.
 */
export default function NoAccess({ email }: { email: string }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
        <Lock className="h-7 w-7 text-emerald-500" />
      </div>
      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-[var(--text)]">
        Nog geen toegang
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[var(--text-muted)]">
        GBICT Energy is op dit moment alleen voor genodigden. Je account
        {email ? ` (${email})` : ''} staat nog niet op de lijst.
      </p>
      <button
        onClick={handleLogout}
        className="mt-8 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
      >
        Uitloggen
      </button>
    </div>
  )
}
