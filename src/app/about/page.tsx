import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CompanyFacts from "@/components/about/CompanyFacts";
import CeoMessage from "@/components/about/CeoMessage";
import VisionValues from "@/components/about/VisionValues";
import QualitySystem from "@/components/about/QualitySystem";
import HistoryTimeline from "@/components/about/HistoryTimeline";

export const metadata: Metadata = {
  title: "회사소개",
  description:
    "한국엔지니어링서비스(KES)의 CEO 인사말, 기업 비전, ISO 9001·KEPIC 품질보증 체계 및 검사 인프라, 2009년부터의 연혁을 소개합니다.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        crumb="회사소개"
        title="정밀함이 곧 신뢰가 되는 기업"
        desc="2009년 설립 이후, 산업 자동화와 특수 플랜트 제어 분야에서 품질과 신뢰를 최우선 가치로 성장해 왔습니다."
      />
      <CompanyFacts />
      <CeoMessage />
      <VisionValues />
      <QualitySystem />
      <HistoryTimeline />
    </>
  );
}
