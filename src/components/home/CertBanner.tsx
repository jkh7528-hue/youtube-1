import { SealCheck } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import { certifications, partners } from "@/data/company";

export default function CertBanner() {
  const items = [...certifications.map((c) => c.title), ...partners];
  const loop = [...items, ...items];

  return (
    <section className="border-y border-navy-900/10 bg-grey-100 py-10">
      <Container>
        <p className="text-center text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">
          인증 및 파트너십 · Certifications &amp; Partners
        </p>
      </Container>
      <div className="mt-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-3">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-2 rounded-full border border-navy-900/10 bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-navy-800 shadow-sm"
            >
              <SealCheck size={16} className="text-electric-600" weight="fill" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
