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

  return (
    <div className="glow-card px-8 py-8">
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
            className="input-dark"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              {t.auth.passwordLabel}
            </label>
            <Link href="/forgot-password"
              className="text-xs text-slate-500 hover:text-yellow-400 transition-colors">
              Vergeten?
            </Link>
          </div>
          <input
            id="password" name="password" type="password"
            placeholder="Jouw wachtwoord" required
            className="input-dark"
          />
        </div>

        <button type="submit" className="btn-3d-primary w-full justify-center" style={{ borderRadius: '0.875rem' }}>
          {t.auth.loginBtn}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        {t.auth.noAccount}{' '}
        <Link href="/signup"
          className="font-semibold text-yellow-400 hover:text-yellow-300 transition-colors">
          {t.auth.signupBtn}
        </Link>
      </p>
    </div>
  )
}
