import Link from 'next/link'
import { signup } from './actions'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error
  const isSuccess = params.success === 'true'

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Account aanmaken
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Start gratis — geen creditcard nodig
      </p>

      {isSuccess ? (
        <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950 dark:border-emerald-900 dark:text-emerald-300">
          ✅ Check je email! We hebben een bevestigingslink gestuurd naar je inbox.
        </div>
      ) : (
        <form action={signup} className="mt-6 flex flex-col gap-4">
          {errorMsg && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:border-red-900 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jij@email.nl"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Wachtwoord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimaal 8 tekens"
              required
              minLength={8}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
          >
            Account aanmaken
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-zinc-500">
        Al een account?{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Inloggen
        </Link>
      </p>
    </div>
  )
}
