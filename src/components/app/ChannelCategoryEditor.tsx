"use client";

import { useState, useTransition } from "react";
import { setChannelCategories } from "@/lib/actions";
import type { CategoryRow } from "@/lib/types";

export default function ChannelCategoryEditor({
  channelId,
  categories,
  selectedIds,
}: {
  channelId: string;
  categories: CategoryRow[];
  selectedIds: string[];
}) {
  const [selected, setSelected] = useState(new Set(selectedIds));
  const [, startTransition] = useTransition();

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    startTransition(() => setChannelCategories(channelId, Array.from(next)));
  }

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => {
        const active = selected.has(c.id);
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => toggle(c.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? "border-cardiac/40 bg-cardiac/10 text-cardiac"
                : "border-zinc-700 text-zinc-500 hover:text-zinc-200"
            }`}
          >
            {c.name}
          </button>
        );
      })}
    </div>
  );
}
