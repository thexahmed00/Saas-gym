-- IronTrack v3 — member profile photo
-- Run in Supabase SQL Editor after 0002_auth_and_gyms.sql

-- ============================================================================
-- Add photo_url to members
-- ============================================================================
alter table public.members
  add column if not exists photo_url text;

-- ============================================================================
-- Storage bucket: member-photos (public reads, auth writes scoped by gym)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('member-photos', 'member-photos', true)
on conflict (id) do nothing;

drop policy if exists "member photos public read"    on storage.objects;
drop policy if exists "gym owner upload photos"      on storage.objects;
drop policy if exists "gym owner delete own photos"  on storage.objects;

create policy "member photos public read"
  on storage.objects for select to public
  using (bucket_id = 'member-photos');

create policy "gym owner upload photos"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'member-photos' AND
    (storage.foldername(name))[1] in (
      select id::text from public.gyms where owner_id = auth.uid()
    )
  );

create policy "gym owner delete own photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'member-photos' AND
    (storage.foldername(name))[1] in (
      select id::text from public.gyms where owner_id = auth.uid()
    )
  );
