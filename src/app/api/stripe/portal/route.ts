import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, isStripeConfigured } from '@/lib/stripe'

/**
 * Opens the Stripe Billing Portal so the user can manage / cancel their
 * subscription and see invoices. Returns the portal URL.
 */
export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: 'Betalen is nog niet geconfigureerd.' }, { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Niet ingelogd.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  const customerId = profile?.stripe_customer_id as string | null | undefined
  if (!customerId) {
    return NextResponse.json({ error: 'No subscription found.' }, { status: 400 })
  }

  const stripe = getStripe()

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get('origin') ||
    'https://gbict-energy.com'

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${origin}/dashboard/instellingen`,
  })

  return NextResponse.json({ url: session.url })
}
