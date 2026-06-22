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
    'w-full rounded-2xl border border-[rgba(33,29,22,0.10)] bg-[#FBF7EF] px-4 py-3 text-[15px] text-[#211D16] placeholder:text-[#938C7C] outline-none transition focus:border-[#5C8A5E] focus:bg-white focus:ring-4 focus:ring-[rgba(47,93,58,0.10)]'

  return (
    <div className="rounded-[28px] border border-[rgba(33,29,22,0.07)] bg-white px-8 py-9 shadow-[0_2px_6px_rgba(33,29,22,0.06),0_24px_60px_rgba(33,29,22,0.10)]">
      <h1 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[#211D16]">
        Nieuw wachtwoord instellen
      </h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#5C5648]">
        Kies een nieuw wachtwoord voor je account.
      </p>

      <form action={updatePassword} className="mt-7 flex flex-col gap-5">
        {errorMsg && (
          <div className="rounded-2xl border border-[rgba(194,112,44,0.30)] bg-[#F4E6D8] px-4 py-3 text-sm text-[#A6531E]">
            {errorMsg}
          </div>
        )}

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#5C5648]">
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
          className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-[#2F5D3A] px-7 py-3.5 text-[16px] font-semibold tracking-[-0.01em] text-white shadow-[0_8px_20px_rgba(47,93,58,0.32)] transition hover:bg-[#24492D] active:scale-[0.98]"
        >
          Wachtwoord opslaan
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#5C5648]">
        <Link href="/login" className="font-semibold text-[#2F5D3A] transition-colors hover:text-[#24492D]">
          Terug naar inloggen
        </Link>
      </p>
    </div>
  )
}
