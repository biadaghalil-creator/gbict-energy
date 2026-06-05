import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BesparingenClient from './BesparingenClient'

export default async function BesparingenPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <BesparingenClient />
}
