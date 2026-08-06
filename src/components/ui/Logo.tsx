import Link from "next/link";

export default function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="KES 홈으로 이동">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="40" height="40" rx="6" fill="#0B192C" />
        <path
          d="M12 10v20M12 20l9-10M12 20l9 10"
          stroke="#F1F5F9"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="28.5" cy="10.5" r="2.5" fill="#0284C7" />
        <circle cx="28.5" cy="20" r="2.5" fill="#38BDF8" />
        <circle cx="28.5" cy="29.5" r="2.5" fill="#0284C7" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`text-lg font-extrabold tracking-tight ${isLight ? "text-white" : "text-navy-900"}`}
        >
          KES<span className="text-electric-500">.</span>
        </span>
        <span
          className={`mt-0.5 text-[10px] font-medium tracking-wide whitespace-nowrap ${isLight ? "text-grey-300" : "text-slate-500"}`}
        >
          한국엔지니어링서비스
        </span>
      </span>
    </Link>
  );
}
