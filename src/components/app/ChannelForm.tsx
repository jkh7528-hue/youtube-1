"use client";

import { useActionState } from "react";
import { addChannel } from "@/lib/actions";
import type { CategoryRow } from "@/lib/types";

type State = { error?: string };

async function action(_prev: State, formData: FormData): Promise<State> {
  return addChannel(formData);
}

export default function ChannelForm({ categories }: { categories: CategoryRow[] }) {
  const [state, formAction, pending] = useActionState<State, FormData>(action, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-300">
          채널 URL / @핸들 / 채널 ID
        </label>
        <input
          type="text"
          name="input"
          required
          placeholder="https://www.youtube.com/@채널핸들"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-cardiac"
        />
      </div>

      {categories.length > 0 && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-zinc-300">카테고리 (선택)</span>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <label
                key={c.id}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300 has-checked:border-cardiac has-checked:bg-cardiac/10 has-checked:text-cardiac"
              >
                <input type="checkbox" name="categoryIds" value={c.id} className="hidden" />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" name="isFavorite" defaultChecked className="accent-cardiac" />
        관심채널로 등록 (전체 업로드 영상에서 심정지 자동 탐지)
      </label>

      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-cardiac px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-rose-400 disabled:opacity-50"
      >
        {pending ? "추가 중... (첫 스캔에 시간이 걸릴 수 있어요)" : "채널 추가"}
      </button>
    </form>
  );
}
