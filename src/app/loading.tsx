import VideoGridSkeleton from "@/components/app/VideoGridSkeleton";

/**
 * Route-level fallback. Every page here is force-dynamic, so without this a
 * navigation left the previous screen frozen until the server responded —
 * which is what read as the app "lagging" on each click.
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-8xl animate-pulse px-4 py-6 sm:px-6">
      <div className="mb-5 h-6 w-56 rounded bg-zinc-800" />
      <div className="mb-6 h-4 w-80 rounded bg-zinc-900" />
      <div className="mb-6 flex gap-2">
        <div className="h-8 w-16 rounded-full bg-zinc-800" />
        <div className="h-8 w-24 rounded-full bg-zinc-800" />
        <div className="h-8 w-20 rounded-full bg-zinc-800" />
      </div>
      <VideoGridSkeleton />
    </div>
  );
}
