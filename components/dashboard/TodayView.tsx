'use client'

import { useState, useTransition, useEffect, useRef } from 'react'
import type { Habit, LogStatus } from '@/types'
import { riskLabel, CATEGORIES } from '@/lib/habits'
import { logHabit, archiveHabit } from '@/app/dashboard/actions'
import ConsistencyRing from '@/components/habits/ConsistencyRing'
import AddHabitModal from '@/components/habits/AddHabitModal'
import HabitCard from '@/components/habits/HabitCard'
import NoteModal from '@/components/habits/NoteModal'
import Confetti from '@/components/ui/Confetti'
import InstallBanner from '@/components/ui/InstallBanner'
import Link from 'next/link'

interface Props {
  habits:  (Habit & { today_log: any; skip_risk: number | null; consistency_30d: number })[]
  userId:  string
  streak:  number
}

type SkipReason = 'forgot' | 'too_tired' | 'too_busy' | 'unmotivated' | 'sick' | 'traveling' | 'other'

const SKIP_REASONS: { value: SkipReason; label: string; icon: string }[] = [
  { value: 'forgot',      label: 'Forgot',           icon: '😅' },
  { value: 'too_tired',   label: 'Too tired',        icon: '😴' },
  { value: 'too_busy',    label: 'Too busy',         icon: '🏃' },
  { value: 'unmotivated', label: 'No motivation',    icon: '😶' },
  { value: 'sick',        label: 'Not feeling well', icon: '🤒' },
  { value: 'traveling',   label: 'Traveling',        icon: '✈️' },
  { value: 'other',       label: 'Other',            icon: '•••' },
]

const QUOTES = [
  "Small steps, big changes.",
  "Consistency beats intensity.",
  "Progress, not perfection.",
  "Every rep counts.",
  "You showed up. That's everything.",
  "Champions are made on the hard days.",
  "One day or day one — you decide.",
]

const MILESTONES: Record<number, { icon: string; msg: string }> = {
  3:   { icon: '🔥', msg: '3-day streak! Momentum is building.' },
  7:   { icon: '⭐', msg: '1 week strong! Your habit is forming.' },
  14:  { icon: '💪', msg: '2 weeks! This is becoming part of you.' },
  21:  { icon: '🧠', msg: '21 days! Behavioral science says it\'s a habit now.' },
  30:  { icon: '🏆', msg: '30 days! You\'re in the top 1%.' },
  50:  { icon: '🚀', msg: '50 days! Absolutely unstoppable.' },
  100: { icon: '👑', msg: '100 days! Legendary consistency.' },
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
}

// ── Progress Summary Card ─────────────────────────────────────────────────────
function ProgressCard({
  done, total, streak, avgConsistency, allDone
}: {
  done: number; total: number; streak: number; avgConsistency: number; allDone: boolean
}) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div
      className={`card-glass p-4 transition-all duration-500 ${allDone ? 'animate-glow-pulse' : ''}`}
      style={{
        borderColor: allDone ? 'rgba(29,158,117,0.45)' : 'var(--glass-border)',
      }}
    >
      <div className="flex items-center gap-4">
        {/* Consistency ring */}
        <div className="relative flex-shrink-0">
          <ConsistencyRing done={done} total={total} size={60} />
          <div
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <span
              className="font-display text-sm font-bold"
              style={{ color: 'var(--text-brand)' }}
            >
              {pct}%
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>
            {allDone
              ? 'All done today!'
              : done === 0
              ? 'Ready to start?'
              : `${done} of ${total} complete`}
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            {done === 0
              ? 'Tap any habit below to log it'
              : allDone
              ? 'Incredible — keep this streak going'
              : `${total - done} left · you've got this`}
          </p>
        </div>

        {/* Right stats */}
        <div className="flex-shrink-0 text-right">
          {allDone ? (
            <div className="text-2xl animate-bounce-in" aria-label="All done!">🏆</div>
          ) : streak >= 3 ? (
            <div>
              <p className="text-base font-bold leading-none" style={{ color: '#FCD34D' }}>
                {streak}
              </p>
              <p className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                streak
              </p>
            </div>
          ) : avgConsistency > 0 ? (
            <div>
              <p className="text-base font-bold leading-none" style={{ color: 'var(--text-brand)' }}>
                {avgConsistency}%
              </p>
              <p className="text-[10px] mt-0.5 uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                30d avg
              </p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <div
          className="mt-3 h-1 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-elevated)' }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct}% of habits completed today`}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${pct}%`,
              background: allDone
                ? 'linear-gradient(90deg, #1D9E75, #4DD9AC)'
                : 'var(--brand)',
              boxShadow: pct > 0 ? '0 0 8px rgba(29,158,117,0.40)' : 'none',
            }}
          />
        </div>
      )}
    </div>
  )
}

