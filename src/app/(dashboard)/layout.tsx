import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from './DashboardShell'
import NoAccess from './NoAccess'

// ── Access ─────────────────────────────────────────────────────────────────
// Temporary private phase: ONLY these users may enter the app. Everyone else
// sees a "no access" screen. Allowed users get full access without a payment
// gate (Stripe comes later). Add emails here to let them through.
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
    // No one else may enter right now. No redirect (prevents loops) — just
    // a clear screen with the option to sign out.
    return <NoAccess email={user.email ?? ''} />
  }

  return (
    <DashboardShell userEmail={user.email ?? ''}>
      {children}
    </DashboardShell>
  )
}
