"use client";

import { useLinkStatus } from "next/link";

/**
 * Inline "this click registered" dot for a <Link> pointing at a dynamic route.
 * Must be rendered as a descendant of the Link it reports on.
 *
 * Always occupies its box and only animates opacity, so showing it can't shift
 * the tab row — the layout-shift trap the Next docs call out for inline hints.
 */
export default function LinkPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={`h-1.5 w-1.5 shrink-0 rounded-full bg-current transition-opacity duration-150 ${
        pending ? "animate-pulse opacity-70" : "opacity-0"
      }`}
    />
  );
}
