import { Suspense } from "react";
import { getCategories, getTrendingVideos, getCardiacArrestVideos } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import CategoryTabs from "@/components/app/CategoryTabs";
import ModeToggle from "@/components/app/ModeToggle";
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
async function VideoResults({ mode, category }: { mode: Mode; category?: string }) {
  const { videos } =
    mode === "cardiac"
      ? await getCardiacArrestVideos({ categorySlug: category })
      : await getTrendingVideos({ categorySlug: category });

  return <VideoGrid videos={videos} mode={mode} />;
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; category?: string }>;
}) {
  const { mode: rawMode, category } = await searchParams;
  const mode: Mode = rawMode === "cardiac" ? "cardiac" : "trending";

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
      <Suspense key={`${mode}:${category ?? ""}`} fallback={<VideoGridSkeleton />}>
        <VideoResults mode={mode} category={category} />
      </Suspense>
    </div>
  );
}
