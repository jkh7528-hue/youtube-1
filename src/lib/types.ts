export interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface ChannelRow {
  id: string;
  youtube_channel_id: string;
  title: string;
  handle: string | null;
  thumbnail_url: string | null;
  subscriber_count: number | null;
  uploads_playlist_id: string | null;
  is_favorite: boolean;
  backfill_completed: boolean;
  backfill_page_token: string | null;
  last_scanned_at: string | null;
  created_at: string;
}

export interface VideoRow {
  id: string;
  youtube_video_id: string;
  channel_id: string;
  title: string;
  thumbnail_url: string | null;
  published_at: string;
  duration_seconds: number | null;
  is_short: boolean;
  latest_view_count: number | null;
  latest_like_count: number | null;
  latest_comment_count: number | null;
  recent_vph: number | null;
  is_cardiac_arrest: boolean;
  last_checked_at: string | null;
  created_at: string;
}

/** A video row joined with its parent channel, as returned by list queries. */
export interface VideoWithChannel extends VideoRow {
  channel: Pick<ChannelRow, "id" | "title" | "thumbnail_url" | "youtube_channel_id" | "subscriber_count" | "is_favorite">;
}

export interface AppSettingsValue {
  cardiacMinViews: number;
  cardiacMaxVph: number;
  vphWindowHours: number;
  trendingLookbackDays: number;
  excludeShortsByDefault: boolean;
}
