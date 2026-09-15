import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CaretLeft, CheckCircle, Clock, Folder } from "@phosphor-icons/react/dist/ssr";
import { getCategories, getChannelFolders, UNCATEGORIZED_SLUG } from "@/lib/queries";
import ChannelForm from "@/components/app/ChannelForm";
import ChannelActions from "@/components/app/ChannelActions";
import FolderCreateForm from "@/components/app/FolderCreateForm";
import { formatCompactKo, formatRelativeTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const UNCATEGORIZED_NAME = "미분류";

/** The per-folder counts come from the channels query, which is the slow part. */
async function FolderGrid() {
  const folders = await getChannelFolders();

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {folders.map((folder) => {
        const slug = folder.category?.slug ?? UNCATEGORIZED_SLUG;
        const name = folder.category?.name ?? UNCATEGORIZED_NAME;
        return (
          <Link
            key={slug}
            href={`/channels?category=${encodeURIComponent(slug)}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-zinc-700 hover:bg-surface-hover"
          >
            <div className="flex items-center gap-2">
              <Folder
                size={18}
                weight={folder.channels.length > 0 ? "fill" : "regular"}
                className="shrink-0 text-zinc-500 group-hover:text-cardiac"
              />
              <span className="truncate text-sm font-semibold text-zinc-100">{name}</span>
              <span className="ml-auto shrink-0 rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold text-zinc-400">
                채널 {folder.channels.length}
              </span>
            </div>

            {folder.category?.description && (
              <p className="line-clamp-1 text-xs text-zinc-500">{folder.category.description}</p>
            )}

            <div className="mt-auto flex items-center gap-x-2 border-t border-border pt-2 text-xs text-zinc-500">
              {folder.channels.length === 0 ? (
                <span className="text-zinc-600">비어 있어요</span>
              ) : (
                <>
                  <span>영상 {folder.videoCount.toLocaleString("ko-KR")}개</span>
                  <span>·</span>
                  <span className="text-cardiac">
                    심정지 {folder.cardiacArrestCount.toLocaleString("ko-KR")}개
                  </span>
                </>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function FolderGridSkeleton() {
  return (
    <div aria-busy="true" className="grid animate-pulse grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-[6.5rem] rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}

/** Channel rows for one folder. `slug` is already known to resolve to a folder. */
async function FolderContents({ slug }: { slug: string }) {
  const folders = await getChannelFolders();
  const folder = folders.find((f) => (f.category?.slug ?? UNCATEGORIZED_SLUG) === slug);
  const channels = folder?.channels ?? [];

  if (channels.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border py-16 text-center text-sm text-zinc-500">
        이 폴더에는 아직 채널이 없어요. 위에서 추가해보세요.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <Link
            href={`/channels/${channel.id}?from=${encodeURIComponent(slug)}`}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
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
                {/* The folder you are standing in is implied — show only the others. */}
                {channel.categories
                  .filter((c) => c.slug !== slug)
                  .map((c) => (
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
  );
}

function ChannelListSkeleton() {
  return (
    <div aria-busy="true" className="flex animate-pulse flex-col gap-3">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="h-[5.5rem] rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}

export default async function ChannelsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  // Small, request-deduped read. Everything slow sits behind the Suspense
  // boundaries below, so opening a folder paints immediately.
  const categories = await getCategories();

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <h1 className="text-xl font-bold text-zinc-50">관심채널</h1>
        <p className="mt-1 text-sm text-zinc-500">
          카테고리 폴더를 열면 그 안의 채널이 보여요. 채널 추가도 폴더 안에서 합니다.
        </p>

        <div className="mt-5">
          <Suspense key="_root" fallback={<FolderGridSkeleton />}>
            <FolderGrid />
          </Suspense>
        </div>

        <div className="mt-8 border-t border-border pt-5">
          <FolderCreateForm />
        </div>
      </div>
    );
  }

  const uncategorized = category === UNCATEGORIZED_SLUG;
  const active = uncategorized ? null : categories.find((c) => c.slug === category);
  // Stale bookmark, or a folder that was deleted — send them back to the grid.
  if (!uncategorized && !active) redirect("/channels");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Link
        href="/channels"
        className="mb-4 flex w-fit items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
      >
        <CaretLeft size={14} />
        관심채널
      </Link>

      <h1 className="flex items-center gap-2 text-xl font-bold text-zinc-50">
        <Folder size={20} weight="fill" className="text-zinc-600" />
        {active?.name ?? UNCATEGORIZED_NAME}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        {active?.description ??
          (uncategorized
            ? "아직 어느 폴더에도 넣지 않은 채널이에요."
            : "등록한 채널은 업로드 영상 전체를 대상으로 심정지 영상을 자동으로 찾아드려요.")}
      </p>

      <div className="mt-5">
        <ChannelForm categories={categories} preselectedIds={active ? [active.id] : []} />
      </div>

      <div className="mt-8">
        <Suspense key={category} fallback={<ChannelListSkeleton />}>
          <FolderContents slug={category} />
        </Suspense>
      </div>
    </div>
  );
}
