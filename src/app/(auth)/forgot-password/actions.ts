'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function requestReset(formData: FormData) {
  const email = formData.get('email') as string
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gbict-energy.com'

  let errorMessage: string | null = null
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    })
    if (error) errorMessage = error.message
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'Something went wrong.'
  }

  if (errorMessage) {
    redirect(`/forgot-password?error=${encodeURIComponent(errorMessage)}`)
  }
  redirect('/forgot-password?sent=true')
}
