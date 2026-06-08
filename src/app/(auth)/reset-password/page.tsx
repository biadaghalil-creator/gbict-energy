import Link from 'next/link'
import { updatePassword } from './actions'

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-[#07080D]/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20'

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[#0D0E16]/80 px-8 py-8 backdrop-blur shadow-[inset_0_1px_0_rgba(16,185,129,0.18)]">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-50" style={{ letterSpacing: '-0.03em' }}>
        Nieuw wachtwoord instellen
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Kies een nieuw wachtwoord voor je account.
      </p>

      <form action={updatePassword} className="mt-7 flex flex-col gap-5">
        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/60 px-4 py-3 text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
            Nieuw wachtwoord
          </label>
          <input
            id="password" name="password" type="password"
            placeholder="Minimaal 8 tekens" required minLength={8}
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#047857] px-7 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#059669]"
        >
          Wachtwoord opslaan
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link href="/login" className="font-semibold text-emerald-400 transition-colors hover:text-emerald-300">
          Terug naar inloggen
        </Link>
      </p>
    </div>
  )
}
