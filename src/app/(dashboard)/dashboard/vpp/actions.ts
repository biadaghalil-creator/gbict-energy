'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function enrollVpp() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('profiles')
    .update({ vpp_enrolled: true })
    .eq('id', user.id)

  revalidatePath('/dashboard/vpp')
  return { ok: true }
}

export async function unenrollVpp() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await supabase
    .from('profiles')
    .update({ vpp_enrolled: false })
    .eq('id', user.id)

  revalidatePath('/dashboard/vpp')
  return { ok: true }
}
