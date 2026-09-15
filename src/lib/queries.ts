import "server-only";
import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSettings } from "@/lib/settings";
import type { CategoryRow, ChannelRow, VideoWithChannel } from "@/lib/types";

const VIDEO_WITH_CHANNEL_SELECT =
  "*, channel:channels(id, title, thumbnail_url, youtube_channel_id, subscriber_count, is_favorite)";

export const getCategories = cache(async function getCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
});

async function channelIdsForCategory(categorySlug: string): Promise<string[]> {
  const { data: category } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!category) return [];
  const { data } = await supabaseAdmin
    .from("channel_categories")
    .select("channel_id")
    .eq("category_id", category.id);
  return (data ?? []).map((r) => r.channel_id as string);
}

export interface VideoListParams {
  categorySlug?: string;
  excludeShorts?: boolean;
  limit?: number;
}

/** 급상승: recently published videos ranked by current VPH, descending. */
export async function getTrendingVideos(params: VideoListParams = {}): Promise<{
  videos: VideoWithChannel[];
  settings: Awaited<ReturnType<typeof getSettings>>;
}> {
  const settings = await getSettings();
  const cutoff = new Date(
    Date.now() - settings.trendingLookbackDays * 24 * 3600 * 1000
  ).toISOString();

  let query = supabaseAdmin
    .from("videos")
    .select(VIDEO_WITH_CHANNEL_SELECT)
    .gte("published_at", cutoff)
    .not("recent_vph", "is", null)
    .order("recent_vph", { ascending: false })
    .limit(params.limit ?? 60);

  if (params.excludeShorts ?? settings.excludeShortsByDefault) {
    query = query.eq("is_short", false);
  }

  if (params.categorySlug) {
    const channelIds = await channelIdsForCategory(params.categorySlug);
    if (channelIds.length === 0) return { videos: [], settings };
    query = query.in("channel_id", channelIds);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { videos: (data ?? []) as unknown as VideoWithChannel[], settings };
}

/** 심정지: high lifetime views but a current VPH that's flatlined. */
export async function getCardiacArrestVideos(params: VideoListParams = {}): Promise<{
  videos: VideoWithChannel[];
  settings: Awaited<ReturnType<typeof getSettings>>;
}> {
  const settings = await getSettings();

  let query = supabaseAdmin
    .from("videos")
    .select(VIDEO_WITH_CHANNEL_SELECT)
    .eq("is_cardiac_arrest", true)
    .order("latest_view_count", { ascending: false })
    .limit(params.limit ?? 60);

  if (params.excludeShorts ?? settings.excludeShortsByDefault) {
    query = query.eq("is_short", false);
  }

  if (params.categorySlug) {
    const channelIds = await channelIdsForCategory(params.categorySlug);
    if (channelIds.length === 0) return { videos: [], settings };
    query = query.in("channel_id", channelIds);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return { videos: (data ?? []) as unknown as VideoWithChannel[], settings };
}

interface ChannelVideoStats {
  videoCountByChannel: Map<string, number>;
  cardiacCountByChannel: Map<string, number>;
}

/**
 * Per-channel video counts, aggregated in Postgres by the `channel_video_stats`
 * view (supabase/migrations/0003_channel_stats.sql) — one row per channel.
 *
 * The previous version pulled every `videos` row and counted in JS, which both
 * dominated the /channels response time and silently truncated at PostgREST's
 * 1000-row default. The fallback below keeps the page working on a database
 * where migration 0003 hasn't been applied yet; it has the old bug, so run the
 * migration.
 */
async function getChannelVideoStats(channelIds: string[]): Promise<ChannelVideoStats> {
  const videoCountByChannel = new Map<string, number>();
  const cardiacCountByChannel = new Map<string, number>();

  const { data, error } = await supabaseAdmin
    .from("channel_video_stats")
    .select("channel_id, video_count, cardiac_arrest_count")
    .in("channel_id", channelIds);

  if (!error) {
    for (const row of data ?? []) {
      videoCountByChannel.set(row.channel_id, Number(row.video_count ?? 0));
      cardiacCountByChannel.set(row.channel_id, Number(row.cardiac_arrest_count ?? 0));
    }
    return { videoCountByChannel, cardiacCountByChannel };
  }

  console.warn(
    "[queries] channel_video_stats 뷰를 읽지 못해 느린 경로로 대체합니다. " +
      "supabase/migrations/0003_channel_stats.sql 을 적용하세요. 원인:",
    error.message
  );

  const { data: rows } = await supabaseAdmin
    .from("videos")
    .select("channel_id, is_cardiac_arrest")
    .in("channel_id", channelIds);
  for (const row of rows ?? []) {
    videoCountByChannel.set(row.channel_id, (videoCountByChannel.get(row.channel_id) ?? 0) + 1);
    if (row.is_cardiac_arrest) {
      cardiacCountByChannel.set(row.channel_id, (cardiacCountByChannel.get(row.channel_id) ?? 0) + 1);
    }
  }
  return { videoCountByChannel, cardiacCountByChannel };
}

export interface ChannelWithCategories extends ChannelRow {
  categories: CategoryRow[];
  videoCount: number;
  cardiacArrestCount: number;
}

export async function getChannels(): Promise<ChannelWithCategories[]> {
  const { data: channels, error } = await supabaseAdmin
    .from("channels")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  if (!channels || channels.length === 0) return [];

  const channelIds = channels.map((c) => c.id);

  const [{ data: links }, stats] = await Promise.all([
    supabaseAdmin
      .from("channel_categories")
      .select("channel_id, category:categories(*)")
      .in("channel_id", channelIds),
    getChannelVideoStats(channelIds),
  ]);

  const categoriesByChannel = new Map<string, CategoryRow[]>();
  for (const link of links ?? []) {
    const list = categoriesByChannel.get(link.channel_id) ?? [];
    if (link.category) list.push(link.category as unknown as CategoryRow);
    categoriesByChannel.set(link.channel_id, list);
  }

  const { videoCountByChannel, cardiacCountByChannel } = stats;

  return channels.map((c) => ({
    ...c,
    categories: categoriesByChannel.get(c.id) ?? [],
    videoCount: videoCountByChannel.get(c.id) ?? 0,
    cardiacArrestCount: cardiacCountByChannel.get(c.id) ?? 0,
  }));
}

/** Sentinel slug for the "no category yet" folder. `slugify()` in actions.ts
 *  strips every non letter/digit, so a real category slug can never start with
 *  an underscore and can never collide with this. */
export const UNCATEGORIZED_SLUG = "_none";

export interface ChannelFolder {
  /** null for the 미분류 folder. */
  category: CategoryRow | null;
  channels: ChannelWithCategories[];
  videoCount: number;
  cardiacArrestCount: number;
}

/**
 * Channels grouped into category folders for /channels.
 *
 * Grouping happens here rather than in SQL: getChannels() already makes the
 * only round trips needed (channels + category links + the stats view), and a
 * channel belongs to zero or more categories, so it legitimately shows up in
 * several folders at once.
 *
 * 미분류 is always last and always present, even when empty — it is the entry
 * point for adding a channel that doesn't belong to a category yet.
 */
export async function getChannelFolders(): Promise<ChannelFolder[]> {
  const [channels, categories] = await Promise.all([getChannels(), getCategories()]);

  const build = (category: CategoryRow | null, members: ChannelWithCategories[]): ChannelFolder => ({
    category,
    channels: members,
    videoCount: members.reduce((sum, c) => sum + c.videoCount, 0),
    cardiacArrestCount: members.reduce((sum, c) => sum + c.cardiacArrestCount, 0),
  });

  const folders = categories.map((category) =>
    build(
      category,
      channels.filter((ch) => ch.categories.some((c) => c.id === category.id))
    )
  );

  folders.push(build(null, channels.filter((ch) => ch.categories.length === 0)));
  return folders;
}

export async function getChannelDetail(channelId: string): Promise<{
  channel: ChannelWithCategories | null;
  cardiacArrestVideos: VideoWithChannel[];
  recentVideos: VideoWithChannel[];
}> {
  const { data: channel, error } = await supabaseAdmin
    .from("channels")
    .select("*")
    .eq("id", channelId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!channel) return { channel: null, cardiacArrestVideos: [], recentVideos: [] };

  const [{ data: links }, { data: cardiacArrest }, { data: recent }, { count: videoCount }, { count: cardiacCount }] =
    await Promise.all([
      supabaseAdmin.from("channel_categories").select("category:categories(*)").eq("channel_id", channelId),
      supabaseAdmin
        .from("videos")
        .select(VIDEO_WITH_CHANNEL_SELECT)
        .eq("channel_id", channelId)
        .eq("is_cardiac_arrest", true)
        .order("latest_view_count", { ascending: false })
        .limit(200),
      supabaseAdmin
        .from("videos")
        .select(VIDEO_WITH_CHANNEL_SELECT)
        .eq("channel_id", channelId)
        .order("published_at", { ascending: false })
        .limit(30),
      supabaseAdmin.from("videos").select("id", { count: "exact", head: true }).eq("channel_id", channelId),
      supabaseAdmin
        .from("videos")
        .select("id", { count: "exact", head: true })
        .eq("channel_id", channelId)
        .eq("is_cardiac_arrest", true),
    ]);

  return {
    channel: {
      ...(channel as ChannelRow),
      categories: (links ?? []).map((l) => l.category as unknown as CategoryRow).filter(Boolean),
      videoCount: videoCount ?? 0,
      cardiacArrestCount: cardiacCount ?? 0,
    },
    cardiacArrestVideos: (cardiacArrest ?? []) as unknown as VideoWithChannel[],
    recentVideos: (recent ?? []) as unknown as VideoWithChannel[],
  };
}
