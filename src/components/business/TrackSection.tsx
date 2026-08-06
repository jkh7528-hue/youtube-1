import { CheckCircle, Factory } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import Badge from "../ui/Badge";
import SchematicArt from "../ui/SchematicArt";
import { businessTracks } from "@/data/company";

export default function TrackSection({
  track,
  reverse = false,
}: {
  track: (typeof businessTracks)[number];
  reverse?: boolean;
}) {
  return (
    <section id={track.id} className="scroll-mt-28 border-b border-navy-900/10 py-20 sm:py-24">
      <Container>
        <div
          className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
            reverse ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="relative overflow-hidden rounded-lg bg-navy-900 p-10">
            <div className="bp-grid absolute inset-0 opacity-50" aria-hidden />
            <SchematicArt className="relative mx-auto w-full max-w-xs" />
          </div>

          <div>
            <Badge tone="electric">{track.tag}</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
              {track.title}
            </h2>
            <p className="mt-1.5 text-sm font-semibold text-electric-600">{track.subtitle}</p>
            <p className="mt-5 text-base leading-relaxed text-slate-600">{track.desc}</p>

            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {track.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-navy-800">
                  <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-md border border-navy-900/10 bg-grey-50 p-5">
              <p className="flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
                <Factory size={16} className="text-electric-600" />
                주요 적용 산업
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {track.industries.map((ind) => (
                  <span
                    key={ind}
                    className="rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-800 ring-1 ring-navy-900/10"
                  >
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
