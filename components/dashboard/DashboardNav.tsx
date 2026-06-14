'use client'

import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

interface Props {
  user:   User
  streak: number
}

// ── Icons (SVG — no emoji as structural icons per UI/UX Pro Max) ──────────────
function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function FlameIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C8.5 6 7 9 8 13c-2-1-3-3-2.5-5.5C2 10 1 14 3 17c1 2 3 4 6 4.5V18c0-1.5 1-3 2-4 .5 1 .5 2 0 3 2-1 3.5-3 3.5-5.5 0-3-2-5.5-2-9.5z"/>
    </svg>
  )
}

function AddIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
}

export default function DashboardNav({ user, streak }: Props) {
  const [mounted, setMounted] = useState(false)
  const [time, setTime]       = useState(new Date())

  // Live clock — updates every minute
  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => setTime(new Date()), 60_000)
    return () => clearInterval(interval)
  }, [])

  const hour = time.getHours()
  const greeting =
    hour < 5  ? 'Still up?' :
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    hour < 21 ? 'Good evening' : 'Good night'

  const name    = (user.user_metadata?.name || user.email?.split('@')[0] || 'there') as string
  const initial = name.charAt(0).toUpperCase()

  // Streak tier for ring color
  const streakTier =
    streak >= 30 ? 'legendary' :
    streak >= 14 ? 'strong' :
    streak >= 7  ? 'building' :
    streak >= 3  ? 'starting' : 'none'

  const streakRingColors: Record<string, string> = {
    legendary: 'conic-gradient(from 0deg, #FCD34D, #F59E0B, #FCD34D)',
    strong:    'conic-gradient(from 0deg, #1DC48E, #4DD9AC, #1DC48E)',
    building:  'conic-gradient(from 0deg, #1D9E75, #4DD9AC, #1D9E75)',
    starting:  'conic-gradient(from 0deg, #1D9E75, #0C3F2F, #1D9E75)',
    none:      'none',
  }

  return (
    <header
      className="pwa-header px-4 pb-3"
      role="banner"
    >
      {/* ── Top row: date + actions ───────────────────────── */}
      <div className="flex items-center justify-between mb-3">
        {/* Live date */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium"
            style={{
              background:   'var(--bg-elevated)',
              border:       '1px solid var(--border-subtle)',
              color:        'var(--text-tertiary)',
              letterSpacing: '0.03em',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            {mounted ? format(time, 'EEE, MMM d') : ''}
          </div>

          {/* Streak badge — only at 3+ */}
          {streak >= 3 && (
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
              style={{
                background: streakTier === 'legendary'
                  ? 'rgba(245,158,11,0.12)'
                  : 'rgba(29,158,117,0.10)',
                color: streakTier === 'legendary' ? '#FCD34D' : 'var(--brand-light)',
                border: `1px solid ${streakTier === 'legendary' ? 'rgba(245,158,11,0.25)' : 'rgba(29,158,117,0.20)'}`,
              }}
              aria-label={`${streak}-day streak`}
            >
              <FlameIcon />
              {streak}d
              {streak >= 30 && <span className="ml-0.5">🏆</span>}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Quick-add shortcut */}
          <Link
            href="/dashboard/habits?action=add"
            className="btn-icon w-9 h-9 rounded-xl"
            aria-label="Add a new habit"
          >
            <AddIcon />
          </Link>

          {/* Avatar → settings with streak ring */}
          <Link
            href="/dashboard/settings"
            className="relative flex-shrink-0"
            aria-label="Go to settings"
          >
            {/* Animated streak ring */}
            {streak >= 3 && (
              <div
                className="absolute -inset-0.5 rounded-2xl animate-spin-slow"
                style={{
                  background:   streakRingColors[streakTier],
                  borderRadius: '14px',
                  opacity:      0.85,
                  zIndex:       0,
                }}
                aria-hidden="true"
              />
            )}
            <div
              className="relative z-10 w-9 h-9 rounded-xl flex items-center justify-center
                         font-bold text-sm transition-transform duration-150 active:scale-90"
              style={{
                background: 'var(--brand)',
                color:      '#0F0E0C',
                boxShadow:  streak >= 3 ? 'var(--shadow-brand)' : 'none',
              }}
            >
              {initial}
            </div>
          </Link>

          {/* Settings icon — separate for clarity */}
          <Link
            href="/dashboard/settings"
            className="btn-icon w-9 h-9 rounded-xl hidden sm:flex"
            aria-label="Settings"
          >
            <SettingsIcon />
          </Link>
        </div>
      </div>

      {/* ── Greeting ──────────────────────────────────────── */}
      <div className="min-w-0">
        <p
          className="font-body text-sm mb-0.5"
          style={{ color: 'var(--text-tertiary)' }}
        >
          {greeting},
        </p>
        <h1
          className="font-display leading-tight"
          style={{ fontSize: 'clamp(22px, 6vw, 30px)', color: 'var(--text-primary)' }}
        >
          <span className="gradient-text">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        </h1>
      </div>

      {/* ── Subtle bottom divider ──────────────────────────── */}
      <div
        className="mt-3 h-px"
        style={{ background: 'var(--border-subtle)' }}
        aria-hidden="true"
      />
    </header>
  )
}
