import type { HabitLog } from '@/types'
import { subDays, format, getDay } from 'date-fns'
 
interface PredictionInput {
  logs: HabitLog[]
  targetDate: Date
}
 
interface PredictionResult {
  skipRiskScore: number
  dominantFactor: string
}
 
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x))
}
 
const WEIGHTS = {
  bias:           -1.2,
  daySkipRate:     2.1,
  streakFragile:   1.8,
  energyLow:       1.5,
  daysSinceDone:   1.3,
  overallSkipRate: 1.6,
}
 
export function computeSkipRisk({ logs, targetDate }: PredictionInput): PredictionResult {
  const dateStr = (d: Date) => format(d, 'yyyy-MM-dd')
  const targetDow = getDay(targetDate)
 
  const logMap = new Map(logs.map(l => [l.date, l]))
 
  const sameDowLogs = logs.filter(l => getDay(new Date(l.date + 'T12:00:00')) === targetDow)
  const dowSkipRate = sameDowLogs.length === 0
    ? 0.3
    : sameDowLogs.filter(l => l.status === 'skipped').length / sameDowLogs.length
 
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
  const streakFragile = streakLength === 0 ? 0.8
    : streakLength <= 3 ? 0.6
    : streakLength <= 7 ? 0.3
    : 0.1
 
  const recentLogs = Array.from({ length: 5 }, (_, i) =>
    logMap.get(dateStr(subDays(targetDate, i + 1)))
  ).filter((l): l is HabitLog => l !== undefined)
 
  const energyReadings: number[] = []
  for (const l of recentLogs) {
    const e = l.energy_level
    if (e !== null && e !== undefined) {
      energyReadings.push(Number(e))
    }
  }
 
  const avgEnergy = energyReadings.length === 0
    ? 3
    : energyReadings.reduce((a, b) => a + b, 0) / energyReadings.length
 
  const energyLow = Math.max(0, (3 - avgEnergy) / 2)
 
  let daysSinceDone = 30
  for (let i = 1; i <= 30; i++) {
    const d = dateStr(subDays(targetDate, i))
    const log = logMap.get(d)
    if (log && (log.status === 'done' || log.status === 'partial')) {
      daysSinceDone = i
      break
    }
  }
  const daysSinceNorm = Math.min(1, daysSinceDone / 14)
 
  const last30 = Array.from({ length: 30 }, (_, i) =>
    logMap.get(dateStr(subDays(targetDate, i + 1)))
  ).filter((l): l is HabitLog => l !== undefined)
 
  const overallSkipRate = last30.length === 0
    ? 0.3
    : last30.filter(l => l.status === 'skipped').length / last30.length
 
  const z =
    WEIGHTS.bias +
    WEIGHTS.daySkipRate     * dowSkipRate +
    WEIGHTS.streakFragile   * streakFragile +
    WEIGHTS.energyLow       * energyLow +
    WEIGHTS.daysSinceDone   * daysSinceNorm +
    WEIGHTS.overallSkipRate * overallSkipRate
 
  const probability = sigmoid(z)
  const skipRiskScore = Math.round(probability * 100)
 
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
