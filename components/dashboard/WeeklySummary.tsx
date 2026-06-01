'use client'

import { format, getDay, subDays } from 'date-fns'
import Link from 'next/link'

interface Props {
  logs: { date: string; status: string }[]
  habitCount: number
}

export default function WeeklySummary({ logs, habitCount }: Props) {
  const today = new Date()
  const isSunday = getDay(today) === 0

  // Build last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i)
    const dateStr = format(d, 'yyyy-MM-dd')
    const dayLogs = logs.filter(l => l.date === dateStr)
    const done = dayLogs.filter(l => l.status === 'done').length
    const rate = habitCount > 0 ? Math.round((done / habitCount) * 100) : 0
    return {
      label: format(d, 'EEE'),
      date: dateStr,
      rate,
      done,
      isToday: i === 6,
    }
  })

  const weekAvg = Math.round(days.reduce((a, d) => a + d.rate, 0) / 7)
  const bestDay = [...days].sort((a, b) => b.rate - a.rate)[0]

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-0.5">This week</p>
          {isSunday && <p className="text-xs text-teal-400 font-medium">Weekly review day 🌟</p>}
        </div>
        <Link href="/dashboard/insights" className="text-xs text-teal-400 hover:text-teal-300 transition-colors font-medium">
          Full insights →
        </Link>
      </div>

      {/* Day bars */}
      <div className="flex items-end gap-1.5 h-16 mb-3">
        {days.map(day => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t-md transition-all duration-500 relative" style={{
              height: `${Math.max(day.rate, 4)}%`,
              background: day.isToday
                ? '#1D9E75'
                : day.rate >= 70 ? 'rgba(29,158,117,0.5)'
                : day.rate >= 30 ? 'rgba(29,158,117,0.25)'
                : 'var(--bg-primary)',
              border: day.isToday ? 'none' : '1px solid var(--border-color)',
              minHeight: 4,
            }} />
          </div>
        ))}
      </div>

      {/* Day labels */}
      <div className="flex gap-1.5 mb-4">
        {days.map(day => (
          <div key={day.date} className="flex-1 text-center">
            <span className={`text-[9px] font-semibold ${day.isToday ? 'text-teal-400' : ''}`} style={{ color: day.isToday ? '#1D9E75' : 'var(--text-tertiary)' }}>
              {day.label}
            </span>
          </div>
        ))}
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="text-center">
          <p className="font-display text-2xl text-teal-400">{weekAvg}%</p>
          <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Week avg</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>{bestDay?.label}</p>
          <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Best day</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl" style={{ color: weekAvg >= 70 ? '#1D9E75' : weekAvg >= 40 ? '#F59E0B' : '#EF4444' }}>
            {weekAvg >= 70 ? '🔥' : weekAvg >= 40 ? '📈' : '💪'}
          </p>
          <p className="text-[10px] uppercase font-semibold tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
            {weekAvg >= 70 ? 'Crushing it' : weekAvg >= 40 ? 'Building' : 'Keep going'}
          </p>
        </div>
      </div>
    </div>
  )
}
