import Link from 'next/link'
import { requestReset } from './actions'

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; sent?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error
  const sent = params.sent === 'true'

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-[var(--header)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[var(--surface)] px-8 py-8 backdrop-blur shadow-[inset_0_1px_0_rgba(16,185,129,0.18)]">
      <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text)]" style={{ letterSpacing: '-0.03em' }}>
        Wachtwoord vergeten
      </h1>
      <p className="mt-1.5 text-sm text-[var(--text-muted)]">
        Vul je e-mailadres in. We sturen je een link om een nieuw wachtwoord in te stellen.
      </p>

      {sent ? (
        <div className="mt-7 rounded-xl border border-emerald-500/30 bg-emerald-950/50 px-4 py-4 text-sm text-emerald-400">
          Gelukt. Als er een account bij dit e-mailadres hoort, ontvang je zo een resetlink in je inbox.
        </div>
      ) : (
        <form action={requestReset} className="mt-7 flex flex-col gap-5">
          {errorMsg && (
            <div className="rounded-xl border border-red-500/30 bg-red-950/60 px-4 py-3 text-sm text-red-400">
              {errorMsg}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-[var(--text-muted)]">
              E-mailadres
            </label>
            <input id="email" name="email" type="email" placeholder="jij@email.nl" required className={inputCls} />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#047857] px-7 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#059669]"
          >
            Stuur resetlink
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[var(--text-faint)]">
        Wachtwoord weer te binnen?{' '}
        <Link href="/login" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300">
          Inloggen
        </Link>
      </p>
    </div>
  )
}
