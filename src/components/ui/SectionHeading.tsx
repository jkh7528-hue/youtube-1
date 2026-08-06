import { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  desc,
  align = "left",
  tone = "dark",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  desc?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const alignCls = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";
  const titleColor = tone === "light" ? "text-white" : "text-navy-900";
  const descColor = tone === "light" ? "text-grey-200" : "text-slate-600";

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignCls} ${className}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-electric-600 uppercase">
          <span className="h-px w-6 bg-electric-600" aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2 className={`text-3xl font-bold tracking-tight sm:text-4xl ${titleColor}`}>{title}</h2>
      {desc ? <p className={`text-base leading-relaxed ${descColor}`}>{desc}</p> : null}
    </div>
  );
}
