import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import TrackSection from "@/components/business/TrackSection";
import ProcessSteps from "@/components/business/ProcessSteps";
import { businessTracks } from "@/data/company";

export const metadata: Metadata = {
  title: "사업분야",
  description:
    "산업용 자동화 PLC/HMI 턴키 솔루션(Track 1)과 원전·대형 특수 플랜트 제어반(Track 2), 5단계 표준 공정 프로세스를 소개합니다.",
};

export default function BusinessPage() {
  return (
    <>
      <PageHero
        eyebrow="Business"
        crumb="사업분야"
        title="두 개의 전문 트랙, 하나의 품질 기준"
        desc="산업 자동화 턴키 솔루션과 원전·특수 플랜트 제어반, 서로 다른 두 영역에서 동일한 품질 기준을 적용합니다."
      />
      <TrackSection track={businessTracks[0]} />
      <TrackSection track={businessTracks[1]} reverse />
      <ProcessSteps />
    </>
  );
}
