import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Badge from "../ui/Badge";
import { businessTracks } from "@/data/company";

export default function BusinessOverview() {
  return (
    <section className="bg-grey-50 py-20 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Business"
            title="사업분야"
            desc="산업 자동화부터 원전·특수 플랜트까지, 두 개의 전문 트랙으로 사업 영역을 운영합니다."
          />
          <Link
            href="/business"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-electric-600 hover:text-electric-700"
          >
            사업분야 전체보기 <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {businessTracks.map((track) => (
            <Link
              key={track.id}
              href={`/business#${track.id}`}
              className="group flex flex-col rounded-lg border border-navy-900/10 bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/5"
            >
              <Badge tone="electric">{track.tag}</Badge>
              <h3 className="mt-4 text-2xl font-bold text-navy-900">{track.title}</h3>
              <p className="mt-1 text-sm font-medium text-electric-600">{track.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{track.desc}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {track.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-navy-800">
                    <CheckCircle size={17} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                    {f}
                  </li>
                ))}
              </ul>
              <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 group-hover:text-electric-600">
                자세히 보기
                <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
