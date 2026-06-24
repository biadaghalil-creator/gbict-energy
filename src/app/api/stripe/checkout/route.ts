import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, isStripeConfigured } from '@/lib/stripe'
import { PLANS, TRIAL_DAYS, type PlanId } from '@/lib/plans'

/**
 * Creates a Stripe Checkout Session for the signed-in user and returns its URL.
 * Body: { plan: 'starter' | 'pro' }
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

  const stripe = getStripe()

  const { plan } = (await req.json().catch(() => ({}))) as { plan?: PlanId }
  const selected = plan && PLANS[plan]
  if (!selected || !selected.priceId) {
    return NextResponse.json({ error: 'Onbekend of niet-geconfigureerd plan.' }, { status: 400 })
  }

  // Reuse the Stripe customer id if we already have one.
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id as string | null | undefined

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get('origin') ||
    'https://gbict-energy.com'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: selected.priceId, quantity: 1 }],
      // Require a card up front; nothing is charged during the trial, then it
      // auto-charges the full amount after TRIAL_DAYS.
      payment_method_collection: 'always',
      subscription_data: {
        trial_period_days: TRIAL_DAYS,
        metadata: { user_id: user.id, plan: selected.id },
      },
      metadata: { user_id: user.id, plan: selected.id },
      allow_promotion_codes: true,
      success_url: `${origin}/dashboard?subscribed=1`,
      cancel_url: `${origin}/dashboard/instellingen?canceled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Onbekende fout bij Stripe'
    console.error('checkout: stripe error', msg)
    return NextResponse.json({ error: `Stripe: ${msg}` }, { status: 500 })
  }
}
