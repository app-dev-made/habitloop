'use client'

import { useState, useRef } from 'react'

interface ShareCardProps {
  username: string
  consistency: number
  topHabit: string
  streak: number
  totalDays: number
}

export default function ShareCard({ username, consistency, topHabit, streak, totalDays }: ShareCardProps) {
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  async function handleShare() {
    const text = `🔁 My HabitLoop stats:\n✓ ${consistency}% consistency\n🔥 ${streak} day streak\n📊 ${totalDays} habits logged\n\nBuild habits that stick → habitloop-rosy.vercel.app`
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My HabitLoop Stats', text })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Shareable card preview */}
      <div ref={cardRef} className="rounded-3xl overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0F0E0C 0%, #1E1D1A 50%, #085041 100%)',
        border: '1px solid rgba(29,158,117,0.3)',
      }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-xl" style={{ background: 'linear-gradient(135deg,#1D9E75,#9FE1CB)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              HabitLoop
            </span>
            <span className="text-ink-500 text-xs">habitloop-rosy.vercel.app</span>
          </div>

          <div className="mb-6">
            <p className="text-ink-400 text-sm mb-1">@{username}</p>
            <p className="font-display text-5xl text-teal-400">{consistency}%</p>
            <p className="text-ink-400 text-sm">30-day consistency</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Streak', value: `${streak}🔥` },
              { label: 'Logged', value: `${totalDays}` },
              { label: 'Top habit', value: topHabit.split(' ').slice(0,2).join(' ') },
            ].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-ink-50 text-sm font-semibold">{s.value}</p>
                <p className="text-ink-500 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={handleShare} className="btn-primary w-full py-4 glow-teal">
        {copied ? '✓ Copied to clipboard!' : navigator.share ? '📤 Share my stats' : '📋 Copy to clipboard'}
      </button>
    </div>
  )
}
