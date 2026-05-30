import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { today } from '@/lib/habits'
import type { Habit, HabitLog } from '@/types'
import TodayView from '@/components/dashboard/TodayView'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  // Auth guard
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const todayStr = today()

  // Load habits + today's logs in parallel
  const [habitsRes, logsRes, predictionsRes] = await Promise.all([
    supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .eq('active', true)
      .order('created_at', { ascending: true }),

    supabase
      .from('habit_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayStr),

    supabase
      .from('predictions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayStr),
  ])

  const habits: Habit[] = habitsRes.data ?? []
  const logs: HabitLog[] = logsRes.data ?? []
  const predictions = predictionsRes.data ?? []

  // Merge today's log and skip risk into each habit
  const habitsWithData = habits.map(habit => ({
    ...habit,
    today_log: logs.find(l => l.habit_id === habit.id) ?? null,
    skip_risk: predictions.find(p => p.habit_id === habit.id)?.skip_risk_score ?? null,
  }))

  return (
    <div className="min-h-screen bg-ink-900 flex flex-col max-w-lg mx-auto">
      <DashboardNav user={user} />
      <TodayView habits={habitsWithData} userId={user.id} />
    </div>
  )
}
