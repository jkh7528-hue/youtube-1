import Link from "next/link";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";

/**
 * Page numbers to render, with `null` standing in for a gap.
 *
 * Always keeps the first and last page reachable and shows a window around the
 * current one, so 13 pages fit on a phone without wrapping.
 */
function pageItems(current: number, total: number): Array<number | null> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const around = [current - 1, current, current + 1].filter((n) => n > 1 && n < total);
  const items: Array<number | null> = [1];
  if (around[0] > 2) items.push(null);
  items.push(...around);
  if (around[around.length - 1] < total - 1) items.push(null);
  items.push(total);
  return items;
}

const BASE =
  "flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition-colors";

export default function Pagination({
  current,
  totalPages,
  hrefFor,
}: {
  current: number;
  totalPages: number;
  /** Builds the URL for a page — the caller owns the other search params. */
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="페이지" className="flex flex-wrap items-center justify-center gap-1.5">
      {current > 1 ? (
        <Link
          href={hrefFor(current - 1)}
          aria-label="이전 페이지"
          className={`${BASE} border-border bg-surface text-zinc-300 hover:bg-surface-hover`}
        >
          <CaretLeft size={14} />
        </Link>
      ) : (
        <span aria-hidden className={`${BASE} border-transparent text-zinc-700`}>
          <CaretLeft size={14} />
        </span>
      )}

      {pageItems(current, totalPages).map((page, i) =>
        page === null ? (
          <span key={`gap-${i}`} className="px-1 text-sm text-zinc-600">
            …
          </span>
        ) : page === current ? (
          <span
            key={page}
            aria-current="page"
            className={`${BASE} border-zinc-100 bg-zinc-100 text-zinc-900 tabular`}
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={hrefFor(page)}
            className={`${BASE} border-border bg-surface text-zinc-300 tabular hover:bg-surface-hover`}
          >
            {page}
          </Link>
        )
      )}

      {current < totalPages ? (
        <Link
          href={hrefFor(current + 1)}
          aria-label="다음 페이지"
          className={`${BASE} border-border bg-surface text-zinc-300 hover:bg-surface-hover`}
        >
          <CaretRight size={14} />
        </Link>
      ) : (
        <span aria-hidden className={`${BASE} border-transparent text-zinc-700`}>
          <CaretRight size={14} />
        </span>
      )}
    </nav>
  );
}
