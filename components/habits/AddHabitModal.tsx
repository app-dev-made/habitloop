'use client'

import { useState, useTransition, useEffect } from 'react'
import { createHabit } from '@/app/dashboard/actions'
import { CATEGORIES } from '@/lib/habits'
import type { HabitCategory } from '@/types'

interface Props { userId: string; onClose: () => void }

const FREQ_OPTIONS = [
  { value: 1, label: 'Once/week', emoji: '🗓' },
  { value: 3, label: '3×/week',   emoji: '📅' },
  { value: 5, label: '5×/week',   emoji: '💪' },
  { value: 7, label: 'Daily',     emoji: '🔥' },
]

const TEMPLATES = {
  'Morning Routine': [
    { name: 'Wake up before 7am', category: 'health' as HabitCategory, emoji: '⏰', freq: 7 },
    { name: 'Cold shower',        category: 'health' as HabitCategory, emoji: '🚿', freq: 5 },
    { name: 'Meditate 10 min',    category: 'mindfulness' as HabitCategory, emoji: '🧘', freq: 7 },
    { name: 'Read for 20 min',    category: 'learning' as HabitCategory, emoji: '📚', freq: 7 },
  ],
  'Student Success': [
    { name: 'Study / homework',    category: 'learning' as HabitCategory, emoji: '🎓', freq: 5 },
    { name: 'Review notes',        category: 'learning' as HabitCategory, emoji: '📝', freq: 7 },
    { name: 'No social media 9am–3pm', category: 'productivity' as HabitCategory, emoji: '📵', freq: 5 },
    { name: 'Sleep by 11pm',       category: 'health' as HabitCategory, emoji: '😴', freq: 7 },
  ],
  'Athlete': [
    { name: 'Workout / training',  category: 'fitness' as HabitCategory, emoji: '🏋️', freq: 5 },
    { name: 'Stretch / mobility',  category: 'fitness' as HabitCategory, emoji: '🤸', freq: 7 },
    { name: 'Drink enough water',  category: 'health' as HabitCategory, emoji: '💧', freq: 7 },
    { name: 'Protein with meals',  category: 'health' as HabitCategory, emoji: '🥩', freq: 7 },
  ],
  'Mindful Life': [
    { name: 'Gratitude journal',   category: 'mindfulness' as HabitCategory, emoji: '🙏', freq: 7 },
    { name: 'No phone in bed',     category: 'mindfulness' as HabitCategory, emoji: '📵', freq: 7 },
    { name: 'Walk outside',        category: 'health' as HabitCategory, emoji: '🚶', freq: 5 },
    { name: 'Call a loved one',    category: 'social' as HabitCategory, emoji: '📞', freq: 3 },
  ],
}

const QUICK_HABITS = [
  { name: 'Exercise 30 min',      category: 'fitness' as HabitCategory, emoji: '🏃', freq: 5 },
  { name: 'Read 20 min',          category: 'learning' as HabitCategory, emoji: '📚', freq: 7 },
  { name: 'Meditate',             category: 'mindfulness' as HabitCategory, emoji: '🧘', freq: 7 },
  { name: 'Drink 8 glasses water',category: 'health' as HabitCategory, emoji: '💧', freq: 7 },
  { name: 'Journal',              category: 'mindfulness' as HabitCategory, emoji: '✍️', freq: 7 },
  { name: 'Study',                category: 'learning' as HabitCategory, emoji: '🎓', freq: 5 },
]

type View = 'pick' | 'custom' | 'template'

