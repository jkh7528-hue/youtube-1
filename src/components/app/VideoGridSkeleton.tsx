/**
 * Placeholder shown while a video list streams in. Mirrors VideoCard's box
 * model exactly so the real cards swap in without the grid jumping.
 */
export default function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="영상을 불러오는 중"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="aspect-video w-full bg-zinc-800" />
          <div className="flex flex-1 flex-col gap-2 p-3">
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-3/5 rounded bg-zinc-800" />
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="h-4 w-4 shrink-0 rounded-full bg-zinc-800" />
              <div className="h-3 w-24 rounded bg-zinc-800" />
            </div>
            <div className="mt-auto flex items-center justify-between border-t border-border pt-2">
              <div className="h-3 w-20 rounded bg-zinc-800" />
              <div className="h-3 w-14 rounded bg-zinc-800" />
            </div>
            <div className="h-2.5 w-16 rounded bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
