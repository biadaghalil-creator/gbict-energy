import { createHmac, timingSafeEqual } from 'crypto'

// Stateless, signed token that lets the iOS home-screen widget fetch a user's
// summary without a logged-in session. The token is `<userId>.<sig>` where the
// signature is an HMAC of the userId with a server-only secret. No DB column or
// extra env var needed — we reuse the service-role key as the signing secret
// (it never leaves the server).

function secret(): string {
  const s = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!s) throw new Error('SUPABASE_SERVICE_ROLE_KEY not set')
  return s
}

function sign(userId: string): string {
  return createHmac('sha256', secret()).update(userId).digest('base64url')
}

export function signWidgetToken(userId: string): string {
  return `${userId}.${sign(userId)}`
}

export function verifyWidgetToken(token: string | null | undefined): string | null {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const userId = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = sign(userId)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return null
  return timingSafeEqual(a, b) ? userId : null
}
