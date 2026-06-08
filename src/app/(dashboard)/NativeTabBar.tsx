'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plug, TrendingDown, Bell, Settings } from 'lucide-react'
import { useIsNative } from '@/lib/native'
import { cn } from '@/lib/utils'
import { useT } from '@/hooks/use-t'
import type { TranslationDict } from '@/lib/i18n'

const tabs: { href: string; key: keyof TranslationDict['dashboard']['nav']; icon: typeof LayoutDashboard; exact?: boolean }[] = [
  { href: '/dashboard',              key: 'home',        icon: LayoutDashboard, exact: true },
  { href: '/dashboard/koppelingen',  key: 'connections', icon: Plug },
  { href: '/dashboard/besparingen',  key: 'savings',     icon: TrendingDown },
  { href: '/dashboard/notificaties', key: 'activity',    icon: Bell },
  { href: '/dashboard/instellingen', key: 'profile',     icon: Settings },
]

/**
 * iOS-style bottom tab bar. Only rendered inside the native app — on the
 * website the existing sidebar/drawer stays untouched.
 */
export default function NativeTabBar() {
  const native = useIsNative()
  const pathname = usePathname()
  const { t } = useT()

  if (!native) return null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-stretch justify-around px-1.5 pt-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors',
                active ? 'text-emerald-300' : 'text-[var(--text-faint)]'
              )}
            >
              <Icon className={cn('h-[22px] w-[22px] transition-colors', active ? 'text-emerald-400' : 'text-[var(--text-faint)]')} />
              <span className="leading-none">{t.dashboard.nav[tab.key]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
