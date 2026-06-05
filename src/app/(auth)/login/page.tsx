import Link from 'next/link'
import { login } from './actions'
import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/i18n'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error
  const locale = await getLocale()
  const t = getTranslations(locale)

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-[#07080D]/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20'

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-[#0D0E16]/80 px-8 py-8 backdrop-blur shadow-[inset_0_1px_0_rgba(139,92,246,0.18)]">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-50" style={{ letterSpacing: '-0.03em' }}>
        {t.auth.loginTitle}
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        {t.auth.loginSubtitle}
      </p>

      <form action={login} className="mt-7 flex flex-col gap-5">
        {errorMsg && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/60 px-4 py-3 text-sm text-red-400">
            {errorMsg}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-300">
            {t.auth.emailLabel}
          </label>
          <input
            id="email" name="email" type="email"
            placeholder="jij@email.nl" required
            className={inputCls}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              {t.auth.passwordLabel}
            </label>
            <Link href="/forgot-password"
              className="text-xs text-slate-500 hover:text-violet-400 transition-colors">
              Vergeten?
            </Link>
          </div>
          <input
            id="password" name="password" type="password"
            placeholder="Jouw wachtwoord" required
            className={inputCls}
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#5B21B6] px-7 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#6D28D9]"
        >
          {t.auth.loginBtn}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {t.auth.noAccount}{' '}
        <Link href="/signup"
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          {t.auth.signupBtn}
        </Link>
      </p>
    </div>
  )
}
