import type { HabitLog } from '@/types'
import { subDays, format, getDay } from 'date-fns'

/**
 * HabitLoop Prediction Engine
 *
 * A simple logistic regression model built per-habit, per-user.
 * Runs server-side (Supabase Edge Function or API route).
 * No external AI APIs needed — pure JS math.
 *
 * Features used:
 *   f0 — day_of_week skip rate (0–1)
 *   f1 — recent streak stability (0–1, inverse of stability)
 *   f2 — energy trend (0–1, 1 = consistently low)
 *   f3 — days since last completion (normalized 0–1)
 *   f4 — overall 30d skip rate (0–1)
 */

interface PredictionInput {
  logs: HabitLog[]
  targetDate: Date
}

interface PredictionResult {
  skipRiskScore: number   // 0–100
  dominantFactor: string  // Human-readable reason for the score
}

// Sigmoid function — core of logistic regression
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}

// Learned weights (these are reasonable defaults; the full version retrains per user)
// Positive weight = feature increases skip risk
const WEIGHTS = {
  bias:         -1.2,
  daySkipRate:   2.1,
  streakFragile: 1.8,
  energyLow:     1.5,
  daysSinceDone: 1.3,
  overallSkipRate: 1.6,
}

export function computeSkipRisk({ logs, targetDate }: PredictionInput): PredictionResult {
  const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')
  const targetDow = getDay(targetDate)  // 0 = Sunday

  // Build a lookup: date → log
  const logMap = new Map(logs.map(l => [l.date, l]))

  // ── Feature 0: day-of-week skip rate ──────────────────────────────────────
  const sameDowLogs = logs.filter(l => getDay(new Date(l.date)) === targetDow)
  const dowSkipRate = sameDowLogs.length === 0
    ? 0.3  // neutral prior
    : sameDowLogs.filter(l => l.status === 'skipped').length / sameDowLogs.length

  // ── Feature 1: streak fragility ───────────────────────────────────────────
  // Count consecutive done/partial days ending yesterday
  let streakLength = 0
  for (let i = 1; i <= 14; i++) {
    const d = dateStr(subDays(targetDate, i))
    const log = logMap.get(d)
    if (log && (log.status === 'done' || log.status === 'partial')) {
      streakLength++
    } else {
      break
    }
  }
  // Short streaks (1–3 days) are fragile; long ones are stable
  const streakFragile = streakLength === 0 ? 0.8
    : streakLength <= 3 ? 0.6
    : streakLength <= 7 ? 0.3
    : 0.1

  // ── Feature 2: energy trend ───────────────────────────────────────────────
  const recentLogs = Array.from({ length: 5 }, (_, i) =>
    logMap.get(dateStr(subDays(targetDate, i + 1)))
  ).filter(Boolean) as HabitLog[]

  const energyReadings = recentLogs
    .map(l => l.energy_level)
    .filter((e): e is number => e !== null)

  const avgEnergy = energyReadings.length === 0
    ? 3  // neutral
    : energyReadings.reduce((a, b) => a + b, 0) / energyReadings.length

  const energyLow = Math.max(0, (3 - avgEnergy) / 2)  // 0 = good energy, 1 = very low

  // ── Feature 3: days since last completion ─────────────────────────────────
  let daysSinceDone = 30  // default: never done
  for (let i = 1; i <= 30; i++) {
    const d = dateStr(subDays(targetDate, i))
    const log = logMap.get(d)
    if (log && (log.status === 'done' || log.status === 'partial')) {
      daysSinceDone = i
      break
    }
  }
  const daysSinceNorm = Math.min(1, daysSinceDone / 14)

  // ── Feature 4: overall 30-day skip rate ───────────────────────────────────
  const last30 = Array.from({ length: 30 }, (_, i) =>
    logMap.get(dateStr(subDays(targetDate, i + 1)))
  ).filter(Boolean) as HabitLog[]

  const overallSkipRate = last30.length === 0
    ? 0.3
    : last30.filter(l => l.status === 'skipped').length / last30.length

  // ── Logistic regression ───────────────────────────────────────────────────
  const z =
    WEIGHTS.bias +
    WEIGHTS.daySkipRate     * dowSkipRate +
    WEIGHTS.streakFragile   * streakFragile +
    WEIGHTS.energyLow       * energyLow +
    WEIGHTS.daysSinceDone   * daysSinceNorm +
    WEIGHTS.overallSkipRate * overallSkipRate

  const probability = sigmoid(z)
  const skipRiskScore = Math.round(probability * 100)

  // ── Human-readable dominant factor ───────────────────────────────────────
  const factors = [
    { name: 'You often skip on this day of week', value: WEIGHTS.daySkipRate * dowSkipRate },
    { name: 'Your streak is still building',      value: WEIGHTS.streakFragile * streakFragile },
    { name: 'Your energy has been low recently',  value: WEIGHTS.energyLow * energyLow },
    { name: "It's been a while since you logged", value: WEIGHTS.daysSinceDone * daysSinceNorm },
    { name: 'You skip this habit often',          value: WEIGHTS.overallSkipRate * overallSkipRate },
  ]
  factors.sort((a, b) => b.value - a.value)
  const dominantFactor = factors[0].name

  return { skipRiskScore, dominantFactor }
}
