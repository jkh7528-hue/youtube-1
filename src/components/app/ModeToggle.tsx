import Link from "next/link";
import { Flame, Heartbeat } from "@phosphor-icons/react/dist/ssr";

function hrefFor(mode: "trending" | "cardiac", category?: string) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  if (category) params.set("category", category);
  return `/?${params.toString()}`;
}

export default function ModeToggle({
  mode,
  category,
}: {
  mode: "trending" | "cardiac";
  category?: string;
}) {
  return (
    <div className="inline-flex rounded-xl border border-border bg-surface p-1">
      <Link
        href={hrefFor("trending", category)}
        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
          mode === "trending" ? "bg-trending-dim text-trending" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        <Flame size={15} weight={mode === "trending" ? "fill" : "regular"} />
        급상승
      </Link>
      <Link
        href={hrefFor("cardiac", category)}
        className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
          mode === "cardiac" ? "bg-cardiac-dim text-cardiac" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        <Heartbeat size={15} weight={mode === "cardiac" ? "fill" : "regular"} />
        심정지
      </Link>
    </div>
  );
}
