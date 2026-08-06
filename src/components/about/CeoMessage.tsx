import { Quotes } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { company } from "@/data/company";

export default function CeoMessage() {
  return (
    <section id="ceo" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Greeting" title="CEO 인사말" />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative mx-auto flex aspect-3/4 w-full max-w-sm items-center justify-center overflow-hidden rounded-lg bg-navy-900">
            <div className="bp-grid absolute inset-0 opacity-40" aria-hidden />
            <span className="relative text-7xl font-black text-white/15 select-none">KES</span>
            <div className="absolute inset-x-0 bottom-0 bg-navy-900/80 p-5 backdrop-blur-sm">
              <p className="text-lg font-bold text-white">{company.ceo}</p>
              <p className="text-xs text-grey-300">대표이사 · {company.nameKoFull}</p>
            </div>
          </div>

          <div className="relative">
            <Quotes size={40} weight="fill" className="text-electric-600/20" />
            <div className="mt-2 flex flex-col gap-5 text-base leading-loose text-slate-700">
              <p>
                안녕하십니까, {company.nameKoFull} 대표이사 {company.ceo}입니다. 저희 KES는 2009년
                설립 이래 &lsquo;정밀함이 곧 신뢰&rsquo;라는 원칙 아래, 산업 현장의 자동제어 시스템과
                발전설비 보조장비를 설계·제작해 왔습니다.
              </p>
              <p>
                반도체, 이차전지, 수처리 등 첨단 산업 현장의 자동화 요구부터 원자력발전소와 같이
                극도로 엄격한 품질 기준이 요구되는 특수 플랜트 제어반까지 — 저희는 ISO 9001
                품질경영시스템과 KEPIC 등록 기준을 기반으로 한 치의 오차 없는 엔지니어링을
                지향합니다.
              </p>
              <p>
                앞으로도 Rockwell Automation 공인 System Integrator로서의 전문성을 바탕으로,
                고객의 설비가 멈추지 않도록 하는 &lsquo;믿을 수 있는 자동제어 파트너&rsquo;가
                되겠습니다. 임직원 모두의 노력과 여러분의 신뢰에 진심으로 감사드립니다.
              </p>
              <div className="mt-2 flex items-center gap-4 border-t border-navy-900/10 pt-6">
                <div>
                  <p className="text-xl font-bold text-navy-900">{company.ceo}</p>
                  <p className="text-sm text-slate-500">대표이사 CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