export default function AddHabitModal({ userId, onClose }: Props) {
  const [view, setView]       = useState<View>('pick')
  const [name, setName]       = useState('')
  const [category, setCategory] = useState<HabitCategory>('health')
  const [freq, setFreq]       = useState(7)
  const [difficulty, setDiff] = useState(3)
  const [activeTemplate, setActiveTemplate] = useState<keyof typeof TEMPLATES | null>(null)
  const [error, setError]     = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  function pickQuick(h: typeof QUICK_HABITS[0]) {
    setName(h.name); setCategory(h.category); setFreq(h.freq); setView('custom')
  }

  async function submitHabit() {
    if (!name.trim()) return
    startTransition(async () => {
      const r = await createHabit({ userId, name: name.trim(), category, targetFrequency: freq, targetTime: null, difficulty })
      if (r.error) setError(r.error)
      else onClose()
    })
  }

  async function addTemplate(template: typeof TEMPLATES[keyof typeof TEMPLATES]) {
    startTransition(async () => {
      for (const h of template) {
        await createHabit({ userId, name: h.name, category: h.category, targetFrequency: h.freq, targetTime: null, difficulty: 3 })
      }
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(15,14,12,0.85)', backdropFilter: 'blur(12px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="card w-full max-w-sm mx-4 mb-4 sm:mb-0 animate-slide-up overflow-hidden" style={{ maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-2">
            {view !== 'pick' && (
              <button onClick={() => setView('pick')} className="btn-icon w-7 h-7">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 12L6 8l4-4"/></svg>
              </button>
            )}
            <h2 className="font-display text-xl" style={{ color: 'var(--text-primary)' }}>
              {view === 'pick' ? 'Add a habit' : view === 'template' ? 'Habit templates' : 'Set it up'}
            </h2>
          </div>
          <button onClick={onClose} className="btn-icon text-2xl leading-none w-8 h-8">×</button>
        </div>

        {/* Pick view */}
        {view === 'pick' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setView('custom')} className="card p-4 text-center hover:border-teal-400/40 transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-2xl block mb-2">✏️</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Custom habit</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Create your own</p>
              </button>
              <button onClick={() => setView('template')} className="card p-4 text-center hover:border-teal-400/40 transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-2xl block mb-2">📋</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Templates</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Add a full plan</p>
              </button>
            </div>

            <div>
              <p className="section-label mb-3">Quick add</p>
              <div className="space-y-2">
                {QUICK_HABITS.map(h => (
                  <button key={h.name} onClick={() => pickQuick(h)} className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:border-teal-400/30" style={{ borderColor: 'var(--border-color)' }}>
                    <span className="text-xl">{h.emoji}</span>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{h.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Template view */}
        {view === 'template' && (
          <div className="p-5 space-y-3">
            {Object.entries(TEMPLATES).map(([key, habits]) => (
              <div key={key}>
                <button
                  onClick={() => setActiveTemplate(activeTemplate === key ? null : key as any)}
                  className="w-full card p-4 text-left hover:border-teal-400/30 transition-colors"
                  style={{ borderColor: activeTemplate === key ? 'rgba(29,158,117,0.4)' : 'var(--border-color)' }}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{key}</p>
                    <span style={{ color: 'var(--text-tertiary)' }}>{activeTemplate === key ? '▲' : '▼'}</span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{habits.length} habits</p>
                </button>

                {activeTemplate === key && (
                  <div className="mt-2 space-y-1.5 animate-fade-in">
                    {habits.map(h => (
                      <div key={h.name} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                        <span>{h.emoji}</span>
                        <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{h.name}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{h.freq === 7 ? 'daily' : `${h.freq}×/wk`}</span>
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

        {/* Custom habit form */}
        {view === 'custom' && (
          <div className="p-5 space-y-5">
            <div>
              <label className="section-label block mb-2">Habit name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Read for 20 minutes" className="input text-base" autoFocus maxLength={60} />
            </div>

            <div>
              <label className="section-label block mb-2">Category</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.entries(CATEGORIES) as [HabitCategory, typeof CATEGORIES[keyof typeof CATEGORIES]][]).map(([key, cat]) => (
                  <button key={key} type="button" onClick={() => setCategory(key)} className={`flex flex-col items-center py-2.5 rounded-xl border text-xs transition-all ${category === key ? 'border-teal-400 bg-teal-400/10 text-teal-300' : 'border-ink-600/40 text-ink-400 hover:border-ink-500'}`}>
                    <span className="text-xl mb-1">{cat.emoji}</span>
                    <span className="text-[10px]">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="section-label block mb-2">How often?</label>
              <div className="grid grid-cols-2 gap-2">
                {FREQ_OPTIONS.map(opt => (
                  <button key={opt.value} type="button" onClick={() => setFreq(opt.value)} className={`py-3 px-3 rounded-xl border text-xs transition-all flex items-center gap-2 ${freq === opt.value ? 'border-teal-400 bg-teal-400/10 text-teal-300' : 'border-ink-600/40 text-ink-400'}`}>
                    <span>{opt.emoji}</span><span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="section-label block mb-1">Difficulty</label>
              <p className="text-[10px] mb-2" style={{ color: 'var(--text-tertiary)' }}>Helps calibrate predictions</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(d => (
                  <button key={d} type="button" onClick={() => setDiff(d)} className={`flex-1 py-2.5 rounded-xl border text-sm transition-all ${difficulty >= d ? 'border-teal-400 bg-teal-400/20 text-teal-300' : 'border-ink-600/40 text-ink-700'}`}>●</button>
                ))}
              </div>
              <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--text-tertiary)' }}>
                {difficulty === 1 ? 'Very easy' : difficulty === 2 ? 'Easy' : difficulty === 3 ? 'Moderate' : difficulty === 4 ? 'Hard' : 'Very hard'}
              </p>
            </div>

            {error && <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3"><p className="text-red-400 text-sm">{error}</p></div>}

            <button onClick={submitHabit} disabled={!name.trim() || isPending} className="btn-primary w-full py-4 glow-teal">
              {isPending ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin"/>Adding…</span> : 'Add habit ✓'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
