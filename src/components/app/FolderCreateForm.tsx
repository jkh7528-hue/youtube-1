"use client";

import { useActionState } from "react";
import { FolderPlus } from "@phosphor-icons/react";
import { createCategory } from "@/lib/actions";

type State = { error?: string };

async function action(_prev: State, formData: FormData): Promise<State> {
  return createCategory(formData);
}

/**
 * Compact "new folder" field for the /channels folder grid. Full management —
 * descriptions, deleting — stays in 설정 (see CategoryManager), but you have to
 * be able to make a folder from the place folders live.
 */
export default function FolderCreateForm() {
  const [state, formAction, pending] = useActionState<State, FormData>(action, {});

  return (
    <div className="flex flex-col gap-1.5">
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          name="name"
          required
          placeholder="새 폴더 이름"
          className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-cardiac"
        />
        <button
          type="submit"
          disabled={pending}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-surface-hover disabled:opacity-50"
        >
          <FolderPlus size={15} />
          {pending ? "만드는 중..." : "폴더 만들기"}
        </button>
      </form>
      {state.error && <p className="text-xs text-rose-400">{state.error}</p>}
    </div>
  );
}
