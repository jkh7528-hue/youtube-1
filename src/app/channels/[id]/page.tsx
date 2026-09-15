import { notFound } from "next/navigation";
import Link from "next/link";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { getChannelDetail, getCategories } from "@/lib/queries";
import { formatCompactKo, formatRelativeTime, formatVph } from "@/lib/format";
import VideoGrid from "@/components/app/VideoGrid";
import ChannelActions from "@/components/app/ChannelActions";
import ChannelCategoryEditor from "@/components/app/ChannelCategoryEditor";

export const dynamic = "force-dynamic";

export default async function ChannelDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const [{ id }, { from }] = await Promise.all([params, searchParams]);
  const [{ channel, cardiacArrestVideos, recentVideos }, categories] = await Promise.all([
    getChannelDetail(id),
    getCategories(),
  ]);

  if (!channel) notFound();

  // `from` is the folder slug you came in through, so going back lands you
  // where you were instead of at the top-level folder grid.
  const backHref = from ? `/channels?category=${encodeURIComponent(from)}` : "/channels";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Link href={backHref} className="mb-4 flex w-fit items-center gap-1 text-sm text-zinc-500 hover:text-zinc-200">
        <CaretLeft size={14} /> {from ? "폴더로 돌아가기" : "관심채널 목록"}
      </Link>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {channel.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={channel.thumbnail_url} alt="" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-zinc-800" />
          )}
          <div>
            <h1 className="text-lg font-bold text-zinc-50">{channel.title}</h1>
            <p className="text-sm text-zinc-500">
              구독자 {formatCompactKo(channel.subscriber_count)} · 수집된 영상{" "}
              {channel.videoCount.toLocaleString("ko-KR")}개 ·{" "}
              {channel.backfill_completed ? "전체 수집 완료" : "과거 영상 수집 중"}
            </p>
            {channel.last_scanned_at && (
              <p className="mt-0.5 text-xs text-zinc-600">
                마지막 스캔 {formatRelativeTime(channel.last_scanned_at)}
              </p>
            )}
            <div className="mt-2">
              <ChannelCategoryEditor
                channelId={channel.id}
                categories={categories}
                selectedIds={channel.categories.map((c) => c.id)}
              />
            </div>
          </div>
        </div>
        <ChannelActions channelId={channel.id} isFavorite={channel.is_favorite} />
      </div>

      <section className="mt-8">
        <h2 className="mb-1 text-lg font-bold text-cardiac">💔 이 채널의 심정지 영상</h2>
        <p className="mb-4 text-sm text-zinc-500">
          누적 조회수는 높지만 최근엔 조회수가 거의 멈춘 영상 — 소재로 다시 써먹기 좋은 후보예요.
          ({channel.cardiacArrestCount.toLocaleString("ko-KR")}개)
        </p>
        <VideoGrid videos={cardiacArrestVideos} mode="cardiac" />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-bold text-zinc-400">최근 업로드</h2>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {recentVideos.length === 0 && (
            <p className="p-4 text-sm text-zinc-500">아직 수집된 영상이 없어요.</p>
          )}
          {recentVideos.map((v) => (
            <a
              key={v.id}
              href={`https://www.youtube.com/watch?v=${v.youtube_video_id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3 text-sm hover:bg-surface-hover"
            >
              {v.thumbnail_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnail_url} alt="" className="h-10 w-16 shrink-0 rounded object-cover" />
              )}
              <span className="min-w-0 flex-1 truncate text-zinc-200">{v.title}</span>
              <span className="shrink-0 text-xs tabular text-zinc-500">
                조회수 {formatCompactKo(v.latest_view_count)} · {formatVph(v.recent_vph)} 회/h
              </span>
              <span className="hidden shrink-0 text-xs text-zinc-600 sm:inline">
                {formatRelativeTime(v.published_at)}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
