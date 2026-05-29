import Link from 'next/link'
import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const errorMsg = params.error

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-8 dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Welkom terug
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Log in op je GBICT Energy account
      </p>

      <form action={login} className="mt-6 flex flex-col gap-4">
        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
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
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Wachtwoord
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              Vergeten?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Jouw wachtwoord"
            required
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-emerald-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          Inloggen
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Nog geen account?{' '}
        <Link
          href="/signup"
          className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
        >
          Aanmelden
        </Link>
      </p>
    </div>
  )
}
