'use client'

import { useState, useTransition } from 'react'
import { createHabit } from '@/app/dashboard/actions'
import { CATEGORIES } from '@/lib/habits'
import type { HabitCategory } from '@/types'

interface Props {
  userId: string
  onClose: () => void
}

const DAYS_OPTIONS = [
  { value: 1, label: 'Once/week' },
  { value: 3, label: '3×/week' },
  { value: 5, label: '5×/week' },
  { value: 7, label: 'Every day' },
]

export default function AddHabitModal({ userId, onClose }: Props) {
  const [name, setName]       = useState('')
  const [category, setCategory] = useState<HabitCategory>('health')
  const [freq, setFreq]       = useState(7)
  const [difficulty, setDiff] = useState<1|2|3|4|5>(3)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    startTransition(async () => {
      const result = await createHabit({
        userId,
        name: name.trim(),
        category,
        targetFrequency: freq,
        targetTime: null,
        difficulty,
      })
      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-ink-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-sm p-6 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-ink-50">New habit</h2>
          <button
            onClick={onClose}
            className="text-ink-400 hover:text-ink-200 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="section-label block mb-2">Habit name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Read for 20 minutes"
              className="input"
              autoFocus
              maxLength={60}
            />
          </div>

          {/* Category */}
          <div>
            <label className="section-label block mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(CATEGORIES) as [HabitCategory, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={`flex flex-col items-center py-2.5 rounded-xl border text-xs transition-all ${
                    category === key
                      ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                      : 'border-ink-600/40 text-ink-400 hover:border-ink-500'
                  }`}
                >
                  <span className="text-xl mb-1">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className="section-label block mb-2">How often?</label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFreq(opt.value)}
                  className={`py-2 rounded-xl border text-xs transition-all ${
                    freq === opt.value
                      ? 'border-teal-400 bg-teal-400/10 text-teal-300'
                      : 'border-ink-600/40 text-ink-400 hover:border-ink-500'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="section-label block mb-2">
              Difficulty — <span className="normal-case font-normal text-ink-400">how hard is this for you?</span>
            </label>
            <div className="flex gap-2">
              {([1,2,3,4,5] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiff(d)}
                  className={`flex-1 py-2 rounded-xl border text-sm transition-all ${
                    difficulty >= d ? 'border-teal-400 bg-teal-400/20 text-teal-300' : 'border-ink-600/40 text-ink-600'
                  }`}
                >
                  {'●'}
                </button>
              ))}
            </div>
            <p className="text-ink-500 text-xs mt-1.5">
              {difficulty === 1 ? 'Very easy' : difficulty === 2 ? 'Easy' : difficulty === 3 ? 'Moderate' : difficulty === 4 ? 'Hard' : 'Very hard'}
            </p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={!name.trim() || isPending}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Adding…' : 'Add habit'}
          </button>
        </form>
      </div>
    </div>
  )
}
