import { ArrowRight, PlayCircle } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import SchematicArt from "../ui/SchematicArt";
import { company, stats } from "@/data/company";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="bp-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute top-1/2 right-[-8%] h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-electric-600/15 blur-[140px]"
        aria-hidden
      />

      <Container className="relative grid grid-cols-1 items-center gap-12 pt-20 pb-20 sm:pt-24 sm:pb-28 lg:grid-cols-[1.1fr_0.9fr] lg:pt-16">
        <div>
          <Badge tone="dark">국내외 원전 다수 납품 · Since 2009</Badge>
          <h1 className="mt-6 text-4xl leading-[1.15] font-bold tracking-tight text-white sm:text-5xl lg:text-[3.2rem]">
            원전이 증명한 신뢰로
            <br />
            완성하는 <span className="text-electric-400">산업 자동화</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-grey-200 sm:text-lg">
            {company.nameKo}({company.nameShort})는 국내외 원자력발전소에 계측제어설비를 다수
            납품해 온 실적을 기반으로, 반도체·이차전지 등 산업용 자동화 전 영역으로 전문성을
            넓혀 온 전기·자동제어 전문기업입니다. ISO 9001 품질보증 체계 아래 설계·제작·검사·시운전을
            일괄 수행합니다.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href="/business" variant="primary" icon={<ArrowRight size={18} weight="bold" />}>
              사업분야 살펴보기
            </Button>
            <Button href="/support#rfq" variant="outline-light" icon={<PlayCircle size={18} weight="bold" />}>
              RFQ 견적 문의하기
            </Button>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="text-xs font-medium tracking-wide text-grey-300/70">{s.label}</dt>
                <dd className="tabular mt-1 text-xl font-bold text-white sm:text-2xl">
                  {s.value}
                  <span className="ml-1 text-sm font-medium text-electric-400">{s.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative hidden lg:block">
          <SchematicArt className="w-full max-w-md" />
        </div>
      </Container>
    </section>
  );
}
