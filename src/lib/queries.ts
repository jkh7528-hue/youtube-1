import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getSettings } from "@/lib/settings";
import type { CategoryRow, ChannelRow, VideoWithChannel } from "@/lib/types";

const VIDEO_WITH_CHANNEL_SELECT =
  "*, channel:channels(id, title, thumbnail_url, youtube_channel_id, subscriber_count, is_favorite)";

export async function getCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

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

  const [{ data: links }, { data: counts }] = await Promise.all([
    supabaseAdmin
      .from("channel_categories")
      .select("channel_id, category:categories(*)")
      .in("channel_id", channelIds),
    supabaseAdmin
      .from("videos")
      .select("channel_id, is_cardiac_arrest")
      .in("channel_id", channelIds),
  ]);

  const categoriesByChannel = new Map<string, CategoryRow[]>();
  for (const link of links ?? []) {
    const list = categoriesByChannel.get(link.channel_id) ?? [];
    if (link.category) list.push(link.category as unknown as CategoryRow);
    categoriesByChannel.set(link.channel_id, list);
  }

  const videoCountByChannel = new Map<string, number>();
  const cardiacCountByChannel = new Map<string, number>();
  for (const row of counts ?? []) {
    videoCountByChannel.set(row.channel_id, (videoCountByChannel.get(row.channel_id) ?? 0) + 1);
    if (row.is_cardiac_arrest) {
      cardiacCountByChannel.set(row.channel_id, (cardiacCountByChannel.get(row.channel_id) ?? 0) + 1);
    }
  }

  return channels.map((c) => ({
    ...c,
    categories: categoriesByChannel.get(c.id) ?? [],
    videoCount: videoCountByChannel.get(c.id) ?? 0,
    cardiacArrestCount: cardiacCountByChannel.get(c.id) ?? 0,
  }));
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
