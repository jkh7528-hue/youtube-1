import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSettings } from "@/lib/settings";
import { fetchChannelById, fetchUploadsPage, fetchVideoStats } from "@/lib/youtube";
import type { ChannelRow } from "@/lib/types";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const SNAPSHOT_RETENTION_DAYS = 30;

/** Fetches channel metadata from YouTube and writes it onto the channel row if missing/stale. */
async function ensureChannelMetadata(channel: ChannelRow): Promise<ChannelRow> {
  if (channel.uploads_playlist_id) return channel;
  const info = await fetchChannelById(channel.youtube_channel_id);
  if (!info) throw new Error(`채널을 찾을 수 없음 (${channel.youtube_channel_id})`);
  const { error } = await supabaseAdmin
    .from("channels")
    .update({
      title: info.title,
      handle: info.handle,
      thumbnail_url: info.thumbnailUrl,
      subscriber_count: info.subscriberCount,
      uploads_playlist_id: info.uploadsPlaylistId,
    })
    .eq("id", channel.id);
  if (error) throw new Error(error.message);
  return {
    ...channel,
    title: info.title,
    handle: info.handle,
    thumbnail_url: info.thumbnailUrl,
    subscriber_count: info.subscriberCount,
    uploads_playlist_id: info.uploadsPlaylistId,
  };
}

interface ScanResult {
  newVideoDbIds: string[];
  pagesUsed: number;
}

/**
 * Pulls the newest uploads page (to catch anything just published) plus, if
 * the channel's full-catalog backfill isn't done yet, continues paginating
 * from where it left off — bounded by maxPages so one run never blocks on a
 * channel with thousands of videos. Newly discovered videos get a row in
 * `videos` and an initial snapshot inserted immediately.
 */
async function scanChannel(channel: ChannelRow, maxPages: number): Promise<ScanResult> {
  if (!channel.uploads_playlist_id) return { newVideoDbIds: [], pagesUsed: 0 };

  const freshPage = await fetchUploadsPage(channel.uploads_playlist_id);
  const seenVideoIds = new Set(freshPage.videos.map((v) => v.videoId));
  let pagesUsed = 1;

  if (!channel.backfill_completed) {
    let token = channel.backfill_page_token ?? freshPage.nextPageToken;
    let completed = !freshPage.nextPageToken;
    while (token && pagesUsed < maxPages) {
      const page = await fetchUploadsPage(channel.uploads_playlist_id, token);
      page.videos.forEach((v) => seenVideoIds.add(v.videoId));
      pagesUsed++;
      token = page.nextPageToken;
      if (!token) {
        completed = true;
        break;
      }
    }
    await supabaseAdmin
      .from("channels")
      .update({
        backfill_page_token: token ?? null,
        backfill_completed: completed,
        last_scanned_at: new Date().toISOString(),
      })
      .eq("id", channel.id);
  } else {
    await supabaseAdmin
      .from("channels")
      .update({ last_scanned_at: new Date().toISOString() })
      .eq("id", channel.id);
  }

  const allIds = Array.from(seenVideoIds);
  if (allIds.length === 0) return { newVideoDbIds: [], pagesUsed };

  const newVideoDbIds: string[] = [];
  for (const idBatch of chunk(allIds, 200)) {
    const { data: existing, error } = await supabaseAdmin
      .from("videos")
      .select("youtube_video_id")
      .in("youtube_video_id", idBatch);
    if (error) throw new Error(error.message);
    const existingSet = new Set((existing ?? []).map((r) => r.youtube_video_id));
    const newIds = idBatch.filter((id) => !existingSet.has(id));
    if (newIds.length === 0) continue;

    const stats = await fetchVideoStats(newIds);
    const now = new Date().toISOString();
    const rows = stats.map((s) => ({
      youtube_video_id: s.videoId,
      channel_id: channel.id,
      title: s.title,
      thumbnail_url: s.thumbnailUrl,
      published_at: s.publishedAt,
      duration_seconds: s.durationSeconds,
      is_short: s.isShort,
      latest_view_count: s.viewCount,
      latest_like_count: s.likeCount,
      latest_comment_count: s.commentCount,
      last_checked_at: now,
    }));
    if (rows.length === 0) continue;

    const { data: inserted, error: insErr } = await supabaseAdmin
      .from("videos")
      .insert(rows)
      .select("id, latest_view_count, latest_like_count, latest_comment_count");
    if (insErr) throw new Error(insErr.message);

    const snapRows = (inserted ?? []).map((v) => ({
      video_id: v.id,
      view_count: v.latest_view_count ?? 0,
      like_count: v.latest_like_count,
      comment_count: v.latest_comment_count,
      checked_at: now,
    }));
    if (snapRows.length > 0) {
      const { error: snapErr } = await supabaseAdmin.from("video_snapshots").insert(snapRows);
      if (snapErr) throw new Error(snapErr.message);
    }
    (inserted ?? []).forEach((v) => newVideoDbIds.push(v.id));
  }

  return { newVideoDbIds, pagesUsed };
}

