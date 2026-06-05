import Link from 'next/link'
import { signup } from './actions'
import { getLocale } from '@/lib/locale'
import { getTranslations } from '@/lib/i18n'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error
  const isSuccess = params.success === 'true'
  const locale = await getLocale()
  const t = getTranslations(locale)

  const inputCls =
    'w-full rounded-xl border border-white/10 bg-[#07080D]/80 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20'

  return (
    <div className="rounded-2xl border border-violet-500/20 bg-[#0D0E16]/80 px-8 py-8 backdrop-blur shadow-[inset_0_1px_0_rgba(139,92,246,0.18)]">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-50" style={{ letterSpacing: '-0.03em' }}>
        {t.auth.signupTitle}
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        {t.auth.signupSubtitle}
      </p>

      {isSuccess ? (
        <div className="mt-7 rounded-xl border border-emerald-500/30 bg-emerald-950/50 px-4 py-4 text-sm text-emerald-400">
          ✅ Check je email! We hebben een bevestigingslink gestuurd naar je inbox.
        </div>
      ) : (
        <form action={signup} className="mt-7 flex flex-col gap-5">
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
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              {t.auth.passwordLabel}
            </label>
            <input
              id="password" name="password" type="password"
              placeholder="Minimaal 8 tekens" required minLength={8}
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#5B21B6] px-7 text-[15px] font-semibold tracking-[-0.01em] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-colors hover:bg-[#6D28D9]"
          >
            {t.auth.signupBtn}
          </button>

          <p className="text-center text-xs text-slate-600">
            14 dagen gratis · geen creditcard · altijd opzegbaar
          </p>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {t.auth.hasAccount}{' '}
        <Link href="/login"
          className="font-semibold text-violet-400 hover:text-violet-300 transition-colors">
          {t.auth.loginBtn}
        </Link>
      </p>
    </div>
  )
}
