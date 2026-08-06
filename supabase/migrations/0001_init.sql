-- 심정지 발굴기 (cardiac-arrest video finder) — initial schema
-- Run this once against your Supabase project (SQL Editor, or `supabase db push`).
--
-- Design notes:
--   * Every table has RLS enabled with NO policies. Only the Supabase *service role /
--     secret key* (used exclusively by server-side code — Server Components, Server
--     Actions and the cron route) can read or write. The publishable/anon key used by
--     src/lib/supabaseClient.ts has zero access to these tables by default, which is
--     what we want since this app has no client-side Supabase calls.
--   * "channels" holds every tracked YouTube channel. A channel can belong to zero or
--     more curated categories (channel_categories) AND/OR be flagged is_favorite
--     (관심채널) — the two are independent. Either way, ALL of its uploads get
--     backfilled and snapshotted, because the 심정지 feature needs to see a channel's
--     full back catalog, not just recent uploads.
--   * "videos" stores the latest known stats + cached classification flags so list
--     pages are a single indexed query instead of recomputing VPH on every request.
--   * "video_snapshots" is the append-only time series that the cached VPH figure is
--     derived from (view count deltas over time — see src/lib/refresh.ts).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- categories: curated content genres, e.g. "예능/코미디", "먹방", "게임"
-- ---------------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- channels: every tracked YouTube channel
-- ---------------------------------------------------------------------------
create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  youtube_channel_id text unique not null,
  title text not null,
  handle text,
  thumbnail_url text,
  subscriber_count bigint,
  uploads_playlist_id text,
  is_favorite boolean not null default false,
  -- incremental full-catalog backfill cursor (see src/lib/refresh.ts)
  backfill_completed boolean not null default false,
  backfill_page_token text,
  last_scanned_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists channels_favorite_idx on channels(is_favorite) where is_favorite;

-- ---------------------------------------------------------------------------
-- channel_categories: many-to-many, a channel can sit in several categories
-- ---------------------------------------------------------------------------
create table if not exists channel_categories (
  channel_id uuid not null references channels(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  primary key (channel_id, category_id)
);

create index if not exists channel_categories_category_idx on channel_categories(category_id);

-- ---------------------------------------------------------------------------
-- videos: one row per YouTube video, with cached latest stats/classification
-- ---------------------------------------------------------------------------
create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text unique not null,
  channel_id uuid not null references channels(id) on delete cascade,
  title text not null,
  thumbnail_url text,
  published_at timestamptz not null,
  duration_seconds integer,
  is_short boolean not null default false,
  latest_view_count bigint,
  latest_like_count bigint,
  latest_comment_count bigint,
  -- recent "views per hour", computed from video_snapshots over the configured window
  recent_vph numeric,
  -- cached: latest_view_count >= threshold AND recent_vph <= threshold (심정지)
  is_cardiac_arrest boolean not null default false,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists videos_channel_id_idx on videos(channel_id);
create index if not exists videos_published_at_idx on videos(published_at desc);
create index if not exists videos_cardiac_idx on videos(is_cardiac_arrest) where is_cardiac_arrest;
create index if not exists videos_vph_idx on videos(recent_vph desc nulls last);
create index if not exists videos_last_checked_idx on videos(last_checked_at nulls first);

-- ---------------------------------------------------------------------------
-- video_snapshots: append-only view-count time series used to derive VPH
-- ---------------------------------------------------------------------------
create table if not exists video_snapshots (
  id bigint generated always as identity primary key,
  video_id uuid not null references videos(id) on delete cascade,
  view_count bigint not null,
  like_count bigint,
  comment_count bigint,
  checked_at timestamptz not null default now()
);

create index if not exists video_snapshots_video_checked_idx
  on video_snapshots(video_id, checked_at desc);

-- ---------------------------------------------------------------------------
-- app_settings: key/value overrides for thresholds (min views, max vph, ...)
-- Missing keys fall back to defaults hardcoded in src/lib/settings.ts.
-- ---------------------------------------------------------------------------
create table if not exists app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security — deny-by-default, service role bypasses RLS entirely
-- ---------------------------------------------------------------------------
alter table categories enable row level security;
alter table channels enable row level security;
alter table channel_categories enable row level security;
alter table videos enable row level security;
alter table video_snapshots enable row level security;
alter table app_settings enable row level security;

-- ---------------------------------------------------------------------------
-- Starter category matching the site's primary use case. Safe to edit/remove
-- from the 설정 (Settings) page afterwards.
-- ---------------------------------------------------------------------------
insert into categories (slug, name, description, sort_order)
values ('entertainment-clips', '예능/코미디 짜집기', '예능, 코미디, 일상 편집·짜집기 채널', 0)
on conflict (slug) do nothing;
