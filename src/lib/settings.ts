import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { AppSettingsValue } from "@/lib/types";

export const DEFAULT_SETTINGS: AppSettingsValue = {
  // 심정지 기준: 누적 조회수 100만 이상
  cardiacMinViews: 1_000_000,
  // 심정지 기준: 최근 VPH(시간당 조회수) 100 이하
  cardiacMaxVph: 100,
  // "최근"의 정의 — 최신 스냅샷과 이 시간(시간 단위) 전 스냅샷을 비교해 VPH 계산
  vphWindowHours: 24,
  // 급상승 후보로 볼 업로드 최근성(일)
  trendingLookbackDays: 14,
  excludeShortsByDefault: false,
};

const SETTINGS_KEY = "thresholds";

export async function getSettings(): Promise<AppSettingsValue> {
  const { data, error } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    console.error("[settings] failed to load, using defaults:", error.message);
    return DEFAULT_SETTINGS;
  }
  if (!data) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(data.value as Partial<AppSettingsValue>) };
}

export async function updateSettings(
  partial: Partial<AppSettingsValue>
): Promise<AppSettingsValue> {
  const current = await getSettings();
  const next = { ...current, ...partial };
  const { error } = await supabaseAdmin
    .from("app_settings")
    .upsert({ key: SETTINGS_KEY, value: next, updated_at: new Date().toISOString() });
  if (error) throw new Error(`설정 저장 실패: ${error.message}`);
  return next;
}
