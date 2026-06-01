'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    href: '/dashboard',
    label: 'Today',
    exact: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="3"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
        {active && <path d="M8 14l2 2 4-4" strokeWidth="2.5"/>}
      </svg>
    ),
  },
  {
    href: '/dashboard/habits',
    label: 'Habits',
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/insights',
    label: 'Insights',
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4"/>
        <path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 safe-bottom"
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}
      aria-label="Main navigation"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around px-1 pt-2 pb-1">
        {TABS.map(tab => {
          const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-label={tab.label}
              aria-current={active ? 'page' : undefined}
              className={`tab-item flex-1 ${active ? 'active' : ''}`}
            >
              <span className={`transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}>
                {tab.icon(active)}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide transition-all ${active ? 'text-teal-400' : ''}`}>
                {tab.label}
              </span>
              {active && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-teal-400 rounded-b-full" aria-hidden="true" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
