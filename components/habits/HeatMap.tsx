'use client'

import { format, subDays, getDay, parseISO } from 'date-fns'

interface HeatMapProps {
  logs: { date: string; status: string }[]
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function HeatMap({ logs }: HeatMapProps) {
  const today = new Date()
  today.setHours(12, 0, 0, 0) // noon to avoid DST issues
  const WEEKS = 26

  // Build log map: date → best status
  const logMap = new Map<string, string>()
  logs.forEach(l => {
    const existing = logMap.get(l.date)
    // Priority: done > partial > skipped
    if (!existing || (l.status === 'done') || (l.status === 'partial' && existing === 'skipped')) {
      logMap.set(l.date, l.status)
    }
  })

  // Build grid from oldest to newest
  const startDate = subDays(today, WEEKS * 7 - 1)
  let cursor = new Date(startDate)
  // Align to Sunday
  while (getDay(cursor) !== 0) cursor = subDays(cursor, 1)

  const grid: { date: string; status: string | null; monthLabel?: string }[][] = []

  for (let w = 0; w < WEEKS; w++) {
    const week: typeof grid[0] = []
    for (let d = 0; d < 7; d++) {
      const dateStr = format(cursor, 'yyyy-MM-dd')
      const isFirstOfMonth = cursor.getDate() <= 7 && getDay(cursor) === 0
      week.push({
        date:   dateStr,
        status: logMap.get(dateStr) ?? null,
        monthLabel: isFirstOfMonth ? MONTHS[cursor.getMonth()] : undefined,
      })
      cursor = new Date(cursor.getTime() + 86400000)
    }
    grid.push(week)
  }

  function cellBg(status: string | null, dateStr: string): string {
    const d = parseISO(dateStr)
    d.setHours(12)
    if (d > today) return 'transparent'
    if (status === 'done')    return '#1D9E75'
    if (status === 'partial') return 'rgba(29,158,117,0.4)'
    if (status === 'skipped') return 'rgba(239,68,68,0.3)'
    return 'var(--bg-primary)'
  }

  function cellBorder(status: string | null, dateStr: string): string {
    const d = parseISO(dateStr)
    d.setHours(12)
    if (d > today || status) return 'none'
    return '1px solid var(--border-color)'
  }

  const doneDays    = logs.filter(l => l.status === 'done').length
  const partialDays = logs.filter(l => l.status === 'partial').length

  return (
    <div className="card p-5" aria-label="Activity heatmap for last 6 months">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-1">6-month activity</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {doneDays} days completed · {partialDays} partial
          </p>
        </div>
        <div className="flex items-center gap-1.5" aria-label="Legend: less to more completion">
          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Less</span>
          {[
            'var(--bg-primary)',
            'rgba(29,158,117,0.2)',
            'rgba(29,158,117,0.5)',
            '#1D9E75',
          ].map((bg, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ background: bg, border: i === 0 ? '1px solid var(--border-color)' : 'none' }}
              aria-hidden="true"
            />
          ))}
          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>More</span>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div style={{ minWidth: 'max-content' }}>

          {/* Month labels row */}
          <div className="flex mb-1 pl-5">
            {grid.map((week, wi) => (
              <div key={wi} className="w-3.5 mr-0.5 text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
                {week[0].monthLabel ?? ''}
              </div>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day-of-week labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {['', 'M', '', 'W', '', 'F', ''].map((d, i) => (
                <div
                  key={i}
                  className="w-4 h-3.5 flex items-center justify-center text-[9px]"
                  style={{ color: 'var(--text-tertiary)' }}
                  aria-hidden="true"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grid columns */}
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => {
                  const d = parseISO(day.date)
                  d.setHours(12)
                  const isFuture = d > today
                  return (
                    <div
                      key={di}
                      className="w-3.5 h-3.5 rounded-sm transition-colors duration-200"
                      style={{
                        background: isFuture ? 'transparent' : cellBg(day.status, day.date),
                        border:     isFuture ? 'none' : cellBorder(day.status, day.date),
                      }}
                      title={`${day.date}: ${day.status ?? 'no log'}`}
                      role="gridcell"
                      aria-label={`${day.date}: ${day.status ?? 'not logged'}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
