/**
 * Subscription plans. Price IDs come from Stripe (Products → pricing) and are
 * provided via env so we never hardcode account-specific ids.
 */
export type PlanId = 'starter' | 'pro'

export type Plan = {
  id: PlanId
  name: string
  priceEur: number
  priceId: string | undefined
  features: string[]
}

export const TRIAL_DAYS = 14

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    priceEur: 15,
    priceId: process.env.STRIPE_PRICE_STARTER,
    features: [
      '1 batterij + 1 meter',
      'Automatische prijs-optimalisatie',
      'Besparingsoverzicht',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceEur: 25,
    priceId: process.env.STRIPE_PRICE_PRO,
    features: [
      'Onbeperkt apparaten',
      'Zonne-paneel optimalisatie',
      'VPP / virtueel energienet',
      'Prioriteit support',
    ],
  },
}

/** A profile counts as paying when trialing or active. */
export function hasActiveSubscription(
  status: string | null | undefined,
): boolean {
  return status === 'active' || status === 'trialing'
}
