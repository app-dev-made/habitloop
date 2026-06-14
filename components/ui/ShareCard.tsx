'use client'

import { useState, useEffect } from 'react'

interface ShareCardProps {
  username: string
  consistency: number
  topHabit: string
  streak: number
  totalDays: number
}

export default function ShareCard({ username, consistency, topHabit, streak, totalDays }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  // Only access navigator on client
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  async function handleShare() {
    const text = `🔁 My HabitLoop stats:\n✓ ${consistency}% consistency\n🔥 ${streak} day streak\n📊 ${totalDays} habits logged\n\nBuild habits that stick → habitloop-rosy.vercel.app`

    if (canShare) {
      try {
        await navigator.share({ title: 'My HabitLoop Stats', text })
        return
      } catch (e) {
        // User cancelled share, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <div className="space-y-4">
      {/* Shareable card preview */}
      <div className="rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0F0E0C 0%, #1a1917 50%, #0a3d2e 100%)',
        border: '1px solid rgba(29,158,117,0.3)',
      }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-xl gradient-text">HabitLoop</span>
            <span className="text-[10px]" style={{ color: 'rgba(136,134,127,0.6)' }}>habitloop-rosy.vercel.app</span>
          </div>

          <div className="mb-6">
            <p className="text-sm mb-1" style={{ color: 'rgba(136,134,127,0.8)' }}>@{username}</p>
            <p className="font-display text-6xl text-teal-400 leading-none">{consistency}%</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(136,134,127,0.8)' }}>30-day consistency</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Streak',    value: `${streak}🔥` },
              { label: 'Logged',    value: String(totalDays) },
              { label: 'Top habit', value: topHabit.split(' ').slice(0, 2).join(' ') },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold text-white">{s.value}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(136,134,127,0.7)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleShare} className="btn-primary w-full py-4 glow-teal">
        {copied
          ? '✓ Copied to clipboard!'
          : canShare
          ? '📤 Share my stats'
          : '📋 Copy to clipboard'}
      </button>
    </div>
  )
}
