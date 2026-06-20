'use client'

import { useState, useEffect } from 'react'

interface Props {
  username:    string
  consistency: number
  topHabit:    string
  streak:      number
  totalDays:   number
}

export default function ShareCard({ username, consistency, topHabit, streak, totalDays }: Props) {
  const [copied,   setCopied]   = useState(false)
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  async function handleShare() {
    const text = `🔁 My HabitLoop stats:\n✓ ${consistency}% consistency\n🔥 ${streak} day streak\n📊 ${totalDays} habits logged\n\nBuild habits that stick → habitloop-rosy.vercel.app`
    if (canShare) {
      try { await navigator.share({ title: 'My HabitLoop Stats', text }); return } catch {}
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {}
  }

  return (
    <div className="space-y-3">
      {/* Card preview */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0F0E0C 0%, #141311 50%, #0a3d2e 100%)',
          border:     '1px solid rgba(29,158,117,0.25)',
          boxShadow:  '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <span
              className="font-display text-xl"
              style={{
                background: 'linear-gradient(135deg, #1DC48E, #9FE1CB)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              HabitLoop
            </span>
            <span className="text-[10px]" style={{ color: 'rgba(136,134,127,0.55)' }}>
              habitloop-rosy.vercel.app
            </span>
          </div>

          <div className="mb-5">
            <p className="text-sm mb-1" style={{ color: 'rgba(136,134,127,0.75)' }}>@{username}</p>
            <p
              className="font-display leading-none"
              style={{ fontSize: 52, color: '#1DC48E' }}
            >
              {consistency}%
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(136,134,127,0.75)' }}>
              30-day consistency
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Streak',    value: `${streak}d` },
              { label: 'Logged',    value: String(totalDays) },
              { label: 'Top habit', value: topHabit.split(' ').slice(0,2).join(' ') },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <p className="text-sm font-semibold" style={{ color: '#F7F6F3' }}>{s.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(136,134,127,0.65)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleShare} className="btn-primary w-full py-4 glow-brand">
        {copied
          ? '✓ Copied to clipboard!'
          : canShare
          ? 'Share my stats'
          : 'Copy to clipboard'}
      </button>
    </div>
  )
}
