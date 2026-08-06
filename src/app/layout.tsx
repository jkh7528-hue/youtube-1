import type { Metadata } from "next";
import { Noto_Sans_KR, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/app/Header";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "심정지 발굴기 | 유튜브 급상승 · 심정지 영상 탐색",
    template: "%s | 심정지 발굴기",
  },
  description:
    "카테고리별 급상승 영상으로 트렌드를 파악하고, 조회수는 높지만 최근 VPH가 죽은 '심정지' 영상을 발굴해 소재로 활용하세요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${robotoMono.variable}`}>
      <body className="flex min-h-dvh flex-col bg-bg">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
