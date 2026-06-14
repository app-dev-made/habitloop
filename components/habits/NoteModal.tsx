'use client'

import { useState, useEffect, useTransition } from 'react'
import { logHabit } from '@/app/dashboard/actions'
import type { LogStatus } from '@/types'

interface Props {
  habitId:    string
  habitName:  string
  userId:     string
  status:     LogStatus
  existingNote?: string | null
  onClose:    () => void
  onSaved:    (note: string) => void
}

const MAX_CHARS = 280

export default function NoteModal({
  habitId, habitName, userId, status, existingNote, onClose, onSaved
}: Props) {
  const [note, setNote]           = useState(existingNote ?? '')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleSave() {
    startTransition(async () => {
      await logHabit({ habitId, userId, status, note: note.trim() || null })
      onSaved(note.trim())
      onClose()
    })
  }

  const remaining = MAX_CHARS - note.length
  const statusEmoji = status === 'done' ? '✓' : status === 'partial' ? '◐' : '✕'
  const statusColor = status === 'done' ? '#1D9E75' : status === 'partial' ? '#F59E0B' : '#EF4444'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(16px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Add a note"
    >
      <div className="card w-full max-w-sm animate-slide-up">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: `${statusColor}20`, color: statusColor }}
              aria-hidden="true"
            >
              {statusEmoji}
            </span>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Add a note
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{habitName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon w-8 h-8 text-xl"
            aria-label="Close"
          >
            ×
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
              onChange={e => setNote(e.target.value.slice(0, MAX_CHARS))}
              placeholder="e.g. Ran in the rain — felt amazing 💪"
              className="input resize-none"
              rows={4}
              autoFocus
              aria-describedby="note-count"
            />
            <p
              id="note-count"
              className="text-right text-xs mt-1"
              style={{ color: remaining < 50 ? '#F59E0B' : 'var(--text-tertiary)' }}
            >
              {remaining} characters left
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isPending}
              className="btn-primary flex-1 py-3"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />
                  Saving…
                </span>
              ) : 'Save note'}
            </button>
            <button onClick={onClose} className="btn-ghost py-3 px-4">
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
