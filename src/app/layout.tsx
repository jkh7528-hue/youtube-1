import type { Metadata } from "next";
import { Noto_Sans_KR, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { company } from "@/data/company";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kes-engineering.example.com"),
  title: {
    default: `${company.nameKo} | 산업용 자동화 · 원전 특수 플랜트 제어반 전문기업`,
    template: `%s | ${company.nameKo}`,
  },
  description:
    "한국엔지니어링서비스(KES)는 2009년 설립된 전기·PLC 자동제어 전문 엔지니어링 기업입니다. 산업용 자동화 PLC/HMI 턴키, 원전·특수 플랜트 제어반을 ISO 9001 품질보증 체계로 공급합니다.",
  keywords: [
    "PLC 제어반",
    "자동제어시스템",
    "수배전반",
    "원전 제어반",
    "MCC 제작",
    "한국엔지니어링서비스",
    "KEPIC",
    "ISO 9001",
  ],
  openGraph: {
    title: `${company.nameKo} | 산업용 자동화 · 원전 특수 플랜트 제어반 전문기업`,
    description:
      "설계부터 시운전까지, 정밀 제어 자동화 턴키 솔루션. ISO 9001 · Rockwell Automation 공인 System Integrator.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${robotoMono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1 pt-20 lg:pt-[116px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
