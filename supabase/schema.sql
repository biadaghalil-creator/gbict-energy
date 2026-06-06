-- ============================================================================
-- GBICT Energy — database schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query → Run).
-- Safe to run multiple times: every statement is idempotent.
-- ============================================================================

-- ── PROFILES ────────────────────────────────────────────────────────────────
-- One row per user (id == auth.users.id). Created automatically on signup by
-- the trigger below; filled in by onboarding and settings.
create table if not exists public.profiles (
  id                   uuid primary key references auth.users (id) on delete cascade,
  has_battery          boolean      not null default false,
  has_solar            boolean      not null default false,
  has_p1               boolean      not null default false,
  contract_type        text,
  hardware_brand       text,
  postcode             text,
  household_size       integer,
  optimize_mode        text         not null default 'max_savings',
  onboarding_completed boolean      not null default false,
  vpp_enrolled         boolean      not null default false,
  -- Stripe / subscription (phase 2)
  stripe_customer_id   text,
  subscription_status  text         not null default 'inactive', -- inactive | trialing | active | past_due | canceled
  plan                 text, -- starter | pro
  trial_ends_at        timestamptz,
  current_period_end   timestamptz,
  created_at           timestamptz  not null default now()
);

-- Add any columns that might be missing on an existing table
alter table public.profiles add column if not exists has_battery          boolean     not null default false;
alter table public.profiles add column if not exists has_solar            boolean     not null default false;
alter table public.profiles add column if not exists has_p1               boolean     not null default false;
alter table public.profiles add column if not exists contract_type        text;
alter table public.profiles add column if not exists hardware_brand       text;
alter table public.profiles add column if not exists postcode             text;
alter table public.profiles add column if not exists household_size       integer;
alter table public.profiles add column if not exists optimize_mode        text        not null default 'max_savings';
alter table public.profiles add column if not exists onboarding_completed  boolean     not null default false;
alter table public.profiles add column if not exists vpp_enrolled          boolean     not null default false;
alter table public.profiles add column if not exists stripe_customer_id    text;
alter table public.profiles add column if not exists subscription_status   text        not null default 'inactive';
alter table public.profiles add column if not exists plan                  text;
alter table public.profiles add column if not exists trial_ends_at         timestamptz;
alter table public.profiles add column if not exists current_period_end    timestamptz;
alter table public.profiles add column if not exists created_at            timestamptz not null default now();

-- ── DEVICES ─────────────────────────────────────────────────────────────────
-- Connected meters / batteries / solar inverters. `config` holds the
-- provider credentials/tokens as JSON.
create table if not exists public.devices (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  type       text not null,            -- meter_p1 | meter_tibber | battery_sessy | ...
  brand      text,
  name       text,
  config     jsonb not null default '{}'::jsonb,
  status     text  not null default 'pending', -- pending | active
  created_at timestamptz not null default now()
);
create index if not exists devices_user_id_idx on public.devices (user_id);
create index if not exists devices_status_idx   on public.devices (status);

-- ── OPTIMIZATION LOGS ─────────────────────────────────────────────────────────
-- One row per optimization action taken by the engine (cron).
create table if not exists public.optimization_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  action      text not null,           -- charge | discharge | idle
  source      text,                    -- sessy | victron | enphase | solaredge
  price_eur   numeric,
  kwh         numeric,
  savings_eur numeric not null default 0,
  created_at  timestamptz not null default now()
);
create index if not exists optimization_logs_user_id_idx    on public.optimization_logs (user_id);
create index if not exists optimization_logs_created_at_idx on public.optimization_logs (created_at);

-- ── AUTO-CREATE PROFILE ON SIGNUP ─────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────────────────────
-- Each user can only see/modify their own rows. The cron uses the service role
-- key, which bypasses RLS, so it can write logs and read all devices.
alter table public.profiles          enable row level security;
alter table public.devices           enable row level security;
alter table public.optimization_logs enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- devices
drop policy if exists "devices_all_own" on public.devices;
create policy "devices_all_own" on public.devices
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- optimization_logs (read-only for the user; writes happen via service role)
drop policy if exists "logs_select_own" on public.optimization_logs;
create policy "logs_select_own" on public.optimization_logs
  for select using (auth.uid() = user_id);
