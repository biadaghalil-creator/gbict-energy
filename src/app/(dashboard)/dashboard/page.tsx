import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TibberData from './TibberData'
import SessyCard from './SessyCard'
import SavingsCards from './SavingsCards'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check of onboarding al gedaan is
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_completed) redirect('/onboarding')

  // Check welke apparaten gekoppeld zijn
  const { data: devices } = await supabase
    .from('devices')
    .select('type')
    .eq('user_id', user.id)
    .eq('status', 'active')

  const hasTibber = devices?.some(d => d.type === 'meter_tibber') ?? false
  const hasSessy  = devices?.some(d => d.type === 'battery_sessy') ?? false

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Goedemorgen 👋
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {hasTibber
            ? 'Live energieprijzen via Tibber.'
            : 'Koppel je slimme meter om te beginnen.'}
        </p>
      </div>

      {/* Status kaarten */}
      <div className={`grid gap-4 ${hasSessy ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
        {hasTibber ? (
          <TibberData />
        ) : (
          <StatCard
            title="Huidige prijs"
            value="€ —"
            sub="Koppel Tibber om te starten"
            color="zinc"
          />
        )}

        {hasSessy ? (
          <SavingsCards />
        ) : (
          <>
            <StatCard title="Vandaag bespaard" value="€ —" sub="Koppel Sessy voor auto-besparen" color="zinc" />
            <StatCard title="Deze maand" value="€ —" sub="Data beschikbaar na koppeling" color="zinc" />
          </>
        )}

        {hasSessy ? (
          <SessyCard />
        ) : (
          <StatCard
            title="Batterij status"
            value="—"
            sub="Geen batterij gekoppeld"
            color="zinc"
          />
        )}
      </div>

      {/* Onboarding stap — alleen als geen apparaten gekoppeld */}
      {!hasTibber && (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
            <svg
              className="h-6 w-6 text-emerald-600 dark:text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
              />
            </svg>
          </div>
          <h2 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
            Koppel je eerste apparaat
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Verbind je slimme meter of energiecontract. Duurt minder dan 2 minuten.
          </p>
          <a
            href="/dashboard/koppelingen"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-emerald-500 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
          >
            Apparaat koppelen
          </a>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  sub,
  color,
}: {
  title: string
  value: string
  sub: string
  color: 'emerald' | 'zinc'
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight ${
          color === 'emerald'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-zinc-400 dark:text-zinc-500'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-zinc-400">{sub}</p>
    </div>
  )
}
