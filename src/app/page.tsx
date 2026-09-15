import { Suspense } from "react";
import Link from "next/link";
import {
  getCategories,
  getTrendingVideos,
  getCardiacArrestVideos,
  VIDEO_PAGE_SIZE,
} from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import CategoryTabs from "@/components/app/CategoryTabs";
import ModeToggle from "@/components/app/ModeToggle";
import Pagination from "@/components/app/Pagination";
import RefreshButton from "@/components/app/RefreshButton";
import VideoGrid from "@/components/app/VideoGrid";
import VideoGridSkeleton from "@/components/app/VideoGridSkeleton";
import { formatCompactKo } from "@/lib/format";

export const dynamic = "force-dynamic";

type Mode = "trending" | "cardiac";

/**
 * The slow half of the page. Kept in its own component so the shell — heading,
 * category tabs, mode toggle — renders and stays clickable while this streams.
 */
async function VideoResults({
  mode,
  category,
  page,
}: {
  mode: Mode;
  category?: string;
  page: number;
}) {
  const { videos, total } =
    mode === "cardiac"
      ? await getCardiacArrestVideos({ categorySlug: category, page })
      : await getTrendingVideos({ categorySlug: category, page });

  const totalPages = Math.max(1, Math.ceil(total / VIDEO_PAGE_SIZE));
  const firstRow = (page - 1) * VIDEO_PAGE_SIZE + 1;

  const hrefFor = (target: number) => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (category) params.set("category", category);
    if (target > 1) params.set("page", String(target));
    return `/?${params.toString()}`;
  };

  // A stale bookmark, or a page that emptied out since it was linked.
  if (videos.length === 0 && page > 1) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
        <p className="text-sm font-medium text-zinc-500">{page}페이지에는 영상이 없어요.</p>
        <Link
          href={hrefFor(1)}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-surface-hover"
        >
          1페이지로 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {total > 0 && (
        <p className="-mt-2 text-xs text-zinc-500 tabular">
          전체 {total.toLocaleString("ko-KR")}개 중{" "}
          <span className="font-semibold text-zinc-300">
            {firstRow.toLocaleString("ko-KR")}–{(firstRow + videos.length - 1).toLocaleString("ko-KR")}번째
          </span>
          {" · "}
          {page}/{totalPages} 페이지{" · "}본 영상은 아래로 내려갑니다
        </p>
      )}

      <VideoGrid videos={videos} mode={mode} />

      <Pagination current={page} totalPages={totalPages} hrefFor={hrefFor} />
    </div>
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; category?: string; page?: string }>;
}) {
  const { mode: rawMode, category, page: rawPage } = await searchParams;
  const mode: Mode = rawMode === "cardiac" ? "cardiac" : "trending";
  // A junk or negative ?page= falls back to the first page; a page past the end
  // just renders an empty grid with the pager still pointing home.
  const parsedPage = Number(rawPage);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  // Two cheap single-table reads, run together — this is all the shell waits on.
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);

  return (
    <div className="mx-auto max-w-8xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">
            {mode === "cardiac" ? "💔 심정지 영상 발굴" : "🔥 카테고리별 급상승"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {mode === "cardiac"
              ? `누적 조회수 ${formatCompactKo(settings.cardiacMinViews)} 이상, 최근 VPH ${settings.cardiacMaxVph} 이하인 소재용 영상`
              : `최근 ${settings.trendingLookbackDays}일 내 업로드 중 시간당 조회수(VPH) 상위 영상`}
          </p>
        </div>
        <RefreshButton />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryTabs categories={categories} activeSlug={category} mode={mode} />
        <ModeToggle mode={mode} category={category} />
      </div>

      {/*
        The key is what makes switching tabs feel instant: a changed key
        re-suspends this boundary, so the skeleton comes back immediately
        instead of the old list sitting there frozen until the new query lands.
      */}
      <Suspense key={`${mode}:${category ?? ""}:${page}`} fallback={<VideoGridSkeleton />}>
        <VideoResults mode={mode} category={category} page={page} />
      </Suspense>
    </div>
  );
}
