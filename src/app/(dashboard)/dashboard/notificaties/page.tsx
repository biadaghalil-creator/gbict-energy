import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import NotificatiesClient from './NotificatiesClient'

interface OptimizationLog {
  id: string
  action: string
  price_eur: number
  savings_eur: number
  created_at: string
}

export default async function NotificatiesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: logs } = await supabase
    .from('optimization_logs')
    .select('id, action, price_eur, savings_eur, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return <NotificatiesClient logs={(logs ?? []) as OptimizationLog[]} />
}