// ── Skip Reason Modal ─────────────────────────────────────────────────────────
function SkipModal({
  habitName,
  onSelect,
  onCancel,
}: {
  habitName: string
  onSelect: (r: SkipReason) => void
  onCancel: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Why are you skipping?"
    >
      <div
        className="card-glass-elevated w-full max-w-sm animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div>
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Why are you skipping?
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              {habitName} — helps improve future predictions
            </p>
          </div>
          <button
            onClick={onCancel}
            className="btn-icon w-8 h-8 rounded-lg"
            aria-label="Cancel"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Reasons grid */}
        <div className="p-4 grid grid-cols-2 gap-2">
          {SKIP_REASONS.map(r => (
            <button
              key={r.value}
              onClick={() => onSelect(r.value)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-left
                         transition-all duration-150 active:scale-97"
              style={{
                background:  'var(--bg-elevated)',
                border:      '1px solid var(--border-default)',
                color:       'var(--text-primary)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.40)'
                e.currentTarget.style.background  = 'rgba(245,158,11,0.06)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-default)'
                e.currentTarget.style.background  = 'var(--bg-elevated)'
              }}
            >
              <span className="text-lg leading-none" aria-hidden="true">{r.icon}</span>
              <span className="text-xs font-medium">{r.label}</span>
            </button>
          ))}
        </div>

        <div className="px-4 pb-4">
          <button onClick={onCancel} className="btn-ghost w-full py-3 text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Milestone Modal ───────────────────────────────────────────────────────────
function MilestoneModal({
  milestone,
  onClose,
}: {
  milestone: { icon: string; msg: string }
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Milestone reached"
    >
      <div
        className="card-glass-elevated text-center p-8 max-w-xs w-full animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div
          className="text-6xl mb-5 animate-bounce-in"
          aria-hidden="true"
          style={{ lineHeight: 1 }}
        >
          {milestone.icon}
        </div>
        <h2
          className="font-display text-2xl mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Milestone!
        </h2>
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: 'var(--text-secondary)' }}
        >
          {milestone.msg}
        </p>
        <button onClick={onClose} className="btn-primary w-full py-3.5">
          Keep going →
        </button>
      </div>
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="text-center py-14 px-4 animate-fade-up"
      role="region"
      aria-label="No habits yet"
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5"
        style={{
          background: 'var(--brand-dim)',
          border:     '1px solid var(--border-brand)',
          boxShadow:  'var(--shadow-brand)',
        }}
        aria-hidden="true"
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M12 2C8.5 6 7 9 8 13c-2-1-3-3-2.5-5.5C2 10 1 14 3 17c1 2 3 4 6 4.5V18c0-1.5 1-3 2-4 .5 1 .5 2 0 3 2-1 3.5-3 3.5-5.5 0-3-2-5.5-2-9.5z"/>
        </svg>
      </div>

      <h2
        className="font-display text-2xl mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Start your journey
      </h2>
      <p
        className="text-sm mb-7 max-w-xs mx-auto leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        Add your first habit. In 21 days, HabitLoop will predict when you're about to slip and nudge you before it happens.
      </p>

      <button
        onClick={onAdd}
        className="btn-primary px-8 py-4 text-base glow-brand mx-auto"
      >
        Add your first habit
      </button>
      <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>
        Takes less than 30 seconds
      </p>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'warn' | 'info' }) {
  return (
    <div
      className={`toast toast-${type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {msg}
    </div>
  )
}

// ── Main TodayView ────────────────────────────────────────────────────────────
export default function TodayView({ habits: initialHabits, userId, streak }: Props) {
  const [isPending, startTransition] = useTransition()
  const [habits,    setHabits]       = useState(initialHabits)
  const [toast,     setToast]        = useState<{ msg: string; type: 'success' | 'warn' | 'info' } | null>(null)
  const [confetti,  setConfetti]     = useState(false)
  const [tappedId,  setTappedId]     = useState<string | null>(null)
  const [skipModal, setSkipModal]    = useState<{ id: string; name: string } | null>(null)
  const [showAdd,   setShowAdd]      = useState(false)
  const [milestone, setMilestone]    = useState<{ icon: string; msg: string } | null>(null)
  const [noteModal, setNoteModal]    = useState<{ habitId: string; habitName: string; status: LogStatus } | null>(null)
  const shownMilestones = useRef<Set<number>>(new Set())

  const doneCount      = habits.filter(h => h.today_log?.status === 'done').length
  const totalCount     = habits.length
  const allDone        = doneCount === totalCount && totalCount > 0
  const avgConsistency = Math.round(
    habits.reduce((a, h) => a + (h.consistency_30d ?? 0), 0) / Math.max(1, totalCount)
  )

  // ── Side effects ─────────────────────────────────────────
  // Confetti + milestone check
  useEffect(() => {
    if (!allDone || doneCount === 0) return
    setConfetti(true)
    setTimeout(() => setConfetti(false), 4500)
    if (MILESTONES[streak] && !shownMilestones.current.has(streak)) {
      shownMilestones.current.add(streak)
      setTimeout(() => setMilestone(MILESTONES[streak]), 900)
    }
  }, [allDone, doneCount, streak])

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(t)
  }, [toast])

  // Auto-run prediction engine on mount (non-blocking)
  useEffect(() => {
    fetch('/api/predictions/run', { method: 'POST' }).catch(() => {})
  }, [])

  // ── Helpers ───────────────────────────────────────────────
  function showToastMsg(msg: string, type: 'success' | 'warn' | 'info' = 'success') {
    setToast({ msg, type })
  }

  function optimisticUpdate(habitId: string, status: LogStatus) {
    setHabits(prev => prev.map(h =>
      h.id === habitId
        ? { ...h, today_log: { ...(h.today_log ?? {}), status } }
        : h
    ))
  }

  // ── Tap handler ───────────────────────────────────────────
  function handleTap(habit: Habit & { today_log: any }) {
    const current = habit.today_log?.status as LogStatus | undefined
    const next: LogStatus =
      !current         ? 'done'    :
      current === 'done'    ? 'partial' :
      current === 'partial' ? 'skipped' : 'done'

    // Animate tap
    setTappedId(habit.id)
    setTimeout(() => setTappedId(null), 280)

    // Haptic feedback (mobile)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(8)

    if (next === 'skipped') {
      setSkipModal({ id: habit.id, name: habit.name })
      return
    }

    optimisticUpdate(habit.id, next)
    showToastMsg(
      next === 'done'    ? `✓ ${habit.name}` :
      next === 'partial' ? `◐ Partial — still counts!` : ''
    )

    startTransition(async () => {
      await logHabit({ habitId: habit.id, userId, status: next })
    })
  }

  // ── Skip reason ───────────────────────────────────────────
  function handleSkipReason(reason: SkipReason) {
    if (!skipModal) return
    const { id } = skipModal
    setSkipModal(null)
    optimisticUpdate(id, 'skipped')
    showToastMsg("Skip recorded. Tomorrow's a fresh start. 💪", 'warn')
    startTransition(async () => {
      await logHabit({ habitId: id, userId, status: 'skipped', skipReason: reason })
    })
  }

  // ── Archive ───────────────────────────────────────────────
  function handleArchive(habitId: string) {
    setHabits(prev => prev.filter(h => h.id !== habitId))
    showToastMsg('Habit archived', 'info')
    startTransition(async () => { await archiveHabit(habitId) })
  }

  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  return (
    <main
      className="flex-1 overflow-y-auto no-scrollbar pb-28"
      id="habit-list"
      aria-label="Today's habits"
    >
      <Confetti active={confetti} />

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Milestone modal */}
      {milestone && (
        <MilestoneModal milestone={milestone} onClose={() => setMilestone(null)} />
      )}

      {/* Skip reason modal */}
      {skipModal && (
        <SkipModal
          habitName={skipModal.name}
          onSelect={handleSkipReason}
          onCancel={() => setSkipModal(null)}
        />
      )}

      {/* Note modal */}
      {noteModal && (
        <NoteModal
          habitId={noteModal.habitId}
          habitName={noteModal.habitName}
          userId={userId}
          status={noteModal.status}
          existingNote={habits.find(h => h.id === noteModal.habitId)?.today_log?.note}
          onClose={() => setNoteModal(null)}
          onSaved={() => setNoteModal(null)}
        />
      )}

      <div className="px-4 pt-2 space-y-3">

        {/* ── Motivational quote ─────────────────────────── */}
        <p
          className="text-center text-xs italic py-0.5"
          style={{ color: 'var(--text-tertiary)' }}
          aria-hidden="true"
        >
          "{quote}"
        </p>

        {/* ── Progress card ──────────────────────────────── */}
        {totalCount > 0 && (
          <ProgressCard
            done={doneCount}
            total={totalCount}
            streak={streak}
            avgConsistency={avgConsistency}
            allDone={allDone}
          />
        )}

        {/* ── Habit list ─────────────────────────────────── */}
        <div className="space-y-2.5" role="list" aria-label="Habits for today">
          {totalCount === 0 ? (
            <EmptyState onAdd={() => setShowAdd(true)} />
          ) : (
            habits.map((habit, i) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onTap={() => handleTap(habit)}
                onArchive={() => handleArchive(habit.id)}
                onNote={() => setNoteModal({
                  habitId:   habit.id,
                  habitName: habit.name,
                  status:    habit.today_log?.status ?? 'done',
                })}
                isTapped={tappedId === habit.id}
                index={i}
              />
            ))
          )}
        </div>

        {/* ── High-risk nudges (shown below the relevant card) ── */}
        {habits.map(habit =>
          habit.skip_risk !== null &&
          habit.skip_risk >= 70 &&
          !habit.today_log?.status ? (
            <div
              key={`nudge-${habit.id}`}
              className="px-4 py-2.5 rounded-xl border animate-fade-in-sm -mt-1.5"
              style={{
                background:  'rgba(245,158,11,0.06)',
                borderColor: 'rgba(245,158,11,0.22)',
              }}
              role="alert"
            >
              <p className="text-xs leading-relaxed" style={{ color: '#FCD34D' }}>
                <span className="font-semibold">Heads up —</span>{' '}
                there's a <strong>{habit.skip_risk}%</strong> chance you'll skip{' '}
                <em>{habit.name}</em> today based on your patterns.
              </p>
            </div>
          ) : null
        )}

        {/* ── Add habit button ───────────────────────────── */}
        {totalCount > 0 && (
          <button
            onClick={() => setShowAdd(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl
                       border-2 border-dashed transition-all duration-200 group"
            style={{
              borderColor: 'var(--border-default)',
              color:       'var(--text-tertiary)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(29,158,117,0.45)'
              e.currentTarget.style.color       = 'var(--brand)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-default)'
              e.currentTarget.style.color       = 'var(--text-tertiary)'
            }}
            aria-label="Add a new habit"
          >
            <PlusIcon />
            <span className="text-sm font-medium">Add a habit</span>
          </button>
        )}

        {/* ── Quick stats row ────────────────────────────── */}
        {totalCount > 0 && (
          <div className="grid grid-cols-3 gap-2.5 pb-2" role="region" aria-label="Quick stats">
            {[
              { label: 'Today',   value: `${doneCount}/${totalCount}`, href: '/dashboard' },
              { label: '30d avg', value: `${avgConsistency}%`,         href: '/dashboard/insights' },
              { label: streak >= 1 ? 'Streak' : 'Habits',
                value: streak >= 1 ? `${streak}d`  : `${totalCount}`,
                href: '/dashboard/insights' },
            ].map(s => (
              <Link
                key={s.label}
                href={s.href}
                className="card-glass flex flex-col items-center py-3 px-2
                           transition-all duration-150 active:scale-97"
                style={{ borderRadius: 14 }}
              >
                <p
                  className="font-display text-lg leading-none"
                  style={{ color: 'var(--text-brand)' }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[10px] mt-1 uppercase tracking-wide font-semibold"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {s.label}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* ── Swipe hint ─────────────────────────────────── */}
        {totalCount > 0 && (
          <p
            className="text-center text-[10px] pb-1"
            style={{ color: 'var(--text-disabled)' }}
            aria-hidden="true"
          >
            ← Swipe a habit left to archive it
          </p>
        )}
      </div>

      {showAdd && (
        <AddHabitModal userId={userId} onClose={() => setShowAdd(false)} />
      )}
      <InstallBanner />
    </main>
  )
}
