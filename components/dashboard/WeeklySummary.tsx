'use client'

import { format, getDay, subDays } from 'date-fns'
import Link from 'next/link'

interface Props {
  logs: { date: string; status: string }[]
  habitCount: number
}

export default function WeeklySummary({ logs, habitCount }: Props) {
  const today   = new Date()
  const isSunday = getDay(today) === 0

  const days = Array.from({ length: 7 }, (_, i) => {
    const d       = subDays(today, 6 - i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const dayLogs = logs.filter(l => l.date === dateStr)
    const done    = dayLogs.filter(l => l.status === 'done').length
    const rate    = habitCount > 0 ? Math.round((done / habitCount) * 100) : 0
    return {
      label:   format(d, 'EEE'),
      date:    dateStr,
      rate,
      done,
      isToday: i === 6,
      isFuture: d > today,
    }
  })

  const weekAvg    = Math.round(days.reduce((a, d) => a + d.rate, 0) / 7)
  const bestDay    = [...days].filter(d => !d.isFuture).sort((a, b) => b.rate - a.rate)[0]
  const maxBarPx   = 56 // fixed pixel height of bar container

  return (
    <div className="card p-5" aria-label="This week's habit summary">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-0.5">This week</p>
          {isSunday && (
            <p className="text-xs font-medium text-teal-400">Weekly review day 🌟</p>
          )}
        </div>
        <Link
          href="/dashboard/insights"
          className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
          aria-label="View full insights"
        >
          Full insights →
        </Link>
      </div>

      {/* Bar chart - fixed px height for accuracy */}
      <div className="flex items-end gap-1.5 mb-2" style={{ height: maxBarPx }} aria-hidden="true">
        {days.map(day => {
          const barH = day.isFuture ? 0 : Math.max(Math.round((day.rate / 100) * maxBarPx), day.rate > 0 ? 4 : 2)
          return (
            <div key={day.date} className="flex-1 flex flex-col justify-end">
              <div
                className="w-full rounded-t-md transition-all duration-700 ease-out"
                style={{
                  height: barH,
                  background: day.isToday
                    ? '#1D9E75'
                    : day.isFuture
                    ? 'transparent'
                    : day.rate >= 70 ? 'rgba(29,158,117,0.55)'
                    : day.rate >= 30 ? 'rgba(29,158,117,0.28)'
                    : 'var(--bg-primary)',
                  border: day.isFuture || day.isToday ? 'none' : '1px solid var(--border-color)',
                  minHeight: day.isFuture ? 0 : 2,
                  boxShadow: day.isToday && day.rate > 0 ? '0 0 8px rgba(29,158,117,0.4)' : undefined,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Day labels */}
      <div className="flex gap-1.5 mb-4">
        {days.map(day => (
          <div key={day.date} className="flex-1 text-center">
            <span
              className="text-[9px] font-bold"
              style={{ color: day.isToday ? '#1D9E75' : 'var(--text-tertiary)' }}
            >
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary row */}
      <div
        className="grid grid-cols-3 gap-4 pt-3"
        style={{ borderTop: '1px solid var(--border-color)' }}
      >
        <div className="text-center">
          <p className="font-display text-2xl text-teal-400">{weekAvg}%</p>
          <p className="text-[10px] uppercase font-semibold tracking-wide mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Week avg
          </p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            {bestDay?.label ?? '—'}
          </p>
          <p className="text-[10px] uppercase font-semibold tracking-wide mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Best day
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl">
            {weekAvg >= 80 ? '🔥' : weekAvg >= 50 ? '📈' : weekAvg >= 20 ? '💪' : '🌱'}
          </p>
          <p className="text-[10px] uppercase font-semibold tracking-wide mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {weekAvg >= 80 ? 'On fire' : weekAvg >= 50 ? 'Building' : weekAvg >= 20 ? 'Keep going' : 'Just start'}
          </p>
        </div>
      </div>
    </div>
  )
}
