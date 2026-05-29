import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BesparingenClient from './BesparingenClient'

export default async function BesparingenPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Besparingen
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Overzicht van je automatische energiebesparingen.
        </p>
      </div>

      <BesparingenClient />
    </div>
  )
}
