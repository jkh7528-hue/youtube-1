"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Heartbeat, Flame, Play, Check } from "@phosphor-icons/react";
import { markVideoWatched } from "@/lib/actions";
import { formatCompactKo, formatRelativeTime, formatVph } from "@/lib/format";
import type { VideoWithChannel } from "@/lib/types";

export default function VideoCard({
  video,
  mode,
}: {
  video: VideoWithChannel;
  mode: "trending" | "cardiac";
}) {
  const youtubeUrl = `https://www.youtube.com/watch?v=${video.youtube_video_id}`;
  const [watched, setWatched] = useState(video.watched_at !== null);
  const [, startTransition] = useTransition();

  /**
   * Fires alongside the link, not instead of it — the anchor keeps its default
   * behaviour and YouTube opens in a new tab while this writes in the
   * background. The card marks itself immediately; the row only sinks to the
   * bottom of the grid on the next load, so the list never shifts mid-click.
   */
  function handleOpen() {
    if (watched) return;
    setWatched(true);
    startTransition(() => markVideoWatched(video.id, true));
  }

  function toggleWatched() {
    const next = !watched;
    setWatched(next);
    startTransition(() => markVideoWatched(video.id, next));
  }

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-xl border bg-surface transition-colors ${
        watched ? "border-zinc-800/70" : "border-border hover:border-zinc-700"
      }`}
    >
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noreferrer"
        onClick={handleOpen}
        className="relative block aspect-video overflow-hidden bg-zinc-800"
      >
        {video.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail_url}
            alt={video.title}
            loading="lazy"
            className={`h-full w-full object-cover transition-all duration-200 group-hover:scale-105 ${
              watched ? "opacity-40 grayscale" : ""
            }`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <Play size={28} />
          </div>
        )}
        <span
          className={`absolute left-2 top-2 flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold backdrop-blur ${
            mode === "cardiac"
              ? "bg-cardiac-dim/90 text-cardiac"
              : "bg-trending-dim/90 text-trending"
          } ${watched ? "opacity-50" : ""}`}
        >
          {mode === "cardiac" ? <Heartbeat size={12} weight="fill" /> : <Flame size={12} weight="fill" />}
          {mode === "cardiac" ? "심정지" : "급상승"}
        </span>
        {video.is_short && (
          <span
            className={`absolute right-2 top-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-200 ${
              watched ? "opacity-50" : ""
            }`}
          >
            SHORTS
          </span>
        )}
      </a>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <a href={youtubeUrl} target="_blank" rel="noreferrer" onClick={handleOpen}>
          <h3
            className={`line-clamp-2 text-sm font-semibold leading-snug transition-colors ${
              watched ? "text-zinc-500" : "text-zinc-100 group-hover:text-white"
            }`}
          >
            {video.title}
          </h3>
        </a>

        <div className="flex items-center justify-between gap-2">
          <Link
            href={`/channels/${video.channel.id}`}
            className="flex min-w-0 items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300"
          >
            {video.channel.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.channel.thumbnail_url}
                alt=""
                className="h-4 w-4 shrink-0 rounded-full object-cover"
              />
            )}
            <span className="truncate">{video.channel.title}</span>
          </Link>

          {/* Also the undo affordance — a mis-click shouldn't bury a video for good. */}
          <button
            type="button"
            onClick={toggleWatched}
            title={watched ? "안 본 영상으로 되돌리기" : "본 영상으로 표시"}
            aria-pressed={watched}
            className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${
              watched
                ? "border-emerald-600/40 bg-emerald-500/10 text-emerald-400"
                : "border-zinc-700 text-zinc-600 opacity-0 hover:text-zinc-300 focus-visible:opacity-100 group-hover:opacity-100"
            }`}
          >
            <Check size={10} weight="bold" />
            {watched ? "본 영상" : "봤음"}
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-xs tabular">
          <span className="text-zinc-400">
            조회수{" "}
            <span className={`font-semibold ${watched ? "text-zinc-500" : "text-zinc-200"}`}>
              {formatCompactKo(video.latest_view_count)}
            </span>
          </span>
          <span
            className={`font-semibold ${
              watched ? "text-zinc-600" : mode === "cardiac" ? "text-cardiac" : "text-trending"
            }`}
          >
            {formatVph(video.recent_vph)} 회/h
          </span>
        </div>
        <div className="text-[11px] text-zinc-600">{formatRelativeTime(video.published_at)} 게시</div>
      </div>
    </div>
  );
}
