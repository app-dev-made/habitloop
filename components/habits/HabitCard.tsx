'use client'

import { useState, useRef } from 'react'
import type { Habit, LogStatus } from '@/types'
import { statusIcon, riskLabel, CATEGORIES } from '@/lib/habits'

interface Props {
  habit:     Habit & { today_log: any; skip_risk: number | null }
  onTap:     () => void
  onArchive: () => void
  onNote:    () => void
  isTapped:  boolean
  index:     number
}

// ── SVG Icons ────────────────────────────────────────────────────────────────
function PencilIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11.5 2.5a2.121 2.121 0 0 1 3 3L5 15H2v-3L11.5 2.5z"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  )
}

function PartialIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 3v9l5 3"/>
    </svg>
  )
}

function SkipIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  )
}

// ── Status style maps ─────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, {
  border: string; bg: string; dotBg: string; dotColor: string; text: string
}> = {
  done: {
    border:   'rgba(29,158,117,0.40)',
    bg:       'rgba(29,158,117,0.07)',
    dotBg:    'rgba(29,158,117,0.18)',
    dotColor: '#1DC48E',
    text:     '#1DC48E',
  },
  partial: {
    border:   'rgba(245,158,11,0.35)',
    bg:       'rgba(245,158,11,0.06)',
    dotBg:    'rgba(245,158,11,0.16)',
    dotColor: '#FCD34D',
    text:     '#FCD34D',
  },
  skipped: {
    border:   'rgba(239,68,68,0.30)',
    bg:       'rgba(239,68,68,0.05)',
    dotBg:    'rgba(239,68,68,0.14)',
    dotColor: '#FCA5A5',
    text:     '#FCA5A5',
  },
  default: {
    border:   'var(--border-default)',
    bg:       'var(--bg-secondary)',
    dotBg:    'var(--bg-elevated)',
    dotColor: 'var(--text-tertiary)',
    text:     'var(--text-primary)',
  },
}

function StatusDot({ status, emoji, isTapped }: { status?: LogStatus; emoji: string; isTapped: boolean }) {
  const s = STATUS_STYLES[status ?? 'default']

  const icon = status === 'done'    ? <CheckIcon />
             : status === 'partial' ? <PartialIcon />
             : status === 'skipped' ? <SkipIcon />
             : <span style={{ fontSize: 18, lineHeight: 1 }}>{emoji}</span>

  return (
    <div
      className="flex-shrink-0 transition-all duration-200"
      style={{
        width:        44,
        height:       44,
        borderRadius: 14,
        border:       `1.5px solid ${s.border}`,
        background:   s.dotBg,
        color:        s.dotColor,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
        transform:    isTapped ? 'scale(1.12)' : 'scale(1)',
        boxShadow:    status === 'done'
          ? '0 0 12px rgba(29,158,117,0.20)'
          : status === 'partial'
          ? '0 0 10px rgba(245,158,11,0.16)'
          : 'none',
      }}
      aria-hidden="true"
    >
      {icon}
    </div>
  )
}

// ── Risk badge ────────────────────────────────────────────────────────────────
function RiskBadge({ risk }: { risk: number }) {
  const isHigh = risk >= 70
  return (
    <div
      className="flex flex-col items-center flex-shrink-0"
      aria-label={`Skip risk: ${risk}%`}
    >
      <span
        className="text-[11px] font-bold leading-none"
        style={{ color: isHigh ? '#FCA5A5' : '#FCD34D' }}
      >
        {risk}%
      </span>
      <span
        className="text-[9px] mt-0.5 uppercase tracking-wide"
        style={{ color: 'var(--text-tertiary)' }}
      >
        risk
      </span>
    </div>
  )
}

// ── Archive confirm view ──────────────────────────────────────────────────────
function ArchiveConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div
      className="card-glass p-4 animate-scale-in-sm"
      style={{ borderColor: 'rgba(239,68,68,0.28)', background: 'rgba(239,68,68,0.04)' }}
      role="alertdialog"
      aria-label="Confirm archive"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-red-400"
          style={{ background: 'rgba(239,68,68,0.12)' }}
          aria-hidden="true"
        >
          <TrashIcon />
        </div>
        <div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text-primary)' }}>
            Archive "{name}"?
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            It will be removed from your dashboard. Restore it anytime from the Habits tab.
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-97"
          style={{ background: 'rgba(239,68,68,0.85)', color: '#fff' }}
        >
          Archive
        </button>
        <button onClick={onCancel} className="flex-1 btn-ghost py-2.5 text-sm">
          Keep it
        </button>
      </div>
    </div>
  )
}

