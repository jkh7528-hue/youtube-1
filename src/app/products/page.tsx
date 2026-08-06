import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ProductCategories from "@/components/products/ProductCategories";
import SpecTable from "@/components/products/SpecTable";
import PortfolioGallery from "@/components/products/PortfolioGallery";

export const metadata: Metadata = {
  title: "제품소개",
  description:
    "반도체·이차전지·수처리 제어반과 방폭/내진 특수 판넬 등 KES의 제품군, 표준 사양표, 포트폴리오 갤러리를 확인하세요.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        crumb="제품소개"
        title="산업별 맞춤 제어반 솔루션"
        desc="반도체·이차전지·수처리부터 방폭/내진 특수 판넬까지, 산업 현장의 요구에 최적화된 제어반을 제작합니다."
      />
      <ProductCategories />
      <SpecTable />
      <PortfolioGallery />
    </>
  );
}
