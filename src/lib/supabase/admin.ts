import { createClient } from '@supabase/supabase-js'

// Service-role client — bypasses RLS, alleen server-side gebruiken
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY niet ingesteld')
  return createClient(url, key, { auth: { persistSession: false } })
}
