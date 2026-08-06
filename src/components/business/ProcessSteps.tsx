import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { processSteps } from "@/data/company";

export default function ProcessSteps() {
  return (
    <section id="process" className="scroll-mt-28 bg-navy-900 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Workflow"
          title="5단계 공정 프로세스"
          desc="상담부터 시운전까지, 표준화된 5단계 프로세스로 일관된 품질을 제공합니다."
          tone="light"
        />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s, i) => (
            <div key={s.step} className="relative">
              <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/5 p-6">
                <span className="tabular text-4xl font-black text-electric-500/60">{s.step}</span>
                <h3 className="mt-4 text-base font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-300">{s.desc}</p>
              </div>
              {i < processSteps.length - 1 ? (
                <span
                  className="absolute top-1/2 -right-3 hidden h-px w-6 -translate-y-1/2 bg-electric-500/40 lg:block"
                  aria-hidden
                />
              ) : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
