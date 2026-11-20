-- Bravo Zulu — Workshop Dispatch subscribers
-- Project: wvrmownmruzogaifjvdp
-- Plan: /Users/max/.claude/plans/find-brvzulu-com-prkects-mutable-kitten.md

create extension if not exists "pgcrypto";

create table if not exists subscribers (
  id              uuid primary key default gen_random_uuid(),
  email           text unique not null,
  source          text not null default 'unknown',
  ref_code        text unique,
  referred_by     text references subscribers(ref_code) on delete set null,
  tags            text[] not null default '{}',
  confirmed_at    timestamptz,
  unsubscribed_at timestamptz,
  created_at      timestamptz not null default now(),
  last_sent_at    timestamptz,
  last_open_at    timestamptz,
  last_click_at   timestamptz
);

create index if not exists subscribers_confirmed_active_idx
  on subscribers (created_at desc)
  where confirmed_at is not null and unsubscribed_at is null;

create index if not exists subscribers_source_idx on subscribers (source);

-- RLS enabled + no policies = only service_role can access.
-- The api/* Vercel functions use SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
-- Never expose anon key to write to this table.
alter table subscribers enable row level security;
