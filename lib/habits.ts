import { format, subDays, parseISO } from 'date-fns'
import type { HabitLog, LogStatus } from '@/types'

// ─── Date helpers ──────────────────────────────────────────────────────────────

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

// ─── Consistency calculation ───────────────────────────────────────────────────

/**
 * Given an array of logs for a habit, returns the 30-day consistency score
 * as a percentage (0–100). Partial completions count as 0.5.
 */
export function computeConsistency(logs: HabitLog[], targetFreqPerWeek: number): number {
  const days = last30Days()
  const logMap = new Map(logs.map(l => [l.date, l.status]))

  let score = 0
  for (const day of days) {
    const status = logMap.get(day)
    if (status === 'done') score += 1
    else if (status === 'partial') score += 0.5
  }

  // Target: targetFreqPerWeek × 4.3 weeks in 30 days
  const target = targetFreqPerWeek * 4.3
  return Math.min(100, Math.round((score / target) * 100))
}

// ─── Skip risk helpers ─────────────────────────────────────────────────────────

export function riskLabel(score: number): { label: string; color: string } {
  if (score >= 70) return { label: 'High risk', color: 'text-red-500' }
  if (score >= 40) return { label: 'Watch out', color: 'text-amber-500' }
  return { label: 'On track', color: 'text-teal-400' }
}

// ─── Category metadata ─────────────────────────────────────────────────────────

export const CATEGORIES = {
  health:        { label: 'Health',       emoji: '🫀', color: 'bg-red-100 text-red-700' },
  fitness:       { label: 'Fitness',      emoji: '💪', color: 'bg-orange-100 text-orange-700' },
  learning:      { label: 'Learning',     emoji: '📚', color: 'bg-blue-100 text-blue-700' },
  mindfulness:   { label: 'Mindfulness',  emoji: '🧘', color: 'bg-purple-100 text-purple-700' },
  productivity:  { label: 'Productivity', emoji: '⚡', color: 'bg-yellow-100 text-yellow-700' },
  social:        { label: 'Social',       emoji: '🤝', color: 'bg-pink-100 text-pink-700' },
  creativity:    { label: 'Creativity',   emoji: '🎨', color: 'bg-teal-100 text-teal-700' },
  other:         { label: 'Other',        emoji: '✦',  color: 'bg-gray-100 text-gray-700' },
} as const

// ─── Status helpers ────────────────────────────────────────────────────────────

export function statusIcon(status: LogStatus | undefined): string {
  if (status === 'done')    return '✓'
  if (status === 'partial') return '◐'
  if (status === 'skipped') return '✕'
  return ''
}

export function statusClasses(status: LogStatus | undefined): string {
  if (status === 'done')    return 'bg-teal-400 text-white border-teal-400'
  if (status === 'partial') return 'bg-amber-400 text-white border-amber-400'
  if (status === 'skipped') return 'bg-red-400 text-white border-red-400'
  return 'bg-transparent border-ink-200 text-ink-400 hover:border-teal-400 hover:text-teal-400'
}
