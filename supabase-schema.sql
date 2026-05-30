-- ============================================================
-- HabitLoop — Supabase Database Schema
-- Run this entire file in: Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── Users profile (extends Supabase auth.users) ──────────────
create table public.users (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text not null,
  timezone            text not null default 'America/Los_Angeles',
  onboarding_complete boolean not null default false,
  push_subscription   jsonb,
  created_at          timestamptz not null default now()
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Habits ───────────────────────────────────────────────────
create type habit_category as enum (
  'health', 'fitness', 'learning', 'mindfulness',
  'productivity', 'social', 'creativity', 'other'
);

create table public.habits (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users(id) on delete cascade,
  name             text not null,
  category         habit_category not null default 'other',
  target_frequency integer not null default 7 check (target_frequency between 1 and 7),
  target_time      time,
  difficulty       smallint not null default 3 check (difficulty between 1 and 5),
  active           boolean not null default true,
  created_at       timestamptz not null default now()
);

create index habits_user_id_idx on public.habits(user_id);

-- ── Habit logs ───────────────────────────────────────────────
create type log_status as enum ('done', 'partial', 'skipped');

create type skip_reason as enum (
  'forgot', 'too_tired', 'too_busy', 'unmotivated',
  'sick', 'traveling', 'other'
);

create table public.habit_logs (
  id           uuid primary key default gen_random_uuid(),
  habit_id     uuid not null references public.habits(id) on delete cascade,
  user_id      uuid not null references public.users(id) on delete cascade,
  date         date not null,
  status       log_status not null,
  skip_reason  skip_reason,
  energy_level smallint check (energy_level between 1 and 5),
  logged_at    timestamptz not null default now(),
  -- One log per habit per day
  unique (habit_id, date)
);

create index habit_logs_user_date_idx on public.habit_logs(user_id, date);
create index habit_logs_habit_id_idx  on public.habit_logs(habit_id);

-- ── Predictions ──────────────────────────────────────────────
create table public.predictions (
  id              uuid primary key default gen_random_uuid(),
  habit_id        uuid not null references public.habits(id) on delete cascade,
  user_id         uuid not null references public.users(id) on delete cascade,
  date            date not null,
  skip_risk_score smallint not null check (skip_risk_score between 0 and 100),
  nudge_sent      boolean not null default false,
  model_version   text not null default 'v1-logistic',
  created_at      timestamptz not null default now(),
  unique (habit_id, date)
);

create index predictions_user_date_idx on public.predictions(user_id, date);

-- ── User patterns (computed weekly) ──────────────────────────
create table public.user_patterns (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  habit_id            uuid not null references public.habits(id) on delete cascade,
  best_day_of_week    smallint check (best_day_of_week between 0 and 6),
  best_time_slot      text,
  avg_consistency_30d numeric(5,2) not null default 0,
  last_computed_at    timestamptz not null default now(),
  unique (user_id, habit_id)
);

-- ── Row Level Security (RLS) — users only see their own data ──
alter table public.users         enable row level security;
alter table public.habits        enable row level security;
alter table public.habit_logs    enable row level security;
alter table public.predictions   enable row level security;
alter table public.user_patterns enable row level security;

-- Users table policies
create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Habits policies
create policy "Users can view own habits"
  on public.habits for select using (auth.uid() = user_id);
create policy "Users can insert own habits"
  on public.habits for insert with check (auth.uid() = user_id);
create policy "Users can update own habits"
  on public.habits for update using (auth.uid() = user_id);
create policy "Users can delete own habits"
  on public.habits for delete using (auth.uid() = user_id);

-- Habit logs policies
create policy "Users can view own logs"
  on public.habit_logs for select using (auth.uid() = user_id);
create policy "Users can insert own logs"
  on public.habit_logs for insert with check (auth.uid() = user_id);
create policy "Users can update own logs"
  on public.habit_logs for update using (auth.uid() = user_id);

-- Predictions policies
create policy "Users can view own predictions"
  on public.predictions for select using (auth.uid() = user_id);
create policy "Users can upsert own predictions"
  on public.predictions for insert with check (auth.uid() = user_id);
create policy "Users can update own predictions"
  on public.predictions for update using (auth.uid() = user_id);

-- User patterns policies
create policy "Users can view own patterns"
  on public.user_patterns for select using (auth.uid() = user_id);
create policy "Users can upsert own patterns"
  on public.user_patterns for all using (auth.uid() = user_id);

-- ============================================================
-- Done! Your database is ready.
-- ============================================================
