'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gbict-energy.vercel.app'

  // Never let an unexpected throw bubble up as an opaque "server error" screen —
  // surface the real message back on the form instead.
  let errorMessage: string | null = null
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${siteUrl}/auth/callback` },
    })
    if (error) errorMessage = error.message
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'Onbekende fout bij aanmelden'
  }

  if (errorMessage) {
    redirect(`/signup?error=${encodeURIComponent(errorMessage)}`)
  }

  redirect('/signup?success=true')
}
