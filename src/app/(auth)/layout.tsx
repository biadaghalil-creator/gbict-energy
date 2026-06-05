import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#07080D] px-4">
      {/* Violet ambient glow — matches the landing page */}
      <div className="pointer-events-none absolute left-1/2 top-[-320px] z-0 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(124,58,237,0.25),rgba(109,40,217,0.1)_45%,transparent_70%)] blur-xl" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 shrink-0">
              <Image
                src="/gbict-logo.webp"
                alt="GBICT logo"
                width={44}
                height={44}
                className="rounded-xl group-hover:scale-105 transition-transform duration-200"
                style={{ filter: 'drop-shadow(0 0 10px rgba(124,58,237,0.45))' }}
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-slate-50">GBICT</span>
              <span className="text-sm font-medium text-violet-400">Energy</span>
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
