-- Per-gym custom plan prices stored as JSONB
-- Keys match PLANS ids: daily, monthly, quarterly, annual
-- Null = use app defaults from seedData.js

alter table public.gyms
  add column if not exists plan_prices jsonb default null;
