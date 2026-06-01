'use client'

import { format } from 'date-fns'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function DashboardNav({ user }: { user: User }) {
  const hour = new Date().getHours()
  const greeting = hour < 5 ? 'Still up?' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Good night'
  const greetingEmoji = hour < 5 ? '🌙' : hour < 12 ? '☀️' : hour < 17 ? '⚡' : hour < 21 ? '🌇' : '🌙'
  const name = (user.user_metadata?.name || user.email?.split('@')[0] || 'there') as string
  const initial = name.charAt(0).toUpperCase()

  return (
    <header className="pwa-header px-5 pb-4 flex items-start justify-between">
      <div>
        <p className="section-label mb-1">{format(new Date(), 'EEEE, MMMM d')}</p>
        <h1 className="font-display leading-tight" style={{ fontSize: 28, color: 'var(--text-primary)' }}>
          {greetingEmoji} {greeting},
        </h1>
        <h1 className="font-display leading-tight gradient-text" style={{ fontSize: 28 }}>
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h1>
      </div>
      <Link
        href="/dashboard/settings"
        className="mt-2 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-ink-900 bg-teal-400 text-sm hover:bg-teal-200 transition-colors active:scale-90"
        aria-label="Settings"
      >
        {initial}
      </Link>
    </header>
  )
}
