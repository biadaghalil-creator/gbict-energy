import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS, type PlanId } from '@/lib/plans'

// Stripe needs the raw, unparsed body to verify the signature.
export const dynamic = 'force-dynamic'

function planFromPriceId(priceId: string | undefined): PlanId | null {
  if (!priceId) return null
  if (priceId === PLANS.starter.priceId) return 'starter'
  if (priceId === PLANS.pro.priceId) return 'pro'
  return null
}

function toISO(unixSeconds: number | null | undefined): string | null {
  return unixSeconds ? new Date(unixSeconds * 1000).toISOString() : null
}

async function syncSubscription(sub: Stripe.Subscription) {
  const admin = createAdminClient()
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer.id
  const item = sub.items.data[0]
  const priceId = item?.price?.id
  const plan = planFromPriceId(priceId)

  const update: Record<string, unknown> = {
    subscription_status: sub.status, // trialing | active | past_due | canceled | ...
    // In recent Stripe API versions the period lives on the subscription item.
    current_period_end: toISO(item?.current_period_end),
    trial_ends_at: toISO(sub.trial_end),
  }
  if (plan) update.plan = plan

  // Prefer the user_id we stamped in metadata; fall back to the customer id.
  const userId = sub.metadata?.user_id
  const query = admin.from('profiles').update(update)
  const { error } = userId
    ? await query.eq('id', userId)
    : await query.eq('stripe_customer_id', customerId)

  if (error) console.error('webhook: profile sync failed', error.message)
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const stripe = getStripe()
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error('webhook: signature verification failed', (err as Error).message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string)
          // Carry the user_id from the checkout session onto the subscription.
          if (!sub.metadata?.user_id && session.metadata?.user_id) {
            sub.metadata = { ...sub.metadata, user_id: session.metadata.user_id }
          }
          await syncSubscription(sub)
        }
        break
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await syncSubscription(event.data.object as Stripe.Subscription)
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('webhook: handler error', (err as Error).message)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
