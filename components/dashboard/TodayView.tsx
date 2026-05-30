'use client'

import { useState, useTransition } from 'react'
import type { Habit, LogStatus } from '@/types'
import { statusClasses, statusIcon, riskLabel, CATEGORIES } from '@/lib/habits'
import { logHabit } from '@/app/dashboard/actions'
import ConsistencyRing from '@/components/habits/ConsistencyRing'
import AddHabitModal from '@/components/habits/AddHabitModal'
import Link from 'next/link'

interface Props {
  habits: (Habit & { today_log: any; skip_risk: number | null })[]
  userId: string
}

export default function TodayView({ habits: initialHabits, userId }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [habits, setHabits] = useState(initialHabits)

  function handleTap(habit: Habit & { today_log: any }) {
    const current = habit.today_log?.status
    const next: LogStatus =
      !current ? 'done'
      : current === 'done' ? 'partial'
      : current === 'partial' ? 'skipped'
      : 'done'

    // Optimistic update
    setHabits(prev =>
      prev.map(h =>
        h.id === habit.id
          ? { ...h, today_log: { ...(h.today_log ?? {}), status: next } }
          : h
      )
    )

    startTransition(async () => {
      await logHabit({ habitId: habit.id, userId, status: next })
    })
  }

  const doneCount = habits.filter(h => h.today_log?.status === 'done').length
  const totalCount = habits.length

  return (
    <main className="flex-1 px-4 pb-8 overflow-y-auto">

      {totalCount > 0 && (
        <div className="card px-5 py-4 mb-6 flex items-center gap-4 animate-fade-up">
          <ConsistencyRing done={doneCount} total={totalCount} size={56} />
          <div>
            <p className="text-ink-50 font-medium">
              {doneCount === totalCount && totalCount > 0
                ? 'All done today! 🎉'
                : `${doneCount} of ${totalCount} habits`}
            </p>
            <p className="text-ink-400 text-sm">
              {doneCount === 0 ? 'Tap a habit to log it' : 'Keep going'}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {habits.length === 0 ? (
          <EmptyState onAdd={() => setShowAdd(true)} />
        ) : (
          habits.map((habit, i) => {
            const status = habit.today_log?.status as LogStatus | undefined
            const risk = habit.skip_risk
            const cat = CATEGORIES[habit.category]

            return (
              <div key={habit.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <button
                  onClick={() => handleTap(habit)}
                  className={`log-btn ${statusClasses(status)}`}
                  aria-label={`Log ${habit.name} as done`}
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base flex-shrink-0 transition-all ${statusClasses(status)}`}>
                    {statusIcon(status) || <span className="text-ink-600">{cat.emoji}</span>}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{habit.name}</p>
                    <p className="text-xs opacity-60 mt-0.5">{cat.label}</p>
                  </div>
                  {risk !== null && risk >= 40 && !status && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-ink-700 ${riskLabel(risk).color}`}>
                      {risk}%
                    </span>
                  )}
                </button>
                {risk !== null && risk >= 70 && !status && (
                  <NudgeMessage risk={risk} />
                )}
              </div>
            )
          })
        )}
      </div>

      {totalCount > 0 && (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-6 w-full py-3 rounded-2xl border-2 border-dashed border-ink-700 text-ink-500 text-sm hover:border-teal-400/40 hover:text-teal-400 transition-colors"
        >
          + Add habit
        </button>
      )}

      {totalCount > 0 && (
        <div className="mt-8 flex gap-3">
          <Link href="/dashboard/insights" className="flex-1 card px-4 py-3 text-center hover:border-teal-400/30 transition-colors">
            <p className="text-teal-400 font-display text-2xl">{doneCount}</p>
            <p className="text-ink-400 text-xs mt-0.5">Today</p>
          </Link>
          <Link href="/dashboard/insights" className="flex-1 card px-4 py-3 text-center hover:border-teal-400/30 transition-colors">
            <p className="text-teal-400 font-display text-2xl">
              {Math.round(habits.reduce((acc, h) => acc + (h.consistency_30d ?? 0), 0) / Math.max(1, totalCount))}%
            </p>
            <p className="text-ink-400 text-xs mt-0.5">30d avg</p>
          </Link>
          <Link href="/dashboard/insights" className="flex-1 card px-4 py-3 text-center hover:border-teal-400/30 transition-colors">
            <p className="text-teal-400 font-display text-2xl">{totalCount}</p>
            <p className="text-ink-400 text-xs mt-0.5">Habits</p>
          </Link>
        </div>
      )}

      {showAdd && (
        <AddHabitModal userId={userId} onClose={() => setShowAdd(false)} />
      )}
    </main>
  )
}

function NudgeMessage({ risk }: { risk: number }) {
  return (
    <div className="mx-2 mt-1 mb-2 px-4 py-2.5 bg-amber-900/20 border border-amber-500/20 rounded-xl animate-fade-in">
      <p className="text-amber-300 text-xs leading-relaxed">
        <span className="font-medium">Heads up:</span> you have a {risk}% chance of skipping this today. Want to do a smaller version?
      </p>
    </div>
  )
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="text-center py-16 animate-fade-up">
      <p className="text-5xl mb-4">✦</p>
      <h2 className="font-display text-2xl text-ink-50 mb-2">No habits yet</h2>
      <p className="text-ink-400 text-sm mb-8 max-w-xs mx-auto">
        Add your first habit and HabitLoop will start learning your patterns.
      </p>
      <button onClick={onAdd} className="btn-primary">
        Add your first habit
      </button>
    </div>
  )
}
