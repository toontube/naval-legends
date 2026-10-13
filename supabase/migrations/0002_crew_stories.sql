-- Crew stories: families post someone who served on a ship.
-- Ships themselves live in src/data/ships.json (Wikidata, CC0); ship_id is the Wikidata QID.
create table if not exists crew_stories (
  id uuid primary key default gen_random_uuid(),
  ship_id text not null,
  ship_name text not null,
  sailor_name text not null check (char_length(sailor_name) between 1 and 120),
  served text not null check (char_length(served) between 1 and 80),      -- free text, "1943-45?" is fine
  relation text not null check (char_length(relation) between 1 and 60),
  rate text check (char_length(rate) <= 80),                               -- job / rank / rate
  moment text check (char_length(moment) <= 1500),                         -- one moment to remember
  contributor_name text check (char_length(contributor_name) <= 120),
  contributor_email text not null check (char_length(contributor_email) <= 200),
  contact_ok boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  jev_check jsonb,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create index if not exists crew_stories_ship_status on crew_stories (ship_id, status, created_at);

-- No public access at all: the API reads and writes with the service key and
-- only ever returns public columns of approved rows (never the email).
alter table crew_stories enable row level security;