// ── Main HabitCard ────────────────────────────────────────────────────────────
export default function HabitCard({ habit, onTap, onArchive, onNote, isTapped, index }: Props) {
  const [swipeX,      setSwipeX]      = useState(0)
  const [swiping,     setSwiping]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const startX = useRef(0)

  const status = habit.today_log?.status as LogStatus | undefined
  const note   = habit.today_log?.note   as string   | undefined
  const cat    = CATEGORIES[habit.category]

  const s = STATUS_STYLES[status ?? 'default']

  // ── Swipe handlers ──────────────────────────────────────
  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    setSwiping(true)
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!swiping) return
    const dx = e.touches[0].clientX - startX.current
    if (dx < 0) setSwipeX(Math.max(dx, -88))
    else setSwipeX(0)
  }
  function onTouchEnd() {
    setSwiping(false)
    if (swipeX < -60) { setSwipeX(0); setShowConfirm(true) }
    else setSwipeX(0)
  }

  if (showConfirm) {
    return (
      <div className="animate-fade-up" style={{ animationDelay: `${index * 40}ms` }}>
        <ArchiveConfirm
          name={habit.name}
          onConfirm={onArchive}
          onCancel={() => setShowConfirm(false)}
        />
      </div>
    )
  }

  return (
    <div
      className="relative overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 45}ms`, borderRadius: 16 }}
      role="listitem"
    >
      {/* ── Archive hint (revealed on left swipe) ────────── */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: 88, background: 'rgba(239,68,68,0.08)' }}
        aria-hidden="true"
      >
        <div className="text-center">
          <div className="flex justify-center mb-1 text-red-400"><TrashIcon /></div>
          <span className="text-[10px] font-semibold text-red-400 uppercase tracking-wide">Archive</span>
        </div>
      </div>

      {/* ── Swipeable main card ──────────────────────────── */}
      <div
        style={{
          transform:  `translateX(${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.32s cubic-bezier(0.16,1,0.3,1)',
          borderRadius: 16,
          overflow: 'hidden',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* ── Tap target ───────────────────────────────── */}
        <button
          onClick={onTap}
          className={`w-full flex items-center gap-3 text-left select-none cursor-pointer
                      transition-all duration-200 active:scale-98`}
          style={{
            padding:     '12px 14px',
            background:  s.bg,
            border:      `1.5px solid ${s.border}`,
            borderRadius: status ? '16px 16px 0 0' : 16,
            boxShadow:   status === 'done'
              ? 'inset 0 1px 0 rgba(29,158,117,0.12)'
              : 'inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
          aria-label={`${habit.name} — ${status ?? 'not logged'}. Tap to change status.`}
          aria-pressed={status === 'done'}
        >
          {/* Status dot */}
          <StatusDot status={status} emoji={cat.emoji} isTapped={isTapped} />

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold truncate leading-snug"
              style={{
                color:          s.text,
                textDecoration: status === 'done' ? 'line-through' : 'none',
                opacity:        status === 'done' ? 0.6 : 1,
              }}
            >
              {habit.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {/* Category pill */}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0"
                style={{
                  background: `${cat.color.includes('red') ? 'rgba(239,68,68,0.12)'
                    : cat.color.includes('orange') ? 'rgba(249,115,22,0.12)'
                    : cat.color.includes('blue')   ? 'rgba(59,130,246,0.12)'
                    : cat.color.includes('purple') ? 'rgba(168,85,247,0.12)'
                    : cat.color.includes('yellow') ? 'rgba(234,179,8,0.12)'
                    : cat.color.includes('pink')   ? 'rgba(236,72,153,0.12)'
                    : cat.color.includes('teal')   ? 'rgba(20,184,166,0.12)'
                    : 'rgba(120,113,108,0.12)'}`,
                  color: cat.color.includes('red')    ? '#FCA5A5'
                    : cat.color.includes('orange')    ? '#FDBA74'
                    : cat.color.includes('blue')      ? '#93C5FD'
                    : cat.color.includes('purple')    ? '#D8B4FE'
                    : cat.color.includes('yellow')    ? '#FDE047'
                    : cat.color.includes('pink')      ? '#F9A8D4'
                    : cat.color.includes('teal')      ? '#5EEAD4'
                    : 'var(--text-secondary)',
                }}
              >
                {cat.label}
              </span>

              {/* Frequency */}
              {habit.target_frequency < 7 && (
                <span
                  className="text-[10px] flex-shrink-0"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {habit.target_frequency}×/wk
                </span>
              )}

              {/* Note preview */}
              {note && (
                <span
                  className="text-[10px] italic truncate"
                  style={{ color: 'var(--text-tertiary)', maxWidth: 110 }}
                >
                  "{note}"
                </span>
              )}
            </div>
          </div>

          {/* Right side: risk badge OR done checkmark */}
          {habit.skip_risk !== null && habit.skip_risk >= 50 && !status && (
            <RiskBadge risk={habit.skip_risk} />
          )}
          {status === 'done' && (
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center animate-pop"
              style={{ background: 'rgba(29,158,117,0.18)', color: '#1DC48E' }}
              aria-hidden="true"
            >
              <CheckIcon />
            </div>
          )}
        </button>

        {/* ── Note row — only when logged ──────────────────── */}
        {status && (
          <button
            onClick={e => { e.stopPropagation(); onNote() }}
            className="w-full flex items-center gap-2 px-4 py-2 transition-all duration-150"
            style={{
              background:            note ? 'rgba(29,158,117,0.06)' : 'var(--bg-elevated)',
              borderTop:             '1px solid var(--border-subtle)',
              borderLeft:            `1.5px solid ${s.border}`,
              borderRight:           `1.5px solid ${s.border}`,
              borderBottom:          `1.5px solid ${s.border}`,
              borderRadius:          '0 0 16px 16px',
              color:                 note ? 'var(--brand)' : 'var(--text-tertiary)',
              minHeight:             36,
            }}
            aria-label={note ? 'Edit note' : 'Add a note to this habit'}
          >
            <PencilIcon />
            <span className="text-[11px] font-medium">
              {note ? 'Edit note' : 'Add a note'}
            </span>
            {note && (
              <span
                className="ml-auto text-[10px] italic truncate"
                style={{ color: 'var(--text-tertiary)', maxWidth: 160 }}
              >
                "{note}"
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
