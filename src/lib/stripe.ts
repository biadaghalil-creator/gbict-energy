import Stripe from 'stripe'

/**
 * Lazily-created server-side Stripe client. Constructed on first use so that
 * builds (and routes that run without the key) don't crash at import time.
 * Never import this in client components.
 */
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    _stripe = new Stripe(key, { typescript: true })
  }
  return _stripe
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY)
}
