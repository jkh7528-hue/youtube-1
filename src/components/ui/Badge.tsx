import { ReactNode } from "react";

export default function Badge({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "electric";
  className?: string;
}) {
  const tones: Record<string, string> = {
    light: "bg-navy-900/5 text-navy-800 ring-1 ring-navy-900/10",
    dark: "bg-white/10 text-white ring-1 ring-white/20",
    electric: "bg-electric-50 text-electric-700 ring-1 ring-electric-600/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
