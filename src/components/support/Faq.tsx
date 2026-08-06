import { Plus } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { faqs } from "@/data/company";

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 bg-grey-100 py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" desc="견적, 납기, 사후관리 관련 주요 질문을 모았습니다." />

        <div className="mt-10 flex flex-col divide-y divide-navy-900/10 rounded-lg border border-navy-900/10 bg-white">
          {faqs.map((item, i) => (
            <details key={item.q} className="group px-6 py-5 open:pb-6" {...(i === 0 ? { open: true } : {})}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-navy-900 marker:content-none">
                <span className="flex items-start gap-3">
                  <span className="tabular text-electric-600">Q{i + 1}.</span>
                  {item.q}
                </span>
                <Plus
                  size={16}
                  weight="bold"
                  className="mt-0.5 shrink-0 text-electric-600 transition-transform duration-200 group-open:rotate-45"
                />
              </summary>
              <p className="mt-3 pl-8 text-sm leading-relaxed text-slate-600">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
