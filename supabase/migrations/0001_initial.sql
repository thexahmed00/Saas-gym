-- IronTrack initial schema
-- Run this in the Supabase SQL Editor (or `supabase db push`).

-- ============================================================================
-- members
-- ============================================================================
create table if not exists public.members (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  phone           text not null,
  plan            text not null check (plan in ('daily', 'monthly', 'quarterly', 'annual')),
  fingerprint_id  text unique not null,
  join_date       date not null default current_date,
  expiry_date     date not null,
  created_at      timestamptz not null default now()
);

create index if not exists members_expiry_idx on public.members (expiry_date);

-- ============================================================================
-- check_ins
-- ============================================================================
create table if not exists public.check_ins (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members(id) on delete cascade,
  timestamp   timestamptz not null default now()
);

create index if not exists check_ins_timestamp_idx on public.check_ins (timestamp desc);

-- ============================================================================
-- Row Level Security
-- v1 prototype: permissive policies for the anon role.
-- TIGHTEN BEFORE PRODUCTION — wire this to Supabase Auth and scope by gym_id.
-- ============================================================================
alter table public.members   enable row level security;
alter table public.check_ins enable row level security;

drop policy if exists "anon all access on members"   on public.members;
drop policy if exists "anon all access on check_ins" on public.check_ins;

create policy "anon all access on members"
  on public.members
  for all
  to anon
  using (true)
  with check (true);

create policy "anon all access on check_ins"
  on public.check_ins
  for all
  to anon
  using (true)
  with check (true);

-- ============================================================================
-- Seed data — 5 sample members (Hyderabad)
-- Dates anchored around 2026-04-24
-- ============================================================================
insert into public.members (name, phone, plan, fingerprint_id, join_date, expiry_date)
values
  ('Karthik Rao',      '+91 98491 23456', 'daily',     'FP-001', '2026-04-01', '2026-04-30'),
  ('Rohan Reddy',      '+91 99890 34567', 'monthly',   'FP-002', '2026-04-10', '2026-05-10'),
  ('Zainab Siddiqui',  '+91 97654 56789', 'monthly',   'FP-003', '2026-03-01', '2026-04-01'),
  ('Priya Sharma',     '+91 98765 67890', 'quarterly', 'FP-004', '2026-03-15', '2026-06-13'),
  ('Arjun Iyer',       '+91 96321 78901', 'annual',    'FP-005', '2026-01-15', '2027-01-15')
on conflict (fingerprint_id) do nothing;
