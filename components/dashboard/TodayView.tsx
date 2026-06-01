'use client'

import { useState, useTransition, useEffect } from 'react'
import type { Habit, LogStatus } from '@/types'
import { riskLabel, CATEGORIES } from '@/lib/habits'
import { logHabit, archiveHabit } from '@/app/dashboard/actions'
import ConsistencyRing from '@/components/habits/ConsistencyRing'
import AddHabitModal from '@/components/habits/AddHabitModal'
import HabitCard from '@/components/habits/HabitCard'
import Confetti from '@/components/ui/Confetti'
import InstallBanner from '@/components/ui/InstallBanner'
import Link from 'next/link'

interface Props {
  habits: (Habit & { today_log: any; skip_risk: number | null; consistency_30d: number })[]
  userId: string
}

type SkipReason = 'forgot' | 'too_tired' | 'too_busy' | 'unmotivated' | 'sick' | 'traveling' | 'other'

const SKIP_REASONS: { value: SkipReason; label: string; emoji: string }[] = [
  { value: 'forgot',      label: 'Forgot',        emoji: '😅' },
  { value: 'too_tired',   label: 'Too tired',     emoji: '😴' },
  { value: 'too_busy',    label: 'Too busy',      emoji: '🏃' },
  { value: 'unmotivated', label: 'No motivation', emoji: '😶' },
  { value: 'sick',        label: 'Not feeling well', emoji: '🤒' },
  { value: 'traveling',   label: 'Traveling',     emoji: '✈️' },
  { value: 'other',       label: 'Other',         emoji: '🔸' },
]

const MOTIVATIONAL_QUOTES = [
  "Small steps, big changes.",
  "Consistency beats intensity.",
  "Progress, not perfection.",
  "Every rep counts.",
  "You showed up. That's everything.",
  "Champions are made in the off days.",
  "One day or day one. You decide.",
]

const MILESTONE_MESSAGES: Record<number, string> = {
  3:  '3-day streak! 🔥 You're building momentum.',
  7:  '1 week strong! 🌟 Habit is forming.',
  14: '2 weeks! 💪 This is becoming part of you.',
  21: '21 days! 🧠 Science says it's a habit now.',
  30: '30 days! 🏆 You're in the top 1%.',
  50: '50 days! 🚀 Unstoppable.',
  100: '100 days! 👑 Legendary.',
}

