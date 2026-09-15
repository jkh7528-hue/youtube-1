"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resolveChannel } from "@/lib/youtube";
import { scanSingleChannel, runRefreshJob } from "@/lib/refresh";
import { updateSettings } from "@/lib/settings";
import { env } from "@/lib/env";
import type { AppSettingsValue } from "@/lib/types";

// ---------------------------------------------------------------------------
// Auth (simple shared-password gate — see src/proxy.ts)
// ---------------------------------------------------------------------------

export async function login(formData: FormData): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/");
  const appPassword = env.appPassword;
  if (!appPassword || password !== appPassword) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }
  const store = await cookies();
  store.set("site_password", appPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(nextPath.startsWith("/") ? nextPath : "/");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete("site_password");
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

function slugify(input: string): string {
  const base = input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return base || `category-${Date.now()}`;
}

export async function createCategory(formData: FormData): Promise<{ error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  if (!name) return { error: "카테고리 이름을 입력해주세요." };

  const { error } = await supabaseAdmin.from("categories").insert({
    name,
    description,
    slug: slugify(name),
  });
  if (error) return { error: `저장 실패: ${error.message}` };
  revalidatePath("/settings");
  revalidatePath("/");
  return {};
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await supabaseAdmin.from("categories").delete().eq("id", categoryId);
  revalidatePath("/settings");
  revalidatePath("/");
}

// ---------------------------------------------------------------------------
// Channels
// ---------------------------------------------------------------------------

export async function addChannel(formData: FormData): Promise<{ error?: string }> {
  const input = String(formData.get("input") ?? "").trim();
  const isFavorite = formData.get("isFavorite") === "on";
  const categoryIds = formData.getAll("categoryIds").map(String);
  if (!input) return { error: "채널 URL이나 @핸들을 입력해주세요." };

  let info;
  try {
    info = await resolveChannel(input);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "채널을 찾을 수 없어요." };
  }

  const { data: existing } = await supabaseAdmin
    .from("channels")
    .select("id")
    .eq("youtube_channel_id", info.channelId)
    .maybeSingle();

  let channelId = existing?.id as string | undefined;

  if (channelId) {
    await supabaseAdmin
      .from("channels")
      .update({ is_favorite: isFavorite || undefined })
      .eq("id", channelId);
  } else {
    const { data: inserted, error } = await supabaseAdmin
      .from("channels")
      .insert({
        youtube_channel_id: info.channelId,
        title: info.title,
        handle: info.handle,
        thumbnail_url: info.thumbnailUrl,
        subscriber_count: info.subscriberCount,
        uploads_playlist_id: info.uploadsPlaylistId,
        is_favorite: isFavorite,
      })
      .select("id")
      .single();
    if (error || !inserted) return { error: `채널 추가 실패: ${error?.message}` };
    channelId = inserted.id;
  }

  if (categoryIds.length > 0 && channelId) {
    await supabaseAdmin.from("channel_categories").delete().eq("channel_id", channelId);
    await supabaseAdmin
      .from("channel_categories")
      .insert(categoryIds.map((categoryId) => ({ channel_id: channelId, category_id: categoryId })));
  }

  revalidatePath("/channels");
  revalidatePath("/");

  // Kick off an immediate partial scan so the channel isn't empty until the
  // next scheduled refresh. Best-effort — failures here shouldn't block the
  // user from seeing the channel was added.
  if (channelId) {
    try {
      await scanSingleChannel(channelId);
      revalidatePath(`/channels/${channelId}`);
      revalidatePath("/");
    } catch (e) {
      console.error("[addChannel] initial scan failed:", e);
    }
  }

  return {};
}

export async function removeChannel(channelId: string): Promise<void> {
  await supabaseAdmin.from("channels").delete().eq("id", channelId);
  revalidatePath("/channels");
  revalidatePath("/");
}

export async function setChannelCategories(
  channelId: string,
  categoryIds: string[]
): Promise<void> {
  await supabaseAdmin.from("channel_categories").delete().eq("channel_id", channelId);
  if (categoryIds.length > 0) {
    await supabaseAdmin
      .from("channel_categories")
      .insert(categoryIds.map((categoryId) => ({ channel_id: channelId, category_id: categoryId })));
  }
  revalidatePath("/channels");
  revalidatePath("/");
}

export async function toggleChannelFavorite(channelId: string, isFavorite: boolean): Promise<void> {
  await supabaseAdmin.from("channels").update({ is_favorite: isFavorite }).eq("id", channelId);
  revalidatePath("/channels");
  revalidatePath(`/channels/${channelId}`);
}

export async function rescanChannel(channelId: string): Promise<{ error?: string }> {
  try {
    await scanSingleChannel(channelId);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "스캔 중 오류가 발생했어요." };
  }
  revalidatePath(`/channels/${channelId}`);
  revalidatePath("/channels");
  revalidatePath("/");
  return {};
}

// ---------------------------------------------------------------------------
// 본 영상
// ---------------------------------------------------------------------------

/**
 * Records that a video was opened, so list queries can sort it to the bottom.
 *
 * Deliberately does NOT revalidate: the card marks itself watched on click and
 * the row only moves on the next load. Re-sorting the grid under the cursor
 * mid-browse would be worse than waiting.
 */
export async function markVideoWatched(videoId: string, watched = true): Promise<void> {
  await supabaseAdmin
    .from("videos")
    .update({ watched_at: watched ? new Date().toISOString() : null })
    .eq("id", videoId);
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export async function saveSettings(formData: FormData): Promise<{ error?: string }> {
  const next: Partial<AppSettingsValue> = {
    cardiacMinViews: Number(formData.get("cardiacMinViews")),
    cardiacMaxVph: Number(formData.get("cardiacMaxVph")),
    vphWindowHours: Number(formData.get("vphWindowHours")),
    trendingLookbackDays: Number(formData.get("trendingLookbackDays")),
    excludeShortsByDefault: formData.get("excludeShortsByDefault") === "on",
  };
  for (const [key, value] of Object.entries(next)) {
    if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) {
      return { error: `${key} 값이 올바르지 않습니다.` };
    }
  }
  await updateSettings(next);
  revalidatePath("/settings");
  revalidatePath("/");
  return {};
}

export async function manualRefreshAll(): Promise<{ error?: string; summary?: string }> {
  try {
    // Same budget as the cron route: a Server Action runs under the host's
    // function timeout too, so the button must return progress rather than 504.
    const summary = await runRefreshJob({ budgetMs: 50_000 });
    revalidatePath("/");
    revalidatePath("/channels");
    return {
      summary:
        `채널 ${summary.channelsScanned}개 확인, 신규 영상 ${summary.newVideosDiscovered}개, 통계 갱신 ${summary.videosStatsRefreshed}건, 심정지 누적 ${summary.cardiacArrestCount}건` +
        (summary.timedOut ? " (시간 제한으로 일부만 처리했어요. 다음 실행에서 이어서 진행됩니다.)" : ""),
    };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "새로고침 중 오류가 발생했어요." };
  }
}
