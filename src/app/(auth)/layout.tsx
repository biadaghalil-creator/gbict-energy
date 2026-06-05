import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 hero-bg">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 shrink-0">
              <Image
                src="/gbict-logo.webp"
                alt="GBICT logo"
                width={44}
                height={44}
                className="rounded-xl logo-glow group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-tight text-slate-50">GBICT</span>
              <span className="text-sm font-medium text-gradient-blue">Energy</span>
            </div>
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
