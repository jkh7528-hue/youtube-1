"use client";

import { useActionState } from "react";
import { saveSettings } from "@/lib/actions";
import type { AppSettingsValue } from "@/lib/types";

type State = { error?: string };

async function action(_prev: State, formData: FormData): Promise<State> {
  return saveSettings(formData);
}

function Field({
  label,
  hint,
  name,
  defaultValue,
}: {
  label: string;
  hint: string;
  name: string;
  defaultValue: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        min={0}
        step="any"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 outline-none focus:border-cardiac tabular"
      />
      <span className="text-xs text-zinc-600">{hint}</span>
    </label>
  );
}

export default function SettingsForm({ settings }: { settings: AppSettingsValue }) {
  const [state, formAction, pending] = useActionState<State, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label="심정지 기준: 최소 누적 조회수"
          hint="이 값 이상 조회수를 찍은 영상만 심정지 후보가 돼요."
          name="cardiacMinViews"
          defaultValue={settings.cardiacMinViews}
        />
        <Field
          label="심정지 기준: 최대 최근 VPH"
          hint="최근 시간당 조회수가 이 값 이하면 '심정지'로 판정해요."
          name="cardiacMaxVph"
          defaultValue={settings.cardiacMaxVph}
        />
        <Field
          label="VPH 계산 기준 시간(시)"
          hint="최신 스냅샷과 이 시간 전 스냅샷을 비교해 시간당 조회수를 계산해요."
          name="vphWindowHours"
          defaultValue={settings.vphWindowHours}
        />
        <Field
          label="급상승 후보 기간(일)"
          hint="이 기간 안에 올라온 영상만 급상승 랭킹에 포함해요."
          name="trendingLookbackDays"
          defaultValue={settings.trendingLookbackDays}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="excludeShortsByDefault"
          defaultChecked={settings.excludeShortsByDefault}
          className="accent-cardiac"
        />
        기본적으로 쇼츠(3분 이하) 제외하기
      </label>

      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-cardiac px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-rose-400 disabled:opacity-50"
      >
        {pending ? "저장 중..." : "설정 저장"}
      </button>
    </form>
  );
}
