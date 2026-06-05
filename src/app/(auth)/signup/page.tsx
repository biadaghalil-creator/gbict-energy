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

  return (
    <div className="glow-card px-8 py-8">
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
              className="input-dark"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-300">
              {t.auth.passwordLabel}
            </label>
            <input
              id="password" name="password" type="password"
              placeholder="Minimaal 8 tekens" required minLength={8}
              className="input-dark"
            />
          </div>

          <button type="submit" className="btn-3d-primary w-full justify-center" style={{ borderRadius: '0.875rem' }}>
            ⚡ {t.auth.signupBtn}
          </button>

          <p className="text-center text-xs text-slate-600">
            14 dagen gratis · geen creditcard · altijd opzegbaar
          </p>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        {t.auth.hasAccount}{' '}
        <Link href="/login"
          className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
          {t.auth.loginBtn}
        </Link>
      </p>
    </div>
  )
}
