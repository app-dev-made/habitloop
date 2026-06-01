'use client'

import { format, subDays, getDay } from 'date-fns'

interface HeatMapProps {
  logs: { date: string; status: string }[]
}

const DAYS = ['S','M','T','W','T','F','S']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function HeatMap({ logs }: HeatMapProps) {
  const today = new Date()
  const weeks = 26 // 6 months

  // Build log map
  const logMap = new Map<string, string>()
  logs.forEach(l => logMap.set(l.date, l.status))

  // Build grid: weeks × 7 days
  const grid: { date: string; status: string | null; month?: number }[][] = []
  
  // Start from today going back 26 weeks
  const startDate = subDays(today, weeks * 7)
  
  // Find first Sunday on or before startDate
  let current = new Date(startDate)
  while (getDay(current) !== 0) {
    current = subDays(current, 1)
  }

  for (let w = 0; w < weeks; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const dateStr = format(current, 'yyyy-MM-dd')
      const isFirstOfMonth = current.getDate() === 1
      week.push({
        date: dateStr,
        status: logMap.get(dateStr) ?? null,
        month: isFirstOfMonth ? current.getMonth() : undefined,
      })
      current = new Date(current.getTime() + 86400000)
    }
    grid.push(week)
  }

  function cellColor(status: string | null, date: string): string {
    const d = new Date(date + 'T12:00:00')
    if (d > today) return 'bg-ink-800/40'
    if (!status) return 'bg-ink-800'
    if (status === 'done') return 'bg-teal-400'
    if (status === 'partial') return 'bg-teal-400/40'
    if (status === 'skipped') return 'bg-red-400/40'
    return 'bg-ink-800'
  }

  // Find month labels
  const monthLabels: { label: string; col: number }[] = []
  grid.forEach((week, wi) => {
    week.forEach(day => {
      if (day.month !== undefined) {
        monthLabels.push({ label: MONTHS[day.month], col: wi })
      }
    })
  })

  const doneDays = logs.filter(l => l.status === 'done').length
  const partialDays = logs.filter(l => l.status === 'partial').length

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-1">Activity heatmap</p>
          <p className="text-ink-500 text-xs">{doneDays} days completed · {partialDays} partial</p>
        </div>
        <div className="flex items-center gap-1.5 text-ink-600 text-[10px]">
          <span>Less</span>
          {['bg-ink-800', 'bg-teal-400/30', 'bg-teal-400/60', 'bg-teal-400'].map(c => (
            <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 ml-6">
            {grid.map((_, wi) => {
              const label = monthLabels.find(m => m.col === wi)
              return (
                <div key={wi} className="w-3.5 mr-0.5 text-[9px] text-ink-600 text-center">
                  {label?.label ?? ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((d, i) => (
                <div key={i} className="w-4 h-3.5 text-[9px] text-ink-600 flex items-center justify-center">
                  {i % 2 === 1 ? d : ''}
                </div>
              ))}
            </div>

            {/* Grid */}
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day, di) => (
                  <div
                    key={di}
                    title={`${day.date}: ${day.status ?? 'no log'}`}
                    className={`w-3.5 h-3.5 rounded-sm transition-all duration-200 ${cellColor(day.status, day.date)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
