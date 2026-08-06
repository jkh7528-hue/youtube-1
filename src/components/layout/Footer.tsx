import Link from "next/link";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Printer,
  SealCheck,
} from "@phosphor-icons/react/ssr";
import Container from "../ui/Container";
import Logo from "../ui/Logo";
import { company, nav, navSub, certifications } from "@/data/company";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-grey-300">
      <Container className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        {/* Company */}
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-grey-300/80">
            {company.nameKoFull}는 2009년 설립 이후 산업용 자동화 PLC·HMI 턴키 솔루션과
            원전·특수 플랜트 제어반을 공급해온 전기·자동제어 전문 엔지니어링 기업입니다.
          </p>
          <ul className="mt-6 flex flex-col gap-2.5 text-sm text-grey-300/90">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-electric-500" weight="fill" />
              {company.addressKo}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-electric-500" weight="fill" />
              {company.tel}
            </li>
            <li className="flex items-center gap-2.5">
              <Printer size={16} className="shrink-0 text-electric-500" weight="fill" />
              {company.fax}
            </li>
            <li className="flex items-center gap-2.5">
              <EnvelopeSimple size={16} className="shrink-0 text-electric-500" weight="fill" />
              {company.email}
            </li>
          </ul>
        </div>

        {/* Sitemap */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">사이트맵</h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-electric-400">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">바로가기</h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {navSub["/support"]?.map((sub) => (
              <li key={sub.href}>
                <Link href={sub.href} className="transition-colors hover:text-electric-400">
                  {sub.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about#quality" className="transition-colors hover:text-electric-400">
                품질보증 체계
              </Link>
            </li>
          </ul>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-sm font-bold tracking-wide text-white uppercase">보유 인증</h3>
          <ul className="mt-5 flex flex-col gap-3 text-sm">
            {certifications.slice(0, 3).map((cert) => (
              <li key={cert.id} className="flex items-start gap-2.5">
                <SealCheck size={16} className="mt-0.5 shrink-0 text-electric-500" weight="fill" />
                <span>
                  <span className="block font-semibold text-grey-100">{cert.title}</span>
                  <span className="text-xs text-grey-300/70">{cert.issuer}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-grey-300/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {company.nameKoFull} · 대표 {company.ceo} · 사업자등록번호 {company.bizRegNo} ·
            법인등록번호 {company.corpRegNo}
          </p>
          <p>
            &copy; {new Date().getFullYear()} {company.nameEn}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
