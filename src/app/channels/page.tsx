import Link from "next/link";
import { CheckCircle, Clock } from "@phosphor-icons/react/dist/ssr";
import { getChannels, getCategories } from "@/lib/queries";
import ChannelForm from "@/components/app/ChannelForm";
import ChannelActions from "@/components/app/ChannelActions";
import { formatCompactKo, formatRelativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  const [channels, categories] = await Promise.all([getChannels(), getCategories()]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <h1 className="text-xl font-bold text-zinc-50">관심채널</h1>
      <p className="mt-1 text-sm text-zinc-500">
        등록한 채널은 업로드 영상 전체를 대상으로 심정지 영상을 자동으로 찾아드려요.
      </p>

      <div className="mt-5">
        <ChannelForm categories={categories} />
      </div>

      <div className="mt-8 flex flex-col gap-3">
        {channels.length === 0 && (
          <p className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-zinc-500">
            아직 등록된 채널이 없어요. 위에서 채널을 추가해보세요.
          </p>
        )}
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <Link href={`/channels/${channel.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              {channel.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={channel.thumbnail_url}
                  alt=""
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="h-11 w-11 shrink-0 rounded-full bg-zinc-800" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-zinc-100">{channel.title}</p>
                  {channel.is_favorite && (
                    <span className="shrink-0 rounded-full bg-cardiac/10 px-1.5 py-0.5 text-[10px] font-bold text-cardiac">
                      관심
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500">
                  <span>구독자 {formatCompactKo(channel.subscriber_count)}</span>
                  <span>·</span>
                  <span>영상 {channel.videoCount.toLocaleString("ko-KR")}개</span>
                  <span className="flex items-center gap-1 text-cardiac">
                    심정지 {channel.cardiacArrestCount.toLocaleString("ko-KR")}개
                  </span>
                  {channel.categories.map((c) => (
                    <span key={c.id} className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-400">
                      {c.name}
                    </span>
                  ))}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-600">
                  {channel.backfill_completed ? (
                    <>
                      <CheckCircle size={12} weight="fill" className="text-emerald-500" />
                      전체 수집 완료
                    </>
                  ) : (
                    <>
                      <Clock size={12} />
                      과거 영상 수집 중...
                    </>
                  )}
                  {channel.last_scanned_at && (
                    <span>· 마지막 스캔 {formatRelativeTime(channel.last_scanned_at)}</span>
                  )}
                </div>
              </div>
            </Link>
            <ChannelActions channelId={channel.id} isFavorite={channel.is_favorite} />
          </div>
        ))}
      </div>
    </div>
  );
}
