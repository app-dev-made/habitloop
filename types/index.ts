// ─── Database row types (match Supabase schema exactly) ───────────────────────

export type HabitCategory =
  | 'health'
  | 'fitness'
  | 'learning'
  | 'mindfulness'
  | 'productivity'
  | 'social'
  | 'creativity'
  | 'other'

export type LogStatus = 'done' | 'partial' | 'skipped'

export type SkipReason =
  | 'forgot'
  | 'too_tired'
  | 'too_busy'
  | 'unmotivated'
  | 'sick'
  | 'traveling'
  | 'other'

export interface User {
  id: string
  email: string
  created_at: string
  timezone: string
  onboarding_complete: boolean
  push_subscription: PushSubscriptionJSON | null
}

export interface Habit {
  id: string
  user_id: string
  name: string
  category: HabitCategory
  target_frequency: number   // times per week (1–7)
  target_time: string | null // preferred time e.g. "07:30"
  difficulty: 1 | 2 | 3 | 4 | 5
  active: boolean
  created_at: string
  // joined fields
  today_log?: HabitLog | null
  consistency_30d?: number   // 0–100 percentage
  skip_risk?: number         // 0–100 score from prediction engine
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string              // YYYY-MM-DD
  status: LogStatus
  skip_reason: SkipReason | null
  energy_level: 1 | 2 | 3 | 4 | 5 | null
  logged_at: string
}

export interface Prediction {
  id: string
  habit_id: string
  user_id: string
  date: string
  skip_risk_score: number   // 0–100
  nudge_sent: boolean
  model_version: string
}

export interface UserPattern {
  id: string
  user_id: string
  habit_id: string
  best_day_of_week: number | null   // 0 = Sunday
  best_time_slot: string | null
  avg_consistency_30d: number
  last_computed_at: string
}

// ─── API response types ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// ─── UI-only types ─────────────────────────────────────────────────────────────

export interface WeekDay {
  date: string       // YYYY-MM-DD
  label: string      // "Mon"
  isToday: boolean
  logs: Record<string, LogStatus>  // habit_id → status
}