interface VideoRef {
  id: string;
  youtube_video_id: string;
  channel_id: string;
}

/** PostgREST answers with at most 1000 rows per request. */
const PAGE_SIZE = 1000;

/**
 * Videos due a recheck, oldest-checked first, paged past PostgREST's 1000-row
 * response cap. A single `.limit(n)` above that silently truncates — which is
 * why raising maxStatsRefreshPerRun past 1000 used to have no effect at all.
 *
 * "recent" is everything published inside the window (trending/flatlining shows
 * up there first); "older" is the rotating remainder of the back catalog.
 */
async function fetchVideoRefs(
  scope: "recent" | "older",
  cutoff: string,
  want: number,
  errors: string[]
): Promise<VideoRef[]> {
  const out: VideoRef[] = [];
  while (out.length < want) {
    const take = Math.min(PAGE_SIZE, want - out.length);
    let query = supabaseAdmin
      .from("videos")
      .select("id, youtube_video_id, channel_id")
      .order("last_checked_at", { ascending: true, nullsFirst: true })
      .range(out.length, out.length + take - 1);
    query = scope === "recent" ? query.gte("published_at", cutoff) : query.lt("published_at", cutoff);

    const { data, error } = await query;
    if (error) {
      errors.push(error.message);
      break;
    }
    const page = data ?? [];
    out.push(...page);
    if (page.length < take) break; // ran out of rows
  }
  return out;
}

