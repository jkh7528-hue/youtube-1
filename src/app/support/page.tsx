import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import RfqForm from "@/components/support/RfqForm";
import Faq from "@/components/support/Faq";
import LocationContact from "@/components/support/LocationContact";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "고객지원",
  description: "도면 첨부 RFQ 견적 문의, 자주 묻는 질문(FAQ), 오시는 길 및 연락처를 확인하세요. 24시간 접수 가능합니다.",
};

export default function SupportPage() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        crumb="고객지원"
        title="24시간 언제든 문의하세요"
        desc={`도면 검토부터 견적, 사후관리까지 ${company.nameShort} 엔지니어가 신속하고 정확하게 답변해 드립니다.`}
      />
      <RfqForm />
      <Faq />
      <LocationContact />
    </>
  );
}
