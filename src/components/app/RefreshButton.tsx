"use client";

import { useActionState } from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { manualRefreshAll } from "@/lib/actions";

type State = { error?: string; summary?: string };

async function action(): Promise<State> {
  return manualRefreshAll();
}

export default function RefreshButton() {
  const [state, formAction, pending] = useActionState<State, FormData>(action, {});

  return (
    <div className="flex flex-col items-end gap-1.5">
      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors hover:bg-surface-hover disabled:opacity-50"
        >
          <ArrowsClockwise size={14} className={pending ? "animate-spin" : ""} />
          {pending ? "수집 중..." : "지금 새로고침"}
        </button>
      </form>
      {state.error && <p className="max-w-64 text-right text-xs text-rose-400">{state.error}</p>}
      {state.summary && <p className="max-w-72 text-right text-xs text-zinc-500">{state.summary}</p>}
    </div>
  );
}
