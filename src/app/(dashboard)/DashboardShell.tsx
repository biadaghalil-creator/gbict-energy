'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Bell, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useIsNative } from '@/lib/native'
import ThemeToggle from '@/components/ThemeToggle'
import WidgetSync from '@/components/WidgetSync'
import NativeTabBar from './NativeTabBar'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useT } from '@/hooks/use-t'

type NavKey = 'dashboard' | 'connections' | 'savings' | 'activity' | 'friends' | 'vpp' | 'settings'

const navItems: { href: string; key: NavKey; exact?: boolean; badgeKey?: 'vppBadge' }[] = [
  { href: '/dashboard',               key: 'dashboard',   exact: true },
  { href: '/dashboard/koppelingen',   key: 'connections' },
  { href: '/dashboard/besparingen',   key: 'savings' },
  { href: '/dashboard/notificaties',  key: 'activity' },
  { href: '/dashboard/referral',      key: 'friends' },
  { href: '/dashboard/vpp',           key: 'vpp', badgeKey: 'vppBadge' },
  { href: '/dashboard/instellingen',  key: 'settings' },
]

export default function DashboardShell({
  children, userEmail,
}: {
  children: React.ReactNode
  userEmail: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const native = useIsNative()
  const { t, locale } = useT()

  const isActive = (item: typeof navItems[number]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const currentPage = navItems.find(isActive)
  const currentTitle = currentPage ? t.dashboard.nav[currentPage.key] : t.dashboard.nav.dashboard

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className={cn(
      'flex flex-col bg-[var(--bg)] text-[var(--text)] antialiased',
      native ? 'h-screen overflow-hidden' : 'min-h-screen'
    )}>
      {/* Subtiel grid op de achtergrond — geen groene waas */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_80%_at_50%_0%,#000_40%,transparent_90%)]" />
      <WidgetSync />

      {/* ── Horizontale topbalk (zoals de website) ── */}
      <header
        className={cn(
          'sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--header)] backdrop-blur-xl',
          native && 'pt-[env(safe-area-inset-top)]'
        )}
      >
        <div className="mx-auto flex h-[60px] w-full max-w-7xl items-center gap-5 px-5">
          {native ? (
            /* In de app: alleen de paginatitel — navigeren gaat via de
               zwevende orb-balk onderaan. */
            <span className="text-[17px] font-bold tracking-[-0.02em] text-[var(--text)]">
              {currentTitle}
            </span>
          ) : (
            <>
              {/* Logo */}
              <Link href="/dashboard" className="group flex shrink-0 items-center gap-2.5">
                <img
                  src="/gbict-logo.png"
                  alt="GBICT"
                  width={34}
                  height={34}
                  className="block rounded-[9px] transition-transform group-hover:scale-105"
                />
                <div className="hidden leading-none sm:block">
                  <p className="text-[14px] font-extrabold tracking-tight text-[var(--text)]">GBICT</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-400">Energy</p>
                </div>
              </Link>

              {/* Nav-links — horizontaal, scrollt op smal scherm */}
              <nav className="flex flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {navItems.map((item) => {
                  const active = isActive(item)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors',
                        active
                          ? 'bg-emerald-500/12 text-emerald-500 dark:text-emerald-300'
                          : 'text-[var(--text-faint)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                      )}
                    >
                      {t.dashboard.nav[item.key]}
                      {item.badgeKey && (
                        <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-500 dark:text-emerald-400">
                          {t.dashboard.nav[item.badgeKey]}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </>
          )}

          {/* Rechts: taal, thema, notificaties, account, uitloggen */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <LanguageSwitcher currentLocale={locale} />
            <ThemeToggle />
            <Link
              href="/dashboard/notificaties"
              aria-label={t.dashboard.nav.activity}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-faint)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
            >
              <Bell className="h-4 w-4" />
            </Link>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-emerald-500/10 text-[11px] font-bold text-emerald-500 ring-1 ring-emerald-500/20 dark:text-emerald-400">
                {userEmail?.[0]?.toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={handleLogout}
              aria-label={t.dashboard.nav.logout}
              title={t.dashboard.nav.logout}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-faint)] transition-colors hover:bg-[var(--surface-2)] hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 flex-1 overflow-auto">
        <div className={cn('mx-auto w-full max-w-6xl px-5 py-8', native && 'pb-28')}>
          {children}
        </div>
      </main>

      {/* Zwevende orb-navigatie — alleen in de native app (onderaan) */}
      <NativeTabBar />
    </div>
  )
}
