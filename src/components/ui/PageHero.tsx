import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/ssr";
import Container from "./Container";

export default function PageHero({
  eyebrow,
  title,
  desc,
  crumb,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  crumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 pt-32 pb-16 sm:pt-36 sm:pb-20">
      <div className="bp-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute -top-24 right-[-10%] h-[420px] w-[420px] rounded-full bg-electric-600/20 blur-[120px]"
        aria-hidden
      />
      <Container className="relative">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs font-medium text-grey-300/80">
          <Link href="/" className="hover:text-white transition-colors">
            홈
          </Link>
          <CaretRight size={12} weight="bold" />
          <span className="text-white">{crumb}</span>
        </nav>
        <span className="mb-3 block text-xs font-bold tracking-[0.2em] text-electric-400 uppercase">
          {eyebrow}
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-grey-200">{desc}</p>
      </Container>
    </section>
  );
}
