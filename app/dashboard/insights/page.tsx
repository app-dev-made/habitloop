import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { last30Days, computeConsistency, CATEGORIES } from '@/lib/habits'
import { format, subDays, getDay } from 'date-fns'
import InsightsClient from '@/components/dashboard/InsightsClient'

export default async function InsightsPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  const [habitsRes, logsRes] = await Promise.all([
    supabase.from('habits').select('*').eq('user_id', user.id).eq('active', true),
    supabase.from('habit_logs').select('*').eq('user_id', user.id).gte('date', thirtyDaysAgo),
  ])

  const habits = habitsRes.data ?? []
  const logs   = logsRes.data ?? []

  // Build per-habit consistency scores
  const habitsWithStats = habits.map(habit => {
    const habitLogs = logs.filter(l => l.habit_id === habit.id)
    const consistency = computeConsistency(habitLogs, habit.target_frequency)
    return { ...habit, consistency_30d: consistency }
  })

  // Build 30-day chart data
  const days = last30Days()
  const chartData = days.map(date => {
    const dayLogs = logs.filter(l => l.date === date)
    const done = dayLogs.filter(l => l.status === 'done').length
    const total = habits.length
    return {
      date,
      label: format(new Date(date + 'T12:00:00'), 'MMM d'),
      done,
      total,
      rate: total > 0 ? Math.round((done / total) * 100) : 0,
    }
  })

  // Day-of-week success rates
  const dowLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dowStats = dowLabels.map((label, dow) => {
    const dowLogs = logs.filter(l => getDay(new Date(l.date + 'T12:00:00')) === dow)
    const done = dowLogs.filter(l => l.status === 'done').length
    const rate = dowLogs.length > 0 ? Math.round((done / dowLogs.length) * 100) : 0
    return { label, rate, total: dowLogs.length }
  })

  return (
    <InsightsClient
      habits={habitsWithStats}
      chartData={chartData}
      dowStats={dowStats}
    />
  )
}
