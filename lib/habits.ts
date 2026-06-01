import { format, subDays, parseISO } from 'date-fns'
import type { HabitLog, LogStatus } from '@/types'

export function today(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function last30Days(): string[] {
  return Array.from({ length: 30 }, (_, i) =>
    format(subDays(new Date(), i), 'yyyy-MM-dd')
  ).reverse()
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d')
}

export function computeConsistency(logs: HabitLog[], targetFreqPerWeek: number): number {
  const days = last30Days()
  const logMap = new Map(logs.map(l => [l.date, l.status]))
  let score = 0
  for (const day of days) {
    const status = logMap.get(day)
    if (status === 'done') score += 1
    else if (status === 'partial') score += 0.5
  }
  const target = targetFreqPerWeek * 4.3
  return Math.min(100, Math.round((score / target) * 100))
}

export function riskLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: 'High risk',  color: 'text-red-400' }
  if (score >= 40) return { label: 'Watch out',  color: 'text-amber-400' }
  return { label: 'On track', color: 'text-teal-400' }
}

export const CATEGORIES = {
  health:       { label: 'Health',       emoji: '🫀', color: 'bg-red-900/30 text-red-300' },
  fitness:      { label: 'Fitness',      emoji: '💪', color: 'bg-orange-900/30 text-orange-300' },
  learning:     { label: 'Learning',     emoji: '📚', color: 'bg-blue-900/30 text-blue-300' },
  mindfulness:  { label: 'Mindfulness',  emoji: '🧘', color: 'bg-purple-900/30 text-purple-300' },
  productivity: { label: 'Productivity', emoji: '⚡', color: 'bg-yellow-900/30 text-yellow-300' },
  social:       { label: 'Social',       emoji: '🤝', color: 'bg-pink-900/30 text-pink-300' },
  creativity:   { label: 'Creativity',   emoji: '🎨', color: 'bg-teal-900/30 text-teal-300' },
  other:        { label: 'Other',        emoji: '✦',  color: 'bg-ink-700 text-ink-300' },
} as const

export function statusIcon(status: LogStatus | undefined): string {
  if (status === 'done')    return '✓'
  if (status === 'partial') return '◐'
  if (status === 'skipped') return '✕'
  return ''
}

export function statusClasses(status: LogStatus | undefined): string {
  if (status === 'done')    return 'bg-teal-400/10 text-teal-400 border-teal-400/60'
  if (status === 'partial') return 'bg-amber-400/10 text-amber-400 border-amber-400/60'
  if (status === 'skipped') return 'bg-red-400/10 text-red-400 border-red-400/60'
  return 'bg-transparent border-ink-700 text-ink-300 hover:border-ink-500'
}
