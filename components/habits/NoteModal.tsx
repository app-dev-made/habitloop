'use client'

import { useState, useEffect, useTransition } from 'react'
import { logHabit } from '@/app/dashboard/actions'
import type { LogStatus } from '@/types'

interface Props {
  habitId:       string
  habitName:     string
  userId:        string
  status:        LogStatus
  existingNote?: string | null
  onClose:       () => void
  onSaved:       (note: string) => void
}

const MAX = 280

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

const STATUS_LABEL: Record<LogStatus, { label: string; color: string; bg: string }> = {
  done:    { label: 'Done',    color: '#1DC48E', bg: 'rgba(29,158,117,0.14)' },
  partial: { label: 'Partial', color: '#FCD34D', bg: 'rgba(245,158,11,0.14)' },
  skipped: { label: 'Skipped', color: '#FCA5A5', bg: 'rgba(239,68,68,0.12)' },
}

export default function NoteModal({ habitId, habitName, userId, status, existingNote, onClose, onSaved }: Props) {
  const [note, setNote]               = useState(existingNote ?? '')
  const [isPending, startTransition]  = useTransition()

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  function handleSave() {
    startTransition(async () => {
      await logHabit({ habitId, userId, status, note: note.trim() || undefined })
      onSaved(note.trim())
      onClose()
    })
  }

  const remaining = MAX - note.length
  const s         = STATUS_LABEL[status]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Add a note"
    >
      <div
        className="card-glass-elevated w-full max-w-sm animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: s.bg, color: s.color }}
              aria-hidden="true"
            >
              <PencilIcon />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {existingNote ? 'Edit note' : 'Add a note'}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{habitName}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon w-8 h-8 rounded-lg" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="habit-note" className="section-label block mb-2">
              What's on your mind?
            </label>
            <textarea
              id="habit-note"
              value={note}
              onChange={e => setNote(e.target.value.slice(0, MAX))}
              placeholder={`e.g. Felt great today, ran faster than usual 💪`}
              className="input-glass resize-none"
              style={{ height: 112, paddingTop: '0.875rem', paddingBottom: '0.875rem' }}
              autoFocus
              aria-describedby="note-char-count"
            />
            <p
              id="note-char-count"
              className="text-right text-xs mt-1.5 transition-colors"
              style={{ color: remaining < 40 ? '#FCD34D' : 'var(--text-tertiary)' }}
            >
              {remaining} characters left
            </p>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="btn-primary flex-1 py-3.5"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" aria-hidden="true"/>
                  Saving…
                </span>
              ) : 'Save note'}
            </button>
            <button onClick={onClose} className="btn-ghost py-3.5 px-5">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
