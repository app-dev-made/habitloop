import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'
import { computeSkipRisk } from '@/lib/prediction-engine'
import { today } from '@/lib/habits'
import { subDays, format } from 'date-fns'

/**
 * POST /api/predictions
 * Runs the skip risk engine for all of the user's active habits.
 * Call this nightly via a cron job (Vercel Cron or Supabase Edge Function).
 * Also safe to call on-demand from the dashboard.
 */
export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const todayStr = today()
  const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd')

  // Load habits
  const { data: habits } = await supabase
    .from('habits')
    .select('id, target_frequency')
    .eq('user_id', user.id)
    .eq('active', true)

  if (!habits?.length) {
    return NextResponse.json({ predictions: [] })
  }

  // Load last 30 days of logs for all habits in one query
  const { data: logs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', thirtyDaysAgo)

  const logsByHabit = new Map<string, any[]>()
  for (const log of (logs ?? [])) {
    if (!logsByHabit.has(log.habit_id)) {
      logsByHabit.set(log.habit_id, [])
    }
    logsByHabit.get(log.habit_id)!.push(log)
  }

  // Compute predictions
  const predictions = habits.map(habit => {
    const habitLogs = logsByHabit.get(habit.id) ?? []
    const { skipRiskScore } = computeSkipRisk({
      logs: habitLogs,
      targetDate: new Date(),
    })

    return {
      habit_id:        habit.id,
      user_id:         user.id,
      date:            todayStr,
      skip_risk_score: skipRiskScore,
      nudge_sent:      false,
      model_version:   'v1-logistic',
    }
  })

  // Upsert predictions
  const { error } = await supabase
    .from('predictions')
    .upsert(predictions, { onConflict: 'habit_id,date' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ predictions })
}
