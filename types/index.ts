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
  target_frequency: number
  target_time: string | null
  difficulty: number
  active: boolean
  created_at: string
  today_log?: HabitLog | null
  consistency_30d?: number
  skip_risk?: number | null
}
 
export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  date: string
  status: LogStatus
  skip_reason: SkipReason | null
  energy_level: number | null
  logged_at: string
}
 
export interface Prediction {
  id: string
  habit_id: string
  user_id: string
  date: string
  skip_risk_score: number
  nudge_sent: boolean
  model_version: string
}
 
export interface UserPattern {
  id: string
  user_id: string
  habit_id: string
  best_day_of_week: number | null
  best_time_slot: string | null
  avg_consistency_30d: number
  last_computed_at: string
}
 
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}
 
export interface WeekDay {
  date: string
  label: string
  isToday: boolean
  logs: Record<string, LogStatus>
}