/** Re-fetches live stats for an already-tracked set of videos and records a new snapshot for each. */
async function refreshStats(
  videos: Array<{ id: string; youtube_video_id: string; channel_id: string }>
): Promise<string[]> {
  if (videos.length === 0) return [];
  const byYtId = new Map(videos.map((v) => [v.youtube_video_id, v]));
  const stats = await fetchVideoStats(videos.map((v) => v.youtube_video_id));
  const now = new Date().toISOString();

  const updateRows = stats
    .map((s) => {
      const existing = byYtId.get(s.videoId);
      if (!existing) return null;
      return {
        id: existing.id,
        // These two are already-known values, resent on every refresh because
        // PostgREST sends an upsert as INSERT ... ON CONFLICT: a column left
        // out of the payload arrives as NULL and trips the NOT NULL check
        // before the conflict clause ever runs. Omitting them failed every
        // batch, which silently disabled the whole stats refresh — and with
        // it VPH updates. videos' other NOT NULL columns (title,
        // published_at) are refreshed below anyway; the rest have defaults.
        youtube_video_id: s.videoId,
        channel_id: existing.channel_id,
        title: s.title,
        thumbnail_url: s.thumbnailUrl,
        published_at: s.publishedAt,
        duration_seconds: s.durationSeconds,
        is_short: s.isShort,
        latest_view_count: s.viewCount,
        latest_like_count: s.likeCount,
        latest_comment_count: s.commentCount,
        last_checked_at: now,
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  for (const batch of chunk(updateRows, 200)) {
    const { error } = await supabaseAdmin.from("videos").upsert(batch, { onConflict: "id" });
    if (error) throw new Error(`stats upsert failed: ${error.message}`);
  }

  const snapRows = updateRows.map((r) => ({
    video_id: r.id,
    view_count: r.latest_view_count,
    like_count: r.latest_like_count,
    comment_count: r.latest_comment_count,
    checked_at: now,
  }));
  for (const batch of chunk(snapRows, 500)) {
    const { error } = await supabaseAdmin.from("video_snapshots").insert(batch);
    if (error) throw new Error(`snapshot insert failed: ${error.message}`);
  }

  return updateRows.map((r) => r.id);
}

async function computeMetrics(
  videoDbIds: string[],
  settings: { vphWindowHours: number; cardiacMinViews: number; cardiacMaxVph: number }
): Promise<void> {
  for (const batch of chunk(videoDbIds, 500)) {
    if (batch.length === 0) continue;
    const { error } = await supabaseAdmin.rpc("refresh_video_metrics", {
      p_video_ids: batch,
      p_window_hours: settings.vphWindowHours,
      p_cardiac_min_views: settings.cardiacMinViews,
      p_cardiac_max_vph: settings.cardiacMaxVph,
    });
    if (error) throw new Error(`refresh_video_metrics rpc failed: ${error.message}`);
  }
}

export interface RefreshSummary {
  channelsScanned: number;
  newVideosDiscovered: number;
  videosStatsRefreshed: number;
  cardiacArrestCount: number;
  /** True when the run stopped early to stay inside its time budget. The next run continues. */
  timedOut: boolean;
  errors: string[];
}

/**
 * The main polling job — meant to be triggered on a schedule (see
 * src/app/api/cron/refresh/route.ts). Discovers new uploads across every
 * tracked channel, refreshes stats for videos due for a recheck, recomputes
 * VPH/심정지 flags, and prunes old snapshot history.
 */
export async function runRefreshJob(
  opts: {
    maxPagesPerChannel?: number;
    maxStatsRefreshPerRun?: number;
    /**
     * Wall-clock budget for the whole run. The host kills the request at its own
     * limit (60s on Vercel Hobby) with no chance to report progress, so stop
     * cleanly a little before that and let the next run continue instead.
     */
    budgetMs?: number;
  } = {}
): Promise<RefreshSummary> {
  const settings = await getSettings();
  const deadline = Date.now() + (opts.budgetMs ?? Number.POSITIVE_INFINITY);
  const outOfTime = () => Date.now() >= deadline;
  let timedOut = false;
  const errors: string[] = [];
  const touched = new Set<string>();
  let newVideosDiscovered = 0;
  let channelsScanned = 0;

  const { data: channels, error: chErr } = await supabaseAdmin.from("channels").select("*");
  if (chErr) throw new Error(chErr.message);

  for (const channel of channels ?? []) {
    if (outOfTime()) {
      timedOut = true;
      break;
    }
    try {
      const ready = await ensureChannelMetadata(channel as ChannelRow);
      const { newVideoDbIds } = await scanChannel(ready, opts.maxPagesPerChannel ?? 5);
      newVideoDbIds.forEach((id) => touched.add(id));
      newVideosDiscovered += newVideoDbIds.length;
      channelsScanned++;
    } catch (e) {
      errors.push(`${channel.title}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Refresh stats for videos due a recheck: everything published recently
  // (to catch trending/flatlining as it happens) plus a rotating slice of
  // older videos so the whole catalog eventually gets rechecked too.
  const maxStats = opts.maxStatsRefreshPerRun ?? 1500;
  const recentCutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();

  // Both lists are ordered by staleness so each run picks up where the last
  // one left off, and capped so a run can't grow unbounded with the catalog.
  const recentList = await fetchVideoRefs("recent", recentCutoff, maxStats, errors);
  const remainingBudget = Math.max(maxStats - recentList.length, 0);
  const olderList =
    remainingBudget > 0
      ? await fetchVideoRefs("older", recentCutoff, remainingBudget, errors)
      : [];

  const seen = new Set<string>();
  const toRefresh = [...recentList, ...olderList].filter((v) => {
    if (seen.has(v.id)) return false;
    seen.add(v.id);
    return true;
  });

  let videosStatsRefreshed = 0;
  try {
    for (const batch of chunk(toRefresh, 500)) {
      if (outOfTime()) {
        timedOut = true;
        break;
      }
      const ids = await refreshStats(batch);
      ids.forEach((id) => touched.add(id));
      videosStatsRefreshed += ids.length;
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  try {
    await computeMetrics(Array.from(touched), settings);
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  const cutoff = new Date(Date.now() - SNAPSHOT_RETENTION_DAYS * 24 * 3600 * 1000).toISOString();
  await supabaseAdmin.from("video_snapshots").delete().lt("checked_at", cutoff);

  const { count } = await supabaseAdmin
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("is_cardiac_arrest", true);

  return {
    channelsScanned,
    newVideosDiscovered,
    videosStatsRefreshed,
    cardiacArrestCount: count ?? 0,
    timedOut,
    errors,
  };
}

/**
 * On-demand scan for a single channel, used right after a user adds a new
 * 관심채널 so they see results immediately instead of waiting for the next
 * scheduled run. Uses a larger page budget since it's just one channel; the
 * regular cron job continues any remaining backfill afterwards.
 */
export async function scanSingleChannel(channelDbId: string): Promise<RefreshSummary> {
  const settings = await getSettings();
  const errors: string[] = [];
  const touched = new Set<string>();

  const { data: channel, error } = await supabaseAdmin
    .from("channels")
    .select("*")
    .eq("id", channelDbId)
    .single();
  if (error || !channel) throw new Error(error?.message ?? "채널을 찾을 수 없습니다.");

  let newVideosDiscovered = 0;
  try {
    const ready = await ensureChannelMetadata(channel as ChannelRow);
    const { newVideoDbIds } = await scanChannel(ready, 10);
    newVideoDbIds.forEach((id) => touched.add(id));
    newVideosDiscovered = newVideoDbIds.length;

    // Also refresh anything already on file for this channel that's due, so
    // reopening the channel page right after adding it shows fresh VPH too.
    const { data: existing } = await supabaseAdmin
      .from("videos")
      .select("id, youtube_video_id, channel_id")
      .eq("channel_id", channel.id)
      .not("id", "in", `(${Array.from(touched).join(",") || "00000000-0000-0000-0000-000000000000"})`)
      .limit(500);
    if (existing && existing.length > 0) {
      const ids = await refreshStats(existing);
      ids.forEach((id) => touched.add(id));
    }
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  try {
    await computeMetrics(Array.from(touched), settings);
  } catch (e) {
    errors.push(e instanceof Error ? e.message : String(e));
  }

  const { count } = await supabaseAdmin
    .from("videos")
    .select("id", { count: "exact", head: true })
    .eq("channel_id", channelDbId)
    .eq("is_cardiac_arrest", true);

  return {
    channelsScanned: 1,
    newVideosDiscovered,
    videosStatsRefreshed: touched.size - newVideosDiscovered,
    cardiacArrestCount: count ?? 0,
    timedOut: false,
    errors,
  };
}
