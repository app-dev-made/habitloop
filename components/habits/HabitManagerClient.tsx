'use client'

import { useState, useTransition } from 'react'
import { CATEGORIES } from '@/lib/habits'
import type { Habit, HabitCategory } from '@/types'
import { updateHabit, archiveHabit, restoreHabit } from '@/app/dashboard/habits/actions'
import Link from 'next/link'

interface Props {
  habits: Habit[]
  userId: string
}

export default function HabitManagerClient({ habits: initial, userId }: Props) {
  const [habits, setHabits] = useState(initial)
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCategory, setEditCategory] = useState<HabitCategory>('health')
  const [editFreq, setEditFreq] = useState(7)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<string | null>(null)

  const active   = habits.filter(h => h.active)
  const archived = habits.filter(h => !h.active)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function startEdit(habit: Habit) {
    setEditing(habit.id)
    setEditName(habit.name)
    setEditCategory(habit.category)
    setEditFreq(habit.target_frequency)
  }

  function handleSave(habitId: string) {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, name: editName, category: editCategory, target_frequency: editFreq } : h))
    setEditing(null)
    startTransition(async () => {
      await updateHabit({ habitId, name: editName, category: editCategory, targetFrequency: editFreq })
      showToast('✓ Habit updated')
    })
  }

  function handleArchive(habitId: string) {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, active: false } : h))
    startTransition(async () => {
      await archiveHabit(habitId)
      showToast('Habit archived')
    })
  }

  function handleRestore(habitId: string) {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, active: true } : h))
    startTransition(async () => {
      await restoreHabit(habitId)
      showToast('✓ Habit restored')
    })
  }

  return (
    <div className="px-4 space-y-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-fade-up pointer-events-none">
          <div className="bg-teal-400 text-ink-900 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-2xl">{toast}</div>
        </div>
      )}

      {/* Active habits */}
      <div>
        <p className="section-label mb-3">Active ({active.length})</p>
        {active.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: 'var(--text-tertiary)' }}>No active habits yet</p>
        )}
        <div className="space-y-2">
          {active.map(habit => {
            const cat = CATEGORIES[habit.category]
            const isEditing = editing === habit.id
            return (
              <div key={habit.id} className="card overflow-hidden" style={{ borderColor: 'var(--border-color)' }}>
                {isEditing ? (
                  <div className="p-4 space-y-3">
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="input text-sm"
                      autoFocus
                      maxLength={60}
                    />
                    {/* Category picker */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {(Object.entries(CATEGORIES) as [HabitCategory, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(([key, c]) => (
                        <button
                          key={key}
                          onClick={() => setEditCategory(key)}
                          className={`py-1.5 rounded-lg border text-xs flex flex-col items-center transition-all ${editCategory === key ? 'border-teal-400 bg-teal-400/10' : 'border-ink-600/30'}`}
                        >
                          <span>{c.emoji}</span>
                        </button>
                      ))}
                    </div>
                    {/* Frequency */}
                    <div className="flex gap-2">
                      {[1,3,5,7].map(f => (
                        <button key={f} onClick={() => setEditFreq(f)} className={`flex-1 py-2 rounded-lg border text-xs transition-all ${editFreq === f ? 'border-teal-400 bg-teal-400/10 text-teal-300' : 'border-ink-600/30 text-ink-400'}`}>
                          {f === 7 ? 'Daily' : `${f}×`}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleSave(habit.id)} className="btn-primary flex-1 py-2.5 text-sm">Save</button>
                      <button onClick={() => setEditing(null)} className="btn-ghost flex-1 py-2.5 text-sm">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <span className="text-xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{habit.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                        {cat.label} · {habit.target_frequency === 7 ? 'Daily' : `${habit.target_frequency}×/week`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(habit)}
                        className="btn-icon w-8 h-8 text-xs"
                        aria-label={`Edit ${habit.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleArchive(habit.id)}
                        className="btn-icon w-8 h-8 text-red-400 hover:bg-red-900/20"
                        aria-label={`Archive ${habit.name}`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Archived habits */}
      {archived.length > 0 && (
        <div>
          <p className="section-label mb-3">Archived ({archived.length})</p>
          <div className="space-y-2">
            {archived.map(habit => {
              const cat = CATEGORIES[habit.category]
              return (
                <div key={habit.id} className="card flex items-center gap-3 px-4 py-3.5 opacity-50" style={{ borderColor: 'var(--border-color)' }}>
                  <span className="text-xl grayscale">{cat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate line-through" style={{ color: 'var(--text-secondary)' }}>{habit.name}</p>
                  </div>
                  <button onClick={() => handleRestore(habit.id)} className="text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors">
                    Restore
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="pt-2 pb-8">
        <Link href="/dashboard" className="btn-ghost w-full py-3 text-sm flex items-center justify-center gap-2">
          ← Back to today
        </Link>
      </div>
    </div>
  )
}
