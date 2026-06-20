'use client'

import { format, subDays, getDay } from 'date-fns'
import Link from 'next/link'

interface Props {
  logs:       { date: string; status: string }[]
  habitCount: number
}

const DAY_LABELS = ['S','M','T','W','T','F','S']

export default function WeeklySummary({ logs, habitCount }: Props) {
  const today    = new Date()
  const isSunday = getDay(today) === 0

  const days = Array.from({ length: 7 }, (_, i) => {
    const d       = subDays(today, 6 - i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const dayLogs = logs.filter(l => l.date === dateStr)
    const done    = dayLogs.filter(l => l.status === 'done').length
    const rate    = habitCount > 0 ? Math.round((done / habitCount) * 100) : 0
    return {
      label:    DAY_LABELS[getDay(d)],
      dateStr,
      rate,
      done,
      isToday:  i === 6,
      isFuture: d > today,
    }
  })

  const weekAvg = Math.round(days.reduce((a, d) => a + d.rate, 0) / 7)
  const bestDay = [...days].filter(d => !d.isFuture && d.done > 0).sort((a, b) => b.rate - a.rate)[0]
  const MAX_H   = 48 // px — fixed bar container height

  const moodEmoji =
    weekAvg >= 80 ? '🔥' :
    weekAvg >= 55 ? '📈' :
    weekAvg >= 25 ? '💪' : '🌱'
  const moodLabel =
    weekAvg >= 80 ? 'On fire'   :
    weekAvg >= 55 ? 'Building'  :
    weekAvg >= 25 ? 'Keep going': 'Just start'

  return (
    <div className="card-glass p-4" aria-label="This week's habit summary">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="section-label mb-0.5">This week</p>
          {isSunday && (
            <p className="text-xs font-semibold" style={{ color: 'var(--brand)' }}>
              Weekly review day
            </p>
          )}
        </div>
        <Link
          href="/dashboard/insights"
          className="flex items-center gap-1 text-xs font-semibold transition-colors"
          style={{ color: 'var(--text-brand)' }}
          aria-label="View full insights"
        >
          Full view
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 4l4 4-4 4"/>
          </svg>
        </Link>
      </div>

      {/* Bar chart */}
      <div
        className="flex items-end gap-1.5 mb-2"
        style={{ height: MAX_H }}
        aria-hidden="true"
      >
        {days.map((day, i) => {
          const barH = day.isFuture
            ? 2
            : Math.max(Math.round((day.rate / 100) * MAX_H), day.rate > 0 ? 4 : 2)

          const barBg =
            day.isFuture  ? 'var(--border-subtle)' :
            day.isToday   ? 'var(--brand)' :
            day.rate >= 70 ? 'rgba(29,158,117,0.60)' :
            day.rate >= 30 ? 'rgba(29,158,117,0.30)' :
            day.rate > 0   ? 'rgba(29,158,117,0.14)' :
                             'var(--bg-elevated)'

          return (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t-md transition-all duration-700"
                style={{
                  height:    barH,
                  background: barBg,
                  border:    `1px solid ${day.isFuture ? 'var(--border-subtle)' : day.rate === 0 ? 'var(--border-subtle)' : 'transparent'}`,
                  boxShadow: day.isToday && day.rate > 0
                    ? '0 0 8px rgba(29,158,117,0.45)'
                    : 'none',
                  minHeight: 2,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div className="flex gap-1.5 mb-3">
        {days.map((day, i) => (
          <div key={i} className="flex-1 text-center">
            <span
              className="text-[9px] font-bold"
              style={{ color: day.isToday ? 'var(--brand)' : 'var(--text-tertiary)' }}
            >
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary stats */}
      <div
        className="grid grid-cols-3 gap-3 pt-3"
        style={{ borderTop: '1px solid var(--border-subtle)' }}
      >
        <div className="text-center">
          <p
            className="font-display text-xl leading-none"
            style={{ color: 'var(--text-brand)' }}
          >
            {weekAvg}%
          </p>
          <p className="section-label mt-1">Week avg</p>
        </div>
        <div className="text-center">
          <p
            className="font-display text-xl leading-none"
            style={{ color: 'var(--text-primary)' }}
          >
            {bestDay?.label ?? '—'}
          </p>
          <p className="section-label mt-1">Best day</p>
        </div>
        <div className="text-center">
          <p className="text-xl leading-none" aria-hidden="true">{moodEmoji}</p>
          <p className="section-label mt-1">{moodLabel}</p>
        </div>
      </div>
    </div>
  )
}
