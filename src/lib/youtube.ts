import { env } from "@/lib/env";

const API_BASE = "https://www.googleapis.com/youtube/v3";

export class YouTubeApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "YouTubeApiError";
  }
}

async function callApi<T>(
  path: string,
  params: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(`${API_BASE}/${path}`);
  url.searchParams.set("key", env.youtubeApiKey);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) url.searchParams.set(k, String(v));
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      /* ignore */
    }
    throw new YouTubeApiError(
      `YouTube API ${path} failed (${res.status})`,
      res.status,
      body
    );
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Types (only the fields we actually use)
// ---------------------------------------------------------------------------

export interface ChannelInfo {
  channelId: string;
  title: string;
  handle: string | null;
  thumbnailUrl: string | null;
  subscriberCount: number | null;
  uploadsPlaylistId: string;
}

export interface PlaylistVideoRef {
  videoId: string;
  publishedAt: string;
}

export interface VideoStats {
  videoId: string;
  title: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  durationSeconds: number;
  isShort: boolean;
  viewCount: number;
  likeCount: number | null;
  commentCount: number | null;
}

// ---------------------------------------------------------------------------
// Channel resolution — accepts a pasted URL, @handle, or a raw channel ID
// ---------------------------------------------------------------------------

/** Best-effort extraction of a handle/ID/videoId from whatever the user pasted. */
function parseChannelInput(raw: string): {
  channelId?: string;
  handle?: string;
  videoId?: string;
  legacyName?: string;
} {
  const input = raw.trim();

  // Raw channel ID, e.g. "UCxxxxxxxxxxxxxxxxxxxxxx"
  if (/^UC[\w-]{22}$/.test(input)) return { channelId: input };

  // Bare handle, e.g. "@somechannel"
  if (/^@[\w.-]+$/.test(input)) return { handle: input };

  try {
    const url = new URL(input);
    const parts = url.pathname.split("/").filter(Boolean);

    if (url.hostname.includes("youtu.be")) {
      return { videoId: parts[0] };
    }

    if (parts[0] === "watch") {
      const v = url.searchParams.get("v");
      if (v) return { videoId: v };
    }
    if (parts[0] === "channel" && parts[1]) return { channelId: parts[1] };
    if (parts[0]?.startsWith("@")) return { handle: parts[0] };
    if ((parts[0] === "c" || parts[0] === "user") && parts[1]) {
      return { legacyName: parts[1] };
    }
    // Fallback: treat first path segment as a handle-ish name
    if (parts[0]) return { legacyName: parts[0] };
  } catch {
    // Not a URL — treat as a plain handle/name typed without "@"
    return { handle: input.startsWith("@") ? input : `@${input}` };
  }

  return {};
}

interface ChannelsListResponse {
  items?: Array<{
    id: string;
    snippet: { title: string; thumbnails?: { default?: { url: string }; medium?: { url: string } }; customUrl?: string };
    statistics?: { subscriberCount?: string };
    contentDetails: { relatedPlaylists: { uploads: string } };
  }>;
}

function toChannelInfo(item: NonNullable<ChannelsListResponse["items"]>[number]): ChannelInfo {
  return {
    channelId: item.id,
    title: item.snippet.title,
    handle: item.snippet.customUrl ?? null,
    thumbnailUrl:
      item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? null,
    subscriberCount: item.statistics?.subscriberCount
      ? Number(item.statistics.subscriberCount)
      : null,
    uploadsPlaylistId: item.contentDetails.relatedPlaylists.uploads,
  };
}

export async function fetchChannelById(channelId: string): Promise<ChannelInfo | null> {
  const data = await callApi<ChannelsListResponse>("channels", {
    part: "snippet,statistics,contentDetails",
    id: channelId,
  });
  const item = data.items?.[0];
  return item ? toChannelInfo(item) : null;
}

export async function fetchChannelByHandle(handle: string): Promise<ChannelInfo | null> {
  const data = await callApi<ChannelsListResponse>("channels", {
    part: "snippet,statistics,contentDetails",
    forHandle: handle,
  });
  const item = data.items?.[0];
  return item ? toChannelInfo(item) : null;
}

interface SearchListResponse {
  items?: Array<{ id: { channelId?: string } }>;
}

/** search.list costs 100 quota units — only used as a last resort for legacy /c/ or /user/ URLs. */
async function searchChannelByName(name: string): Promise<string | null> {
  const data = await callApi<SearchListResponse>("search", {
    part: "snippet",
    type: "channel",
    q: name,
    maxResults: 1,
  });
  return data.items?.[0]?.id.channelId ?? null;
}

