import { CheckCircle } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { productCategories } from "@/data/company";

const patterns = [
  "from-navy-800 via-navy-700 to-electric-700",
  "from-navy-900 via-electric-800 to-electric-600",
  "from-navy-800 via-navy-600 to-navy-900",
  "from-electric-700 via-navy-800 to-navy-900",
];

export default function ProductCategories() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Products"
          title="제품군 상세"
          desc="산업별 특화 사양으로 설계된 4개 제품군을 소개합니다. 모든 제품은 고객 사양에 맞춘 맞춤 설계가 가능합니다."
        />

        <div className="mt-14 flex flex-col gap-16">
          {productCategories.map((p, i) => (
            <div
              key={p.id}
              id={p.id}
              className={`scroll-mt-28 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div
                className={`relative aspect-4/3 overflow-hidden rounded-lg bg-gradient-to-br p-8 ${patterns[i % patterns.length]}`}
              >
                <div className="bp-grid-fine absolute inset-0" aria-hidden />
                <span className="relative text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
                  {p.titleEn}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-navy-900">{p.title}</h3>
                <p className="mt-1 text-sm font-semibold text-electric-600">{p.titleEn}</p>
                <p className="mt-4 text-base leading-relaxed text-slate-600">{p.desc}</p>
                <ul className="mt-5 flex flex-col gap-2.5">
                  {p.tags.map((t) => (
                    <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-navy-800">
                      <CheckCircle size={17} weight="fill" className="text-electric-600" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
