'use client'

import { format } from 'date-fns'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function DashboardNav({ user }: { user: User }) {
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <header className="safe-top px-6 pt-6 pb-4 flex items-start justify-between">
      <div>
        <p className="section-label mb-1">{format(new Date(), 'EEEE, MMM d')}</p>
        <h1 className="font-display text-2xl text-ink-50">
          {greeting}
        </h1>
      </div>
      <Link
        href="/dashboard/settings"
        className="w-9 h-9 rounded-full bg-ink-800 border border-ink-600/40 flex items-center justify-center text-ink-300 hover:text-teal-400 hover:border-teal-400/40 transition-colors"
        title="Settings"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="2.5"/>
          <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"/>
        </svg>
      </Link>
    </header>
  )
}
