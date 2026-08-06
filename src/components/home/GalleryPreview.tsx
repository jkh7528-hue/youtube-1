import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { productCategories } from "@/data/company";

const patterns = [
  "from-navy-800 via-navy-700 to-electric-700",
  "from-navy-900 via-electric-800 to-electric-600",
  "from-navy-800 via-navy-600 to-navy-900",
  "from-electric-700 via-navy-800 to-navy-900",
];

export default function GalleryPreview() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Portfolio"
            title="제품 갤러리"
            desc="반도체 · 이차전지 · 수처리 · 방폭/내진 특수 판넬까지, 산업별 맞춤 제어반 포트폴리오입니다."
          />
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600 hover:text-electric-700"
          >
            제품소개 전체보기 <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productCategories.map((p, i) => (
            <Link
              key={p.id}
              href={`/products#${p.id}`}
              className="group overflow-hidden rounded-lg border border-navy-900/10 bg-grey-50 transition-shadow hover:shadow-xl hover:shadow-navy-900/10"
            >
              <div
                className={`relative flex aspect-4/3 items-end overflow-hidden bg-gradient-to-br p-4 ${patterns[i % patterns.length]}`}
              >
                <div className="bp-grid-fine absolute inset-0" aria-hidden />
                <ArrowUpRight
                  size={18}
                  weight="bold"
                  className="absolute top-4 right-4 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
                <span className="relative text-xs font-semibold tracking-wide text-white/70 uppercase">
                  {p.titleEn}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold text-navy-900">{p.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