interface VideosListResponse {
  items?: Array<{ snippet: { channelId: string } }>;
}

async function fetchVideoChannelId(videoId: string): Promise<string | null> {
  const data = await callApi<VideosListResponse>("videos", {
    part: "snippet",
    id: videoId,
  });
  return data.items?.[0]?.snippet.channelId ?? null;
}

/**
 * Resolves whatever a user pastes (channel URL, @handle, legacy /c//user/ URL,
 * a video URL, or a raw ID) into full channel info, spending as little API
 * quota as possible.
 */
export async function resolveChannel(rawInput: string): Promise<ChannelInfo> {
  const parsed = parseChannelInput(rawInput);

  if (parsed.channelId) {
    const info = await fetchChannelById(parsed.channelId);
    if (!info) throw new Error("해당 채널 ID를 찾을 수 없어요.");
    return info;
  }

  if (parsed.handle) {
    const info = await fetchChannelByHandle(parsed.handle);
    if (info) return info;
    // Some handles are indexed as legacy custom names — fall through to search.
  }

  if (parsed.videoId) {
    const channelId = await fetchVideoChannelId(parsed.videoId);
    if (!channelId) throw new Error("영상에서 채널 정보를 찾을 수 없어요.");
    const info = await fetchChannelById(channelId);
    if (!info) throw new Error("해당 채널을 찾을 수 없어요.");
    return info;
  }

  const legacyName = parsed.legacyName ?? parsed.handle;
  if (legacyName) {
    const channelId = await searchChannelByName(legacyName.replace(/^@/, ""));
    if (!channelId) throw new Error("채널을 찾을 수 없어요. URL이나 @핸들을 다시 확인해주세요.");
    const info = await fetchChannelById(channelId);
    if (!info) throw new Error("해당 채널을 찾을 수 없어요.");
    return info;
  }

  throw new Error("채널 URL, @핸들, 또는 채널 ID를 입력해주세요.");
}

// ---------------------------------------------------------------------------
// Uploads playlist pagination
// ---------------------------------------------------------------------------

interface PlaylistItemsResponse {
  items?: Array<{
    contentDetails: { videoId: string; videoPublishedAt?: string };
    snippet?: { publishedAt?: string };
  }>;
  nextPageToken?: string;
}

export async function fetchUploadsPage(
  uploadsPlaylistId: string,
  pageToken?: string
): Promise<{ videos: PlaylistVideoRef[]; nextPageToken?: string }> {
  const data = await callApi<PlaylistItemsResponse>("playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: 50,
    pageToken,
  });
  const videos = (data.items ?? []).map((item) => ({
    videoId: item.contentDetails.videoId,
    publishedAt:
      item.contentDetails.videoPublishedAt ?? item.snippet?.publishedAt ?? new Date().toISOString(),
  }));
  return { videos, nextPageToken: data.nextPageToken };
}

// ---------------------------------------------------------------------------
// Batched video stats
// ---------------------------------------------------------------------------

function parseIsoDuration(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

interface FullVideosListResponse {
  items?: Array<{
    id: string;
    snippet: { title: string; publishedAt: string; thumbnails?: { medium?: { url: string }; default?: { url: string } } };
    statistics?: { viewCount?: string; likeCount?: string; commentCount?: string };
    contentDetails: { duration: string };
  }>;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** Batches video IDs into groups of 50 (the API max) — 1 quota unit per call. */
export async function fetchVideoStats(videoIds: string[]): Promise<VideoStats[]> {
  const results: VideoStats[] = [];
  for (const batch of chunk(videoIds, 50)) {
    if (batch.length === 0) continue;
    const data = await callApi<FullVideosListResponse>("videos", {
      part: "snippet,statistics,contentDetails",
      id: batch.join(","),
    });
    for (const item of data.items ?? []) {
      const durationSeconds = parseIsoDuration(item.contentDetails.duration);
      results.push({
        videoId: item.id,
        title: item.snippet.title,
        thumbnailUrl:
          item.snippet.thumbnails?.medium?.url ?? item.snippet.thumbnails?.default?.url ?? null,
        publishedAt: item.snippet.publishedAt,
        durationSeconds,
        isShort: durationSeconds > 0 && durationSeconds <= 180,
        viewCount: Number(item.statistics?.viewCount ?? 0),
        likeCount: item.statistics?.likeCount ? Number(item.statistics.likeCount) : null,
        commentCount: item.statistics?.commentCount ? Number(item.statistics.commentCount) : null,
      });
    }
  }
  return results;
}
