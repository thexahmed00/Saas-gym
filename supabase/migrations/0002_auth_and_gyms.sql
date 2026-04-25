-- IronTrack v2 — Supabase Auth + per-gym scoping
-- Run AFTER 0001_initial.sql in the Supabase SQL Editor.

-- ⚠️  HEADS-UP: this migration deletes existing seed members/check-ins
--     because they were created without a gym_id. After running this,
--     sign up via the app — a gym row is created automatically and you
--     can populate it with the "Add Member" button.

-- ============================================================================
-- gyms — one row per gym owner (1:1 with auth.users via owner_id)
-- ============================================================================
create table if not exists public.gyms (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  city        text default 'Hyderabad',
  created_at  timestamptz not null default now(),
  unique (owner_id)
);

alter table public.gyms enable row level security;

drop policy if exists "owner can read their gym"   on public.gyms;
drop policy if exists "owner can update their gym" on public.gyms;

create policy "owner can read their gym"
  on public.gyms for select to authenticated
  using (owner_id = auth.uid());

create policy "owner can update their gym"
  on public.gyms for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ============================================================================
-- Drop unaffiliated seed data (no gym to attach to)
-- ============================================================================
delete from public.check_ins;
delete from public.members;

-- ============================================================================
-- Add gym_id to members and check_ins
-- ============================================================================
alter table public.members
  add column if not exists gym_id uuid not null references public.gyms(id) on delete cascade;

alter table public.check_ins
  add column if not exists gym_id uuid not null references public.gyms(id) on delete cascade;

create index if not exists members_gym_idx   on public.members   (gym_id);
create index if not exists check_ins_gym_idx on public.check_ins (gym_id);

-- ============================================================================
-- Replace permissive anon policies with auth-scoped policies
-- ============================================================================
drop policy if exists "anon all access on members"          on public.members;
drop policy if exists "anon all access on check_ins"        on public.check_ins;
drop policy if exists "owner full access on members"        on public.members;
drop policy if exists "owner full access on check_ins"      on public.check_ins;

create policy "owner full access on members"
  on public.members for all to authenticated
  using      (gym_id in (select id from public.gyms where owner_id = auth.uid()))
  with check (gym_id in (select id from public.gyms where owner_id = auth.uid()));

create policy "owner full access on check_ins"
  on public.check_ins for all to authenticated
  using      (gym_id in (select id from public.gyms where owner_id = auth.uid()))
  with check (gym_id in (select id from public.gyms where owner_id = auth.uid()));

-- ============================================================================
-- Auto-create a gym for every new auth.users row
-- gym_name is read from raw_user_meta_data set during signUp().
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.gyms (owner_id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'gym_name', 'My Gym')
  )
  on conflict (owner_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- OPTIONAL: disable email confirmation for dev so signup → instant session.
-- Do this in the dashboard: Authentication → Providers → Email →
-- toggle OFF "Confirm email". (No SQL toggle for this setting.)
-- ============================================================================
