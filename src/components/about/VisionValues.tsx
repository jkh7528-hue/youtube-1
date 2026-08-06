import { Target, Compass, Users, Lightning } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";

const values = [
  {
    icon: Target,
    title: "정밀 (Precision)",
    desc: "허용오차 없는 설계와 제작으로 산업 현장의 안정적인 가동을 보장합니다.",
  },
  {
    icon: Compass,
    title: "신뢰 (Reliability)",
    desc: "ISO 9001 품질경영시스템을 기반으로 일관된 품질을 약속합니다.",
  },
  {
    icon: Users,
    title: "동반성장 (Partnership)",
    desc: "고객, 협력사와 함께 성장하는 지속가능한 파트너십을 지향합니다.",
  },
  {
    icon: Lightning,
    title: "혁신 (Innovation)",
    desc: "스마트팩토리 시대에 맞춘 자동제어 기술 고도화를 끊임없이 추구합니다.",
  },
];

export default function VisionValues() {
  return (
    <section id="vision" className="scroll-mt-28 bg-grey-100 py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Vision" title="기업 비전" align="center" className="mx-auto" />

        <div className="mx-auto mt-10 max-w-3xl rounded-lg bg-navy-900 px-8 py-10 text-center sm:px-14 sm:py-14">
          <p className="text-xs font-bold tracking-[0.2em] text-electric-400 uppercase">Mission</p>
          <p className="mt-4 text-xl leading-relaxed font-bold text-white sm:text-2xl">
            정밀한 자동제어 기술로 대한민국 산업 인프라의
            <br className="hidden sm:block" />
            안전과 효율을 책임진다.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title} className="rounded-md border border-navy-900/10 bg-white p-6">
              <v.icon size={26} weight="bold" className="text-electric-600" />
              <h3 className="mt-4 text-base font-bold text-navy-900">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{v.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
