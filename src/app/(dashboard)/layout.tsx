import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from './DashboardShell'
import NoAccess from './NoAccess'

// ── Toegang ────────────────────────────────────────────────────────────────
// Tijdelijke privé-fase: ALLEEN deze gebruikers mogen de app in. De rest ziet
// een "geen toegang"-scherm. Toegestane gebruikers krijgen volledige toegang
// zonder betaal-gate (Stripe komt later). Voeg hier e-mails toe om door te laten.
const ALLOWED_EMAILS = ['ghalil@gbict.nl']

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const email = (user.email ?? '').trim().toLowerCase()
  if (!ALLOWED_EMAILS.includes(email)) {
    // Niemand anders mag er nu in. Geen redirect (voorkomt loops) — gewoon
    // een duidelijk scherm met de mogelijkheid om uit te loggen.
    return <NoAccess email={user.email ?? ''} />
  }

  return (
    <DashboardShell userEmail={user.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
