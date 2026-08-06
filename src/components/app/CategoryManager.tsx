"use client";

import { useActionState, useTransition } from "react";
import { Trash } from "@phosphor-icons/react";
import { createCategory, deleteCategory } from "@/lib/actions";
import type { CategoryRow } from "@/lib/types";

type State = { error?: string };

async function action(_prev: State, formData: FormData): Promise<State> {
  return createCategory(formData);
}

export default function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [state, formAction, pending] = useActionState<State, FormData>(action, {});
  const [, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {categories.length === 0 && (
          <p className="text-sm text-zinc-500">아직 카테고리가 없어요.</p>
        )}
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-3.5 py-2.5"
          >
            <div>
              <p className="text-sm font-medium text-zinc-200">{c.name}</p>
              {c.description && <p className="text-xs text-zinc-500">{c.description}</p>}
            </div>
            <button
              type="button"
              title="삭제"
              onClick={() => {
                if (confirm(`"${c.name}" 카테고리를 삭제할까요? (채널 연결만 해제되고 채널 자체는 남아요)`)) {
                  startTransition(() => deleteCategory(c.id));
                }
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-rose-400"
            >
              <Trash size={14} />
            </button>
          </div>
        ))}
      </div>

      <form action={formAction} className="flex flex-col gap-2 rounded-lg border border-dashed border-border p-3.5">
        <div className="flex gap-2">
          <input
            type="text"
            name="name"
            required
            placeholder="카테고리 이름 (예: 예능/코미디)"
            className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-cardiac"
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-zinc-100 px-3.5 py-2 text-sm font-semibold text-zinc-900 hover:bg-white disabled:opacity-50"
          >
            추가
          </button>
        </div>
        <input
          type="text"
          name="description"
          placeholder="설명 (선택)"
          className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-cardiac"
        />
        {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
      </form>
    </div>
  );
}
