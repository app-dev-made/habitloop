'use client'

import { useState, useRef } from 'react'
import type { Habit, LogStatus } from '@/types'
import { statusClasses, statusIcon, riskLabel, CATEGORIES } from '@/lib/habits'

interface Props {
  habit: Habit & { today_log: any; skip_risk: number | null }
  onTap: () => void
  onArchive: () => void
  isTapped: boolean
  index: number
}

export default function HabitCard({ habit, onTap, onArchive, isTapped, index }: Props) {
  const [swipeX, setSwipeX] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const startX = useRef(0)
  const status = habit.today_log?.status as LogStatus | undefined
  const risk = habit.skip_risk
  const cat = CATEGORIES[habit.category]

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    setSwiping(true)
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!swiping) return
    const dx = e.touches[0].clientX - startX.current
    if (dx < 0) setSwipeX(Math.max(dx, -80))
  }

  function onTouchEnd() {
    setSwiping(false)
    if (swipeX < -60) {
      onArchive()
    } else {
      setSwipeX(0)
    }
  }

  return (
    <div
      className="animate-fade-up relative overflow-hidden rounded-2xl"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Archive hint revealed on swipe */}
      <div className="absolute inset-y-0 right-0 flex items-center px-4 rounded-2xl" style={{ background: 'rgba(239,68,68,0.15)', minWidth: 80 }}>
        <div className="text-center">
          <span className="text-2xl block">🗑</span>
          <span className="text-red-400 text-[10px] font-medium">Archive</span>
        </div>
      </div>

      {/* Main card */}
      <div
        style={{ transform: `translateX(${swipeX}px)`, transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button
          onClick={onTap}
          className={`log-btn ${statusClasses(status)} ${isTapped ? 'scale-98' : ''} w-full`}
          aria-label={`${habit.name} — ${status ?? 'not logged'}. Tap to log.`}
          aria-pressed={status === 'done'}
        >
          <div className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center text-lg flex-shrink-0 transition-all duration-200 ${statusClasses(status)} ${isTapped ? 'scale-110' : ''}`} aria-hidden="true">
            {status ? <span className="text-base font-bold">{statusIcon(status)}</span> : <span>{cat.emoji}</span>}
          </div>

          <div className="flex-1 text-left">
            <p className={`font-semibold text-sm ${status === 'done' ? 'line-through opacity-50' : ''}`} style={{ color: 'var(--text-primary)' }}>
              {habit.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
              {habit.target_frequency < 7 && (
                <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{habit.target_frequency}×/wk</span>
              )}
            </div>
          </div>

          {risk !== null && risk >= 50 && !status && (
            <div className="flex flex-col items-center" aria-label={`Skip risk: ${risk}%`}>
              <span className={`text-xs font-bold ${riskLabel(risk).color}`}>{risk}%</span>
              <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>risk</span>
            </div>
          )}

          {status === 'done' && <span className="text-teal-400 text-xl" aria-hidden="true">✓</span>}
        </button>
      </div>
    </div>
  )
}
