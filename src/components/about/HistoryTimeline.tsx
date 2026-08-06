import { Circle } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { history } from "@/data/company";

export default function HistoryTimeline() {
  const sorted = [...history].reverse();
  return (
    <section id="history" className="scroll-mt-28 bg-grey-100 py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="History" title="연혁" desc="2009년 설립 이후, 신뢰를 쌓아온 KES의 발자취입니다." />

        <div className="relative mt-14 pl-8 sm:pl-10">
          <div className="absolute top-1 bottom-1 left-[7px] w-px bg-navy-900/15 sm:left-[9px]" aria-hidden />
          <ol className="flex flex-col gap-10">
            {sorted.map((entry) => (
              <li key={entry.year} className="relative">
                <span className="absolute top-1.5 -left-8 flex h-4 w-4 items-center justify-center sm:-left-10">
                  <Circle size={10} weight="fill" className="text-electric-600" />
                </span>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                  <p className="tabular w-20 shrink-0 text-2xl font-black text-navy-900">{entry.year}</p>
                  <ul className="flex flex-col gap-1.5 pt-1">
                    {entry.items.map((it) => (
                      <li key={it} className="text-sm leading-relaxed text-slate-600">
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
