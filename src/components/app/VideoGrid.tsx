import VideoCard from "@/components/app/VideoCard";
import type { VideoWithChannel } from "@/lib/types";

export default function VideoGrid({
  videos,
  mode,
}: {
  videos: VideoWithChannel[];
  mode: "trending" | "cardiac";
}) {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-24 text-center text-zinc-500">
        <p className="text-sm font-medium">
          {mode === "cardiac"
            ? "아직 심정지 영상이 없어요."
            : "아직 급상승 영상이 없어요."}
        </p>
        <p className="text-xs text-zinc-600">
          관심채널을 추가하고 새로고침하면 데이터가 쌓이기 시작해요. (최소 2회 이상 수집이 필요해요)
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} mode={mode} />
      ))}
    </div>
  );
}
