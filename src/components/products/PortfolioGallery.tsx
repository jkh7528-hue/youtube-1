"use client";

import { useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { portfolioItems, productCategories } from "@/data/company";

const filters = [{ id: "all", title: "전체" }, ...productCategories.map((p) => ({ id: p.id, title: p.title }))];

const patterns: Record<string, string> = {
  semiconductor: "from-navy-800 via-navy-700 to-electric-700",
  battery: "from-navy-900 via-electric-800 to-electric-600",
  water: "from-navy-800 via-navy-600 to-navy-900",
  special: "from-electric-700 via-navy-800 to-navy-900",
};

export default function PortfolioGallery() {
  const [active, setActive] = useState("all");
  const items = active === "all" ? portfolioItems : portfolioItems.filter((i) => i.category === active);

  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Portfolio" title="포트폴리오 갤러리" desc="산업별 대표 프로젝트 실적입니다." />

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === f.id
                  ? "bg-navy-900 text-white"
                  : "bg-grey-100 text-slate-600 hover:bg-grey-200"
              }`}
            >
              {f.title}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-lg border border-navy-900/10 bg-grey-50 transition-shadow hover:shadow-xl hover:shadow-navy-900/10"
            >
              <div
                className={`relative aspect-4/3 overflow-hidden bg-gradient-to-br p-4 ${patterns[item.category]}`}
              >
                <div className="bp-grid-fine absolute inset-0" aria-hidden />
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="absolute top-4 right-4 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                <span className="absolute bottom-4 left-4 tabular text-xs font-semibold text-white/70">
                  {item.year}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold text-navy-900">{item.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500">{item.client}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
