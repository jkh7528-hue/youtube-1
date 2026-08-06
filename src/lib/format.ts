/** Korean-style compact number formatting: 12,340,000 → "1,234만" */
export function formatCompactKo(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  const abs = Math.abs(n);
  if (abs >= 1e8) {
    const v = n / 1e8;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}억`;
  }
  if (abs >= 1e4) {
    const v = n / 1e4;
    return `${Number.isInteger(v) ? v : v.toFixed(1)}만`;
  }
  return n.toLocaleString("ko-KR");
}

export function formatVph(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "-";
  return `${Math.round(n).toLocaleString("ko-KR")}`;
}

const RTF = new Intl.RelativeTimeFormat("ko", { numeric: "auto" });

export function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);

  if (abs < 60) return RTF.format(diffSec, "second");
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return RTF.format(diffMin, "minute");
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return RTF.format(diffHour, "hour");
  const diffDay = Math.round(diffHour / 24);
  if (Math.abs(diffDay) < 30) return RTF.format(diffDay, "day");
  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return RTF.format(diffMonth, "month");
  const diffYear = Math.round(diffMonth / 12);
  return RTF.format(diffYear, "year");
}
