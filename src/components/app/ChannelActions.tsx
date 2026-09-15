"use client";

import { useOptimistic, useState, useTransition } from "react";
import { ArrowsClockwise, Heart, Trash } from "@phosphor-icons/react";
import { removeChannel, rescanChannel, toggleChannelFavorite } from "@/lib/actions";

export default function ChannelActions({
  channelId,
  isFavorite,
  compact = false,
}: {
  channelId: string;
  isFavorite: boolean;
  compact?: boolean;
}) {
  // One transition per button. Sharing a single `pending` meant clicking ♡ also
  // greyed out 스캔/삭제 until the server round trip finished.
  const [favPending, startFavorite] = useTransition();
  const [scanPending, startScan] = useTransition();
  const [deletePending, startDelete] = useTransition();
  const [scanMsg, setScanMsg] = useState<string | null>(null);

  // Paints the new heart state on click; React reverts it if the action throws,
  // and the revalidated server render replaces it either way.
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(isFavorite);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        title={optimisticFavorite ? "관심채널 해제" : "관심채널로 등록"}
        aria-pressed={optimisticFavorite}
        disabled={favPending}
        onClick={() =>
          startFavorite(async () => {
            setOptimisticFavorite(!isFavorite);
            await toggleChannelFavorite(channelId, !isFavorite);
          })
        }
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
          optimisticFavorite
            ? "border-cardiac/40 bg-cardiac/10 text-cardiac"
            : "border-zinc-700 text-zinc-500 hover:text-zinc-200"
        }`}
      >
        <Heart size={14} weight={optimisticFavorite ? "fill" : "regular"} />
      </button>

      <button
        type="button"
        title="다시 스캔"
        disabled={scanPending}
        onClick={() =>
          startScan(async () => {
            setScanMsg(null);
            const res = await rescanChannel(channelId);
            setScanMsg(res.error ?? "스캔 완료");
          })
        }
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-500 transition-colors hover:text-zinc-200 disabled:opacity-50"
      >
        <ArrowsClockwise size={14} className={scanPending ? "animate-spin" : ""} />
      </button>

      {!compact && (
        <button
          type="button"
          title="채널 삭제"
          disabled={deletePending}
          onClick={() => {
            if (confirm("이 채널과 수집된 영상 데이터를 모두 삭제할까요?")) {
              startDelete(() => removeChannel(channelId));
            }
          }}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-500 transition-colors hover:border-rose-500/40 hover:text-rose-400 disabled:opacity-50"
        >
          <Trash size={14} />
        </button>
      )}

      {scanMsg && <span className="text-[11px] text-zinc-500">{scanMsg}</span>}
    </div>
  );
}
