import { SealCheck, Handshake, ShieldCheck, Clock } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { coreStrengths } from "@/data/company";

const icons = {
  "seal-check": SealCheck,
  "hand-shake": Handshake,
  "shield-check": ShieldCheck,
  clock: Clock,
} as const;

export default function CoreStrengths() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why KES"
          title="신뢰할 수 있는 자동제어 파트너"
          desc="설계부터 시운전, 사후관리까지 — 품질과 안전을 최우선으로 하는 엔지니어링 역량으로 고객의 프로젝트를 완성합니다."
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {coreStrengths.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-md border border-navy-900/10 bg-grey-50 p-7 transition-all hover:-translate-y-1 hover:border-electric-600/30 hover:shadow-lg hover:shadow-navy-900/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-navy-900 text-electric-400 transition-colors group-hover:bg-electric-600 group-hover:text-white">
                  <Icon size={24} weight="bold" />
                </div>
                <h3 className="mt-5 text-base font-bold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
