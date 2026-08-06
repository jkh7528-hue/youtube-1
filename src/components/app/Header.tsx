"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heartbeat, Users, GearSix, SignOut } from "@phosphor-icons/react";
import { logout } from "@/lib/actions";

const NAV = [
  { href: "/", label: "탐색" },
  { href: "/channels", label: "관심채널" },
  { href: "/settings", label: "설정" },
];

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-14 max-w-8xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-zinc-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cardiac/15 text-cardiac">
            <Heartbeat size={18} weight="fill" />
          </span>
          <span className="hidden sm:inline">심정지 발굴기</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-medium">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  active ? "bg-surface text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
                }`}
              >
                {item.href === "/channels" && <Users size={15} weight={active ? "fill" : "regular"} />}
                {item.href === "/settings" && <GearSix size={15} weight={active ? "fill" : "regular"} />}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
          <form action={logout}>
            <button
              type="submit"
              title="로그아웃"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-surface hover:text-zinc-200"
            >
              <SignOut size={16} />
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
