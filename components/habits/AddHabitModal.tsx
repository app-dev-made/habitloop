'use client'

import { useState, useTransition, useEffect } from 'react'
import { createHabit } from '@/app/dashboard/actions'
import { CATEGORIES } from '@/lib/habits'
import type { HabitCategory } from '@/types'

interface Props { userId: string; onClose: () => void }

const FREQ_OPTIONS = [
  { value: 1, label: 'Once/wk'  },
  { value: 3, label: '3×/wk'    },
  { value: 5, label: '5×/wk'    },
  { value: 7, label: 'Daily'     },
]

const TEMPLATES: Record<string, { name: string; category: HabitCategory; freq: number; emoji: string }[]> = {
  'Morning Routine': [
    { name: 'Wake up before 7am',  category: 'health',       freq: 7, emoji: '⏰' },
    { name: 'Meditate 10 min',     category: 'mindfulness',  freq: 7, emoji: '🧘' },
    { name: 'Read for 20 min',     category: 'learning',     freq: 7, emoji: '📚' },
    { name: 'Cold shower',         category: 'health',       freq: 5, emoji: '🚿' },
  ],
  'Student Success': [
    { name: 'Study / homework',         category: 'learning',     freq: 5, emoji: '🎓' },
    { name: 'Review notes',            category: 'learning',     freq: 7, emoji: '📝' },
    { name: 'No social media 9am–3pm', category: 'productivity', freq: 5, emoji: '📵' },
    { name: 'Sleep by 11pm',           category: 'health',       freq: 7, emoji: '😴' },
  ],
  'Athlete': [
    { name: 'Workout / training', category: 'fitness',     freq: 5, emoji: '🏋️' },
    { name: 'Stretch / mobility', category: 'fitness',     freq: 7, emoji: '🤸' },
    { name: 'Drink enough water', category: 'health',      freq: 7, emoji: '💧' },
    { name: 'Protein with meals', category: 'health',      freq: 7, emoji: '🥩' },
  ],
  'Mindful Life': [
    { name: 'Gratitude journal', category: 'mindfulness', freq: 7, emoji: '🙏' },
    { name: 'No phone in bed',   category: 'mindfulness', freq: 7, emoji: '📵' },
    { name: 'Walk outside',      category: 'health',      freq: 5, emoji: '🚶' },
    { name: 'Call a loved one',  category: 'social',      freq: 3, emoji: '📞' },
  ],
}

const QUICK_HABITS = [
  { name: 'Exercise 30 min',       category: 'fitness'     as HabitCategory, emoji: '🏃', freq: 5 },
  { name: 'Read 20 min',           category: 'learning'    as HabitCategory, emoji: '📚', freq: 7 },
  { name: 'Meditate',              category: 'mindfulness' as HabitCategory, emoji: '🧘', freq: 7 },
  { name: 'Drink 8 glasses water', category: 'health'      as HabitCategory, emoji: '💧', freq: 7 },
  { name: 'Journal',               category: 'mindfulness' as HabitCategory, emoji: '✍️', freq: 7 },
  { name: 'Study',                 category: 'learning'    as HabitCategory, emoji: '🎓', freq: 5 },
]

type View = 'pick' | 'custom' | 'template'

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
}

function BackIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  )
}

