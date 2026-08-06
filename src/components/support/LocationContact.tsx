import { MapPin, Phone, Printer, EnvelopeSimple, Clock, ArrowSquareOut } from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { company } from "@/data/company";

export default function LocationContact() {
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapQuery)}`;

  return (
    <section id="location" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="Location" title="오시는 길 및 연락처" />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-navy-900/10 bg-grey-50 p-6">
              <dl className="flex flex-col gap-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin size={19} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                  <div>
                    <dt className="font-bold text-navy-900">본사 주소</dt>
                    <dd className="mt-0.5 text-slate-600">{company.addressKo}</dd>
                    <dd className="text-xs text-slate-400">{company.addressEn}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <Phone size={19} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                  <div>
                    <dt className="font-bold text-navy-900">대표전화</dt>
                    <dd className="tabular text-slate-600">
                      {company.tel} / {company.telSub}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <Printer size={19} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                  <div>
                    <dt className="font-bold text-navy-900">팩스</dt>
                    <dd className="tabular text-slate-600">{company.fax}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <EnvelopeSimple size={19} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                  <div>
                    <dt className="font-bold text-navy-900">이메일</dt>
                    <dd className="text-slate-600">{company.email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <Clock size={19} weight="fill" className="mt-0.5 shrink-0 text-electric-600" />
                  <div>
                    <dt className="font-bold text-navy-900">업무시간</dt>
                    <dd className="text-slate-600">평일 09:00 – 18:00 (주말/공휴일 휴무)</dd>
                    <dd className="text-xs text-slate-400">RFQ 접수는 24시간 가능합니다.</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-lg border border-navy-900/10 bg-navy-900 p-6 lg:min-h-full"
          >
            <div className="bp-grid absolute inset-0 opacity-50" aria-hidden />
            <svg
              className="absolute inset-0 h-full w-full opacity-70"
              viewBox="0 0 400 320"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path d="M0 90 H400" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="2" />
              <path d="M0 210 H400" stroke="#38BDF8" strokeOpacity="0.2" strokeWidth="1.5" />
              <path d="M120 0 V320" stroke="#38BDF8" strokeOpacity="0.2" strokeWidth="1.5" />
              <path d="M290 0 V320" stroke="#38BDF8" strokeOpacity="0.25" strokeWidth="2" />
            </svg>
            <span className="relative flex flex-col items-center gap-2 self-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-electric-600 shadow-lg shadow-electric-900/30">
                <MapPin size={28} weight="fill" className="text-white" />
              </span>
              <span className="mt-1 text-sm font-bold text-white">{company.nameKoFull}</span>
              <span className="text-xs text-grey-300">{company.addressKo}</span>
            </span>
            <span className="relative mt-6 inline-flex items-center justify-center gap-1.5 self-center rounded-sm bg-white/10 px-4 py-2.5 text-xs font-semibold text-white ring-1 ring-white/20 backdrop-blur-sm transition-colors group-hover:bg-electric-600 group-hover:ring-electric-600">
              Google 지도에서 길찾기
              <ArrowSquareOut size={14} weight="bold" />
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