export default function TodayView({ habits: initialHabits, userId }: Props) {
  const [isPending, startTransition] = useTransition()
  const [habits, setHabits]         = useState(initialHabits)
  const [toast, setToast]           = useState<{ msg: string; type: 'success'|'info'|'warn' } | null>(null)
  const [confetti, setConfetti]     = useState(false)
  const [tappedId, setTappedId]     = useState<string | null>(null)
  const [skipModal, setSkipModal]   = useState<string | null>(null)
  const [showAdd, setShowAdd]       = useState(false)
  const [milestone, setMilestone]   = useState<string | null>(null)

  const doneCount  = habits.filter(h => h.today_log?.status === 'done').length
  const totalCount = habits.length
  const allDone    = doneCount === totalCount && totalCount > 0

  useEffect(() => {
    if (allDone && doneCount > 0) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 4000)
      showToastMsg('🎉 All habits done today!', 'success')
    }
  }, [allDone, doneCount])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  function showToastMsg(msg: string, type: 'success'|'info'|'warn' = 'success') {
    setToast({ msg, type })
  }

  function handleTap(habit: Habit & { today_log: any }) {
    const current = habit.today_log?.status as LogStatus | undefined
    const next: LogStatus = !current ? 'done' : current === 'done' ? 'partial' : current === 'partial' ? 'skipped' : 'done'

    setTappedId(habit.id)
    setTimeout(() => setTappedId(null), 300)

    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(8)

    if (next === 'skipped') { setSkipModal(habit.id); return }

    setHabits(prev => prev.map(h => h.id === habit.id ? { ...h, today_log: { ...(h.today_log ?? {}), status: next } } : h))

    const msgs = { done: `✓ ${habit.name}`, partial: `◐ Partial — still counts!` }
    showToastMsg(msgs[next as 'done'|'partial'])

    startTransition(async () => {
      await logHabit({ habitId: habit.id, userId, status: next })
    })
  }

  function handleSkipReason(habitId: string, reason: SkipReason) {
    setSkipModal(null)
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, today_log: { ...(h.today_log ?? {}), status: 'skipped' } } : h))
    showToastMsg("Skip recorded. Tomorrow's a new day.", 'warn')
    startTransition(async () => { await logHabit({ habitId, userId, status: 'skipped', skipReason: reason }) })
  }

  function handleArchive(habitId: string) {
    setHabits(prev => prev.filter(h => h.id !== habitId))
    showToastMsg('Habit archived', 'info')
    startTransition(async () => { await archiveHabit(habitId) })
  }

  const quote = MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length]

  return (
    <main className="flex-1 overflow-y-auto no-scrollbar pb-32" id="habit-list" aria-label="Today's habits">
      <Confetti active={confetti} />

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up pointer-events-none" role="status" aria-live="polite">
          <div className={`px-5 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap shadow-2xl ${
            toast.type === 'success' ? 'bg-teal-400 text-ink-900'
            : toast.type === 'warn'  ? 'bg-amber-400 text-ink-900'
            : 'bg-ink-700 text-ink-50'
          }`}>
            {toast.msg}
          </div>
        </div>
      )}

      {/* Milestone celebration */}
      {milestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(15,14,12,0.9)', backdropFilter: 'blur(16px)' }}>
          <div className="card text-center p-8 max-w-xs animate-scale-in">
            <p className="text-5xl mb-4">🏆</p>
            <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>Milestone!</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{milestone}</p>
            <button onClick={() => setMilestone(null)} className="btn-primary w-full">Keep going →</button>
          </div>
        </div>
      )}

      {/* Skip reason modal */}
      {skipModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4" style={{ background: 'rgba(15,14,12,0.85)', backdropFilter: 'blur(12px)' }} onClick={() => setSkipModal(null)}>
          <div className="card w-full max-w-sm animate-slide-up" onClick={e => e.stopPropagation()} role="dialog" aria-label="Skip reason">
            <div className="p-5">
              <h3 className="font-display text-xl mb-1" style={{ color: 'var(--text-primary)' }}>Why are you skipping?</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Helps HabitLoop prevent this in the future</p>
              <div className="grid grid-cols-2 gap-2">
                {SKIP_REASONS.map(r => (
                  <button
                    key={r.value}
                    onClick={() => handleSkipReason(skipModal, r.value)}
                    className="flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left hover:border-amber-400/40"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    <span className="text-xl">{r.emoji}</span>
                    <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{r.label}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => setSkipModal(null)} className="btn-ghost w-full mt-3 py-2.5 text-sm">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pt-2 space-y-3">
        {/* Quote */}
        <p className="text-center text-xs italic py-1" style={{ color: 'var(--text-tertiary)' }}>"{quote}"</p>

        {/* Progress card */}
        {totalCount > 0 && (
          <div
            className={`card p-5 flex items-center gap-4 transition-all duration-500`}
            style={{ borderColor: allDone ? 'rgba(29,158,117,0.5)' : 'var(--border-color)', boxShadow: allDone ? '0 0 30px rgba(29,158,117,0.15)' : undefined }}
          >
            <div className="relative flex-shrink-0">
              <ConsistencyRing done={doneCount} total={totalCount} size={60} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-sm text-teal-400">{Math.round((doneCount/Math.max(totalCount,1))*100)}%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                {allDone ? '🎉 All done today!' : `${doneCount} of ${totalCount} habits`}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {doneCount === 0 ? 'Tap any habit to log it'
                  : allDone ? 'Incredible consistency — you\'re building something real'
                  : `${totalCount - doneCount} left · keep going`}
              </p>
            </div>
            {allDone && <span className="text-3xl animate-bounce-in" aria-hidden="true">🏆</span>}
          </div>
        )}

        {/* Habit cards */}
        <div className="space-y-2.5" role="list" aria-label="Habit list">
          {habits.length === 0 ? (
            <EmptyState onAdd={() => setShowAdd(true)} />
          ) : (
            habits.map((habit, i) => (
              <div key={habit.id} role="listitem">
                <HabitCard
                  habit={habit}
                  onTap={() => handleTap(habit)}
                  onArchive={() => handleArchive(habit.id)}
                  isTapped={tappedId === habit.id}
                  index={i}
                />
                {habit.skip_risk !== null && habit.skip_risk >= 70 && !habit.today_log?.status && (
                  <div className="mx-2 mt-1 px-4 py-2.5 rounded-xl border animate-fade-in" role="alert" style={{ background: 'rgba(251,191,36,0.07)', borderColor: 'rgba(251,191,36,0.2)' }}>
                    <p className="text-amber-300 text-xs leading-relaxed">
                      <span className="font-semibold">⚠️ Heads up —</span> based on your patterns, there's a {habit.skip_risk}% chance you'll skip this today.
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add habit */}
        {totalCount > 0 && (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed text-sm flex items-center justify-center gap-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-tertiary)' }}
            aria-label="Add a new habit"
          >
            <span className="text-lg" aria-hidden="true">+</span> Add a habit
          </button>
        )}

        {/* Quick stats */}
        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-3 pb-4" role="region" aria-label="Quick stats">
            {[
              { label: 'Today',  value: `${doneCount}/${totalCount}`, href: '/dashboard' },
              { label: '30d avg', value: `${Math.round(habits.reduce((a,h) => a+(h.consistency_30d??0),0)/Math.max(1,totalCount))}%`, href: '/dashboard/insights' },
              { label: 'Habits', value: `${totalCount}`,  href: '/dashboard/insights' },
            ].map(s => (
              <Link key={s.label} href={s.href} className="card px-3 py-3.5 text-center transition-colors hover:border-teal-400/20">
                <p className="font-display text-xl text-teal-400">{s.value}</p>
                <p className="text-[10px] mt-0.5 uppercase tracking-wide font-semibold" style={{ color: 'var(--text-tertiary)' }}>{s.label}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Swipe hint - first time only */}
        {totalCount > 0 && (
          <p className="text-center text-[10px] pb-2" style={{ color: 'var(--text-tertiary)' }}>
            ← Swipe a habit to archive it
          </p>
        )}
      </div>

      {showAdd && <AddHabitModal userId={userId} onClose={() => setShowAdd(false)} />}
      <InstallBanner />
    </main>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16 px-4 animate-fade-up" role="region" aria-label="No habits yet">
      <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6" style={{ background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.2)' }} aria-hidden="true">✦</div>
      <h2 className="font-display text-3xl mb-3" style={{ color: 'var(--text-primary)' }}>Start your journey</h2>
      <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Add your first habit. In 21 days, HabitLoop will predict when you're about to slip and nudge you before it happens.
      </p>
      <button onClick={onAdd} className="btn-primary px-8 py-4 text-base glow-teal">Add your first habit</button>
      <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>Takes less than 30 seconds</p>
    </div>
  )
}
