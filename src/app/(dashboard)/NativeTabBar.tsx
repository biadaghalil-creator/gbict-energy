'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Plug, TrendingDown, Bell, Settings } from 'lucide-react'
import { useIsNative } from '@/lib/native'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard',              label: 'Home',        icon: LayoutDashboard, exact: true },
  { href: '/dashboard/koppelingen',  label: 'Koppelen',    icon: Plug },
  { href: '/dashboard/besparingen',  label: 'Besparing',   icon: TrendingDown },
  { href: '/dashboard/notificaties', label: 'Activiteit',  icon: Bell },
  { href: '/dashboard/instellingen', label: 'Profiel',     icon: Settings },
]

/**
 * iOS-style bottom tab bar. Only rendered inside the native app — on the
 * website the existing sidebar/drawer stays untouched.
 */
export default function NativeTabBar() {
  const native = useIsNative()
  const pathname = usePathname()

  if (!native) return null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.07] bg-[#0D0E16]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] md:hidden">
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
                active ? 'text-violet-300' : 'text-slate-500'
              )}
            >
              <Icon className={cn('h-[22px] w-[22px] transition-colors', active ? 'text-violet-400' : 'text-slate-500')} />
              <span className="leading-none">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
