import {
  SealCheck,
  Gauge,
  Thermometer,
  Waveform,
  Cube,
  Lightning as LightningIcon,
  Drop,
  MonitorPlay,
} from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { certifications } from "@/data/company";

const inspectionInfra = [
  { icon: LightningIcon, name: "내전압 시험기 (Hipot Tester)", desc: "절연 내력 시험" },
  { icon: Gauge, name: "절연저항 측정기", desc: "메가옴 단위 절연저항 측정" },
  { icon: Waveform, name: "정밀 전력 분석기", desc: "고조파 · 역률 분석" },
  { icon: Thermometer, name: "열화상 카메라", desc: "접속부 발열 진단" },
  { icon: Drop, name: "항온항습 챔버", desc: "환경 신뢰성 시험" },
  { icon: Cube, name: "진동/내진 시험 장비", desc: "Seismic 사양 검증" },
  { icon: MonitorPlay, name: "PLC 시뮬레이션 벤치", desc: "로직 사전 검증(FAT)" },
  { icon: SealCheck, name: "3차원 정밀 계측기", desc: "가공 정밀도 검사" },
];

export default function QualitySystem() {
  return (
    <section id="quality" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Quality Assurance"
          title="품질보증 체계 및 검사 인프라"
          desc="KEPIC · ISO 9001 기준의 품질경영시스템과 자체 검사 인프라를 통해 설계부터 출하까지 전 공정의 신뢰성을 확보합니다."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {certifications.map((cert) => (
            <div key={cert.id} className="rounded-lg border border-navy-900/10 bg-grey-50 p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-navy-900 text-electric-400">
                    <SealCheck size={22} weight="fill" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">{cert.title}</h3>
                    <p className="text-xs font-medium text-electric-600">{cert.subtitle}</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">{cert.scope}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-navy-900/10 pt-4 text-xs">
                <div>
                  <dt className="text-slate-400">발급기관</dt>
                  <dd className="font-medium text-navy-800">{cert.issuer}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">인증번호</dt>
                  <dd className="tabular font-medium text-navy-800">{cert.number}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">최초 인증일</dt>
                  <dd className="tabular font-medium text-navy-800">{cert.firstIssued}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">유효기간</dt>
                  <dd className="tabular font-medium text-navy-800">{cert.validUntil}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-lg font-bold text-navy-900">자체 검사 인프라</h3>
          <p className="mt-2 text-sm text-slate-600">
            공정별 자체 검사 장비를 구축하여 출하 전 전수 검사를 원칙으로 운영합니다.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {inspectionInfra.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center gap-2.5 rounded-md border border-navy-900/10 bg-grey-50 px-4 py-6 text-center"
              >
                <item.icon size={24} weight="bold" className="text-electric-600" />
                <span className="text-xs font-bold text-navy-900">{item.name}</span>
                <span className="text-[11px] text-slate-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
