-- ============================================================
-- HabitLoop — Complete Supabase Database Schema v2
-- Run this ENTIRE file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users profile (extends Supabase auth.users) ──────────────
CREATE TABLE public.users (
  id                   UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                TEXT NOT NULL,
  timezone             TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  onboarding_complete  BOOLEAN NOT NULL DEFAULT FALSE,  -- Set to TRUE after onboarding flow
  push_subscription    JSONB,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when user signs up via magic link
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;  -- Safe to re-run
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── Habits ───────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE habit_category AS ENUM (
  'health', 'fitness', 'learning', 'mindfulness',
  'productivity', 'social', 'creativity', 'other'
);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE public.habits (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name             TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 60),
  category         habit_category NOT NULL DEFAULT 'other',
  target_frequency INTEGER NOT NULL DEFAULT 7 CHECK (target_frequency BETWEEN 1 AND 7),
  target_time      TIME,
  difficulty       SMALLINT NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
  active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS habits_user_id_idx     ON public.habits(user_id);
CREATE INDEX IF NOT EXISTS habits_user_active_idx ON public.habits(user_id, active);

-- ── Habit logs ───────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE log_status AS ENUM ('done', 'partial', 'skipped');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE skip_reason AS ENUM (
  'forgot', 'too_tired', 'too_busy', 'unmotivated',
  'sick', 'traveling', 'other'
);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

CREATE TABLE public.habit_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id     UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date         DATE NOT NULL,
  status       log_status NOT NULL,
  skip_reason  skip_reason,
  energy_level SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  note         TEXT CHECK (char_length(note) <= 280),  -- Optional 280-char note
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (habit_id, date)  -- One log per habit per day
);

CREATE INDEX IF NOT EXISTS habit_logs_user_date_idx ON public.habit_logs(user_id, date DESC);
CREATE INDEX IF NOT EXISTS habit_logs_habit_id_idx  ON public.habit_logs(habit_id);
CREATE INDEX IF NOT EXISTS habit_logs_user_status_idx ON public.habit_logs(user_id, status);

-- ── Predictions ──────────────────────────────────────────────
CREATE TABLE public.predictions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  skip_risk_score SMALLINT NOT NULL CHECK (skip_risk_score BETWEEN 0 AND 100),
  nudge_sent      BOOLEAN NOT NULL DEFAULT FALSE,
  model_version   TEXT NOT NULL DEFAULT 'v1-logistic',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (habit_id, date)
);

CREATE INDEX IF NOT EXISTS predictions_user_date_idx ON public.predictions(user_id, date);

-- ── User patterns (computed weekly by prediction engine) ──────
CREATE TABLE public.user_patterns (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  habit_id            UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  best_day_of_week    SMALLINT CHECK (best_day_of_week BETWEEN 0 AND 6),
  best_time_slot      TEXT,
  avg_consistency_30d NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_computed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, habit_id)
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_patterns ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "users_select_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Habits
CREATE POLICY "habits_select_own" ON public.habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "habits_insert_own" ON public.habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "habits_update_own" ON public.habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "habits_delete_own" ON public.habits FOR DELETE USING (auth.uid() = user_id);

-- Habit logs
CREATE POLICY "logs_select_own" ON public.habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "logs_insert_own" ON public.habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "logs_update_own" ON public.habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "logs_delete_own" ON public.habit_logs FOR DELETE USING (auth.uid() = user_id);

-- Predictions
CREATE POLICY "predictions_select_own" ON public.predictions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "predictions_insert_own" ON public.predictions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "predictions_update_own" ON public.predictions FOR UPDATE USING (auth.uid() = user_id);

-- User patterns
CREATE POLICY "patterns_all_own" ON public.user_patterns FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- DONE! All tables, indexes, triggers, and RLS policies set up.
-- ============================================================
