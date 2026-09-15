/** Covers /channels and /channels/[id], which has no closer boundary. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-4 py-6 sm:px-6">
      <div className="h-6 w-32 rounded bg-zinc-800" />
      <div className="mt-2 h-4 w-96 max-w-full rounded bg-zinc-900" />
      <div className="mt-5 h-28 rounded-xl border border-border bg-surface" />
      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <div className="h-11 w-11 shrink-0 rounded-full bg-zinc-800" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="h-4 w-40 rounded bg-zinc-800" />
              <div className="h-3 w-64 max-w-full rounded bg-zinc-900" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
