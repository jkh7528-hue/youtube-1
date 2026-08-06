"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  List,
  X,
  Phone,
  EnvelopeSimple,
  CaretDown,
  ArrowRight,
} from "@phosphor-icons/react";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import { nav, navSub, company } from "@/data/company";

export default function Header() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close mobile drawer on route change (adjust state during render, not in an effect)
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Lock body scroll while mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar */}
      <div className="hidden bg-navy-900 text-grey-300 lg:block">
        <Container className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone size={13} weight="fill" />
              {company.tel}
            </span>
            <span className="flex items-center gap-1.5">
              <EnvelopeSimple size={13} weight="fill" />
              {company.email}
            </span>
          </div>
          <span className="text-grey-300/70">{company.nameEn}</span>
        </Container>
      </div>

      {/* Main GNB */}
      <div className="border-b border-navy-900/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <Container className="flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="주 메뉴">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(item.href)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-7 text-sm font-semibold transition-colors ${
                      active ? "text-electric-600" : "text-navy-900 hover:text-electric-600"
                    }`}
                    aria-expanded={openMenu === item.href}
                  >
                    {item.label}
                    <CaretDown size={13} weight="bold" className="opacity-50" />
                  </Link>
                  <span
                    className={`absolute inset-x-4 bottom-0 h-0.5 bg-electric-600 transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                  />

                  {/* Mega dropdown */}
                  <div
                    className={`absolute top-full left-1/2 w-72 -translate-x-1/2 pt-0 transition-all duration-150 ${
                      openMenu === item.href
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-md border border-navy-900/10 bg-white shadow-xl shadow-navy-900/10">
                      <ul className="p-2">
                        {navSub[item.href]?.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              className="group flex flex-col gap-0.5 rounded-sm px-4 py-3 transition-colors hover:bg-grey-100"
                            >
                              <span className="flex items-center justify-between text-sm font-semibold text-navy-900 group-hover:text-electric-600">
                                {sub.label}
                                <ArrowRight
                                  size={14}
                                  className="opacity-0 -translate-x-1 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                                />
                              </span>
                              <span className="text-xs text-slate-500">{sub.desc}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:block">
            <Button href="/support#rfq" variant="primary">
              RFQ 견적문의
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-navy-900 lg:hidden"
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={26} /> : <List size={26} />}
          </button>
        </Container>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 top-[80px] z-40 bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto px-6 py-6">
          <nav className="flex flex-col divide-y divide-navy-900/10">
            {nav.map((item) => (
              <div key={item.href} className="py-3">
                <Link
                  href={item.href}
                  className="block text-lg font-bold text-navy-900"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                <ul className="mt-2 flex flex-col gap-2">
                  {navSub[item.href]?.map((sub) => (
                    <li key={sub.href}>
                      <Link
                        href={sub.href}
                        className="block py-1 text-sm text-slate-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-3 border-t border-navy-900/10 pt-6 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <Phone size={16} className="text-electric-600" weight="fill" />
              {company.tel}
            </span>
            <span className="flex items-center gap-2">
              <EnvelopeSimple size={16} className="text-electric-600" weight="fill" />
              {company.email}
            </span>
          </div>
          <Button href="/support#rfq" variant="primary" className="mt-6 w-full">
            RFQ 견적문의
          </Button>
        </div>
      </div>
    </header>
  );
}
