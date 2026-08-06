import Link from "next/link";
import { company } from "@/data/company";

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";
  return (
    <Link
      href="/"
      className="group flex flex-col leading-none"
      aria-label={`${company.nameShort} 홈으로 이동`}
    >
      <span
        className={`text-[27px] font-black tracking-tighter ${isLight ? "text-white" : "text-navy-900"}`}
      >
        KES<span className="text-electric-500">co.</span>
      </span>
      <span
        className={`mt-1 text-[11px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase ${isLight ? "text-grey-300" : "text-slate-500"}`}
      >
        {company.nameKo}
      </span>
    </Link>
  );
}
