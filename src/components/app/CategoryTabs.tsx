import Link from "next/link";
import type { CategoryRow } from "@/lib/types";

function hrefFor(mode: "trending" | "cardiac", categorySlug?: string) {
  const params = new URLSearchParams();
  params.set("mode", mode);
  if (categorySlug) params.set("category", categorySlug);
  return `/?${params.toString()}`;
}

export default function CategoryTabs({
  categories,
  activeSlug,
  mode,
}: {
  categories: CategoryRow[];
  activeSlug?: string;
  mode: "trending" | "cardiac";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={hrefFor(mode)}
        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
          !activeSlug ? "bg-zinc-100 text-zinc-900" : "bg-surface text-zinc-400 hover:text-zinc-100"
        }`}
      >
        전체
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={hrefFor(mode, c.slug)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            activeSlug === c.slug
              ? "bg-zinc-100 text-zinc-900"
              : "bg-surface text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
