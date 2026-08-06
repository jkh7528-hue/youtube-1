-- Computes recent_vph (views-per-hour over the configured window) and the
-- cached is_cardiac_arrest flag for a batch of videos, straight from the
-- video_snapshots time series. Called from src/lib/refresh.ts after each
-- batch of new snapshots is inserted, so list pages never need to compute
-- this on read.
--
-- VPH = (latest snapshot views - baseline snapshot views) / hours between them,
-- where baseline is the snapshot closest to (now - p_window_hours) without
-- going past it; if the video isn't old enough to have one, we fall back to
-- its very first snapshot. Requires at least an hour of spread between the
-- two points, otherwise recent_vph stays null (not enough signal yet) and
-- the video is excluded from both 급상승/심정지 views until the next run.
create or replace function refresh_video_metrics(
  p_video_ids uuid[],
  p_window_hours integer,
  p_cardiac_min_views bigint,
  p_cardiac_max_vph numeric
) returns void
language plpgsql
as $$
begin
  with latest as (
    select distinct on (video_id) video_id, view_count, checked_at
    from video_snapshots
    where video_id = any(p_video_ids)
    order by video_id, checked_at desc
  ),
  baseline as (
    select distinct on (vs.video_id) vs.video_id, vs.view_count, vs.checked_at
    from video_snapshots vs
    where vs.video_id = any(p_video_ids)
      and vs.checked_at <= now() - make_interval(hours => p_window_hours)
    order by vs.video_id, vs.checked_at desc
  ),
  fallback_oldest as (
    select distinct on (video_id) video_id, view_count, checked_at
    from video_snapshots
    where video_id = any(p_video_ids)
    order by video_id, checked_at asc
  ),
  computed as (
    select
      l.video_id,
      l.view_count as latest_view_count,
      case
        when b.checked_at is not null
             and extract(epoch from (l.checked_at - b.checked_at)) >= 3600
          then greatest(l.view_count - b.view_count, 0)
               / (extract(epoch from (l.checked_at - b.checked_at)) / 3600.0)
        when b.checked_at is null and fo.checked_at is not null
             and extract(epoch from (l.checked_at - fo.checked_at)) >= 3600
          then greatest(l.view_count - fo.view_count, 0)
               / (extract(epoch from (l.checked_at - fo.checked_at)) / 3600.0)
        else null
      end as vph
    from latest l
    left join baseline b on b.video_id = l.video_id
    left join fallback_oldest fo on fo.video_id = l.video_id
  )
  update videos v
  set
    recent_vph = c.vph,
    is_cardiac_arrest = (
      c.latest_view_count >= p_cardiac_min_views
      and c.vph is not null
      and c.vph <= p_cardiac_max_vph
    )
  from computed c
  where v.id = c.video_id;
end;
$$;