export default function AddHabitModal({ userId, onClose }: Props) {
  const [view,     setView]     = useState<View>('pick')
  const [name,     setName]     = useState('')
  const [category, setCategory] = useState<HabitCategory>('health')
  const [freq,     setFreq]     = useState(7)
  const [diff,     setDiff]     = useState(3)
  const [activeT,  setActiveT]  = useState<string | null>(null)
  const [error,    setError]    = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  function pickQuick(h: typeof QUICK_HABITS[0]) {
    setName(h.name); setCategory(h.category); setFreq(h.freq); setView('custom')
  }

  async function addTemplate(habits: typeof TEMPLATES[string]) {
    startTransition(async () => {
      for (const h of habits) {
        await createHabit({ userId, name: h.name, category: h.category, targetFrequency: h.freq, targetTime: null, difficulty: 3 })
      }
      onClose()
    })
  }

  async function handleSubmit() {
    if (!name.trim()) return
    startTransition(async () => {
      const r = await createHabit({ userId, name: name.trim(), category, targetFrequency: freq, targetTime: null, difficulty: diff })
      if (r.error) setError(r.error)
      else onClose()
    })
  }

  const diffLabel = ['','Very easy','Easy','Moderate','Hard','Very hard'][diff]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Add a habit"
    >
      <div
        className="card-glass-elevated w-full max-w-sm mx-4 mb-4 sm:mb-0 animate-slide-up overflow-hidden"
        style={{ maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2">
            {view !== 'pick' && (
              <button onClick={() => setView('pick')} className="btn-icon w-8 h-8 rounded-lg" aria-label="Back">
                <BackIcon />
              </button>
            )}
            <h2 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
              {view === 'pick' ? 'Add a habit' : view === 'template' ? 'Habit templates' : 'Set it up'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon w-8 h-8 rounded-lg" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(92vh - 65px)' }}>

          {/* ── PICK VIEW ───────────────────────────────── */}
          {view === 'pick' && (
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Custom habit', sub: 'Create your own', emoji: '✏️', action: () => setView('custom') },
                  { label: 'Templates',    sub: 'Add a full plan',  emoji: '📋', action: () => setView('template') },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={opt.action}
                    className="card-glass flex flex-col items-center py-4 px-3 text-center
                               transition-all duration-150 active:scale-97 rounded-2xl"
                    style={{ borderRadius: 16 }}
                  >
                    <span className="text-2xl mb-2" aria-hidden="true">{opt.emoji}</span>
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{opt.sub}</p>
                  </button>
                ))}
              </div>

              <div>
                <p className="section-label mb-3">Quick add</p>
                <div className="space-y-2">
                  {QUICK_HABITS.map(h => (
                    <button
                      key={h.name}
                      onClick={() => pickQuick(h)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                                 transition-all duration-150 active:scale-98 text-left"
                      style={{
                        background:  'var(--bg-elevated)',
                        border:      '1px solid var(--border-default)',
                        color:       'var(--text-primary)',
                      }}
                    >
                      <span className="text-xl" aria-hidden="true">{h.emoji}</span>
                      <span className="text-sm font-medium">{h.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TEMPLATE VIEW ───────────────────────────── */}
          {view === 'template' && (
            <div className="p-5 space-y-3">
              {Object.entries(TEMPLATES).map(([key, habits]) => (
                <div key={key}>
                  <button
                    onClick={() => setActiveT(activeT === key ? null : key)}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                               transition-all duration-150 active:scale-98 text-left"
                    style={{
                      background:  activeT === key ? 'rgba(29,158,117,0.08)' : 'var(--bg-elevated)',
                      border:      `1px solid ${activeT === key ? 'rgba(29,158,117,0.35)' : 'var(--border-default)'}`,
                    }}
                    aria-expanded={activeT === key}
                  >
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{key}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{habits.length} habits</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      style={{ transform: activeT === key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-tertiary)' }}
                      aria-hidden="true"
                    >
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </button>

                  {activeT === key && (
                    <div className="mt-2 space-y-1.5 animate-fade-up-sm">
                      {habits.map(h => (
                        <div
                          key={h.name}
                          className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
                          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                        >
                          <span aria-hidden="true">{h.emoji}</span>
                          <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{h.name}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            {h.freq === 7 ? 'daily' : `${h.freq}×/wk`}
                          </span>
                        </div>
                      ))}
                      <button
                        onClick={() => addTemplate(habits)}
                        disabled={isPending}
                        className="btn-primary w-full py-3 mt-2"
                      >
                        {isPending ? 'Adding…' : `Add all ${habits.length} habits →`}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── CUSTOM VIEW ─────────────────────────────── */}
          {view === 'custom' && (
            <div className="p-5 space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="habit-name" className="section-label block mb-2">Habit name</label>
                <input
                  id="habit-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Read for 20 minutes"
                  className="input"
                  autoFocus
                  maxLength={60}
                />
                {name.length > 45 && (
                  <p className="text-right text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {60 - name.length} left
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <p className="section-label mb-2.5">Category</p>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.entries(CATEGORIES) as [HabitCategory, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(([key, cat]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className="flex flex-col items-center py-3 rounded-xl border transition-all duration-150 active:scale-95"
                      style={{
                        borderColor: category === key ? 'rgba(29,158,117,0.45)' : 'var(--border-default)',
                        background:  category === key ? 'rgba(29,158,117,0.08)' : 'var(--bg-elevated)',
                      }}
                      aria-pressed={category === key}
                      aria-label={cat.label}
                    >
                      <span className="text-xl mb-1" aria-hidden="true">{cat.emoji}</span>
                      <span className="text-[10px] font-medium" style={{ color: category === key ? 'var(--text-brand)' : 'var(--text-secondary)' }}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <p className="section-label mb-2.5">How often?</p>
                <div className="grid grid-cols-2 gap-2">
                  {FREQ_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFreq(opt.value)}
                      className="py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-150 active:scale-97"
                      style={{
                        borderColor: freq === opt.value ? 'rgba(29,158,117,0.45)' : 'var(--border-default)',
                        background:  freq === opt.value ? 'rgba(29,158,117,0.08)' : 'var(--bg-elevated)',
                        color:       freq === opt.value ? 'var(--text-brand)'     : 'var(--text-secondary)',
                      }}
                      aria-pressed={freq === opt.value}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="section-label">Difficulty</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{diffLabel}</p>
                </div>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDiff(d)}
                      className="flex-1 py-2.5 rounded-xl border transition-all duration-150"
                      style={{
                        borderColor: diff >= d ? 'rgba(29,158,117,0.45)' : 'var(--border-default)',
                        background:  diff >= d ? 'rgba(29,158,117,0.14)' : 'var(--bg-elevated)',
                      }}
                      aria-pressed={diff === d}
                      aria-label={`Difficulty ${d}`}
                    >
                      <span style={{ color: diff >= d ? 'var(--brand)' : 'var(--text-disabled)', fontSize: 14 }}>●</span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!name.trim() || isPending}
                className="btn-primary w-full py-4 glow-brand"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" aria-hidden="true"/>
                    Adding…
                  </span>
                ) : 'Add habit ✓'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
