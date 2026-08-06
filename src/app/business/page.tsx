import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import TrackSection from "@/components/business/TrackSection";
import ProcessSteps from "@/components/business/ProcessSteps";
import { businessTracks } from "@/data/company";

export const metadata: Metadata = {
  title: "사업분야",
  description:
    "원전·대형 특수 플랜트 제어반(Track 1)과 산업용 자동화 PLC/HMI 턴키 솔루션(Track 2), 5단계 표준 공정 프로세스를 소개합니다.",
};

export default function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="Business"
        crumb="사업분야"
        title="원전에서 증명한 신뢰, 산업 전반으로"
        desc="국내외 원자력발전소 다수 납품 실적을 기반으로, 산업 자동화 턴키 솔루션까지 동일한 품질 기준을 적용합니다."
      />
      <TrackSection track={businessTracks[0]} />
      <TrackSection track={businessTracks[1]} reverse />
      <ProcessSteps />
    </>
  );
}
