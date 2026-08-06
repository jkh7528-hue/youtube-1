"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { PaperPlaneTilt, CheckCircle, ArrowRight } from "@phosphor-icons/react";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { inquiryTopics } from "@/data/company";

export default function QuickRfqForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div className="bp-grid absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <Badge tone="dark">Quick RFQ</Badge>
          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            프로젝트 견적,
            <br />
            지금 간편하게 문의하세요
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-grey-200">
            간단한 정보만 남겨주시면 담당 엔지니어가 24시간 이내 1차 회신드립니다.
            도면 첨부가 필요한 상세 견적은 고객지원 페이지에서 접수해 주세요.
          </p>
          <Link
            href="/support#rfq"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-electric-400 hover:text-electric-300"
          >
            도면 첨부 · 상세 RFQ 접수하기 <ArrowRight size={16} weight="bold" />
          </Link>
        </div>

        <div className="rounded-lg border border-white/10 bg-white p-6 sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle size={48} weight="fill" className="text-electric-600" />
              <h3 className="text-lg font-bold text-navy-900">문의가 접수되었습니다</h3>
              <p className="text-sm text-slate-600">
                담당 엔지니어 검토 후 영업일 기준 24시간 이내 순차적으로 연락드리겠습니다.
              </p>
              <Button variant="ghost" onClick={() => setSubmitted(false)} className="mt-2">
                다시 작성하기
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qr-company" className="mb-1.5 block text-xs font-semibold text-navy-900">
                    회사명 <span className="text-electric-600">*</span>
                  </label>
                  <input
                    id="qr-company"
                    required
                    type="text"
                    placeholder="예) (주)한국엔지니어링서비스"
                    className="w-full rounded-sm border border-navy-900/15 px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
                  />
                </div>
                <div>
                  <label htmlFor="qr-name" className="mb-1.5 block text-xs font-semibold text-navy-900">
                    담당자명 <span className="text-electric-600">*</span>
                  </label>
                  <input
                    id="qr-name"
                    required
                    type="text"
                    placeholder="홍길동"
                    className="w-full rounded-sm border border-navy-900/15 px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="qr-tel" className="mb-1.5 block text-xs font-semibold text-navy-900">
                    연락처 <span className="text-electric-600">*</span>
                  </label>
                  <input
                    id="qr-tel"
                    required
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full rounded-sm border border-navy-900/15 px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
                  />
                </div>
                <div>
                  <label htmlFor="qr-topic" className="mb-1.5 block text-xs font-semibold text-navy-900">
                    문의 분야
                  </label>
                  <select
                    id="qr-topic"
                    className="w-full rounded-sm border border-navy-900/15 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
                  >
                    {inquiryTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="qr-msg" className="mb-1.5 block text-xs font-semibold text-navy-900">
                  문의 내용
                </label>
                <textarea
                  id="qr-msg"
                  rows={3}
                  placeholder="프로젝트 개요, 희망 납기 등을 간단히 남겨주세요."
                  className="w-full resize-none rounded-sm border border-navy-900/15 px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
                />
              </div>

              <Button type="submit" variant="primary" className="mt-1 w-full" icon={<PaperPlaneTilt size={17} weight="bold" />}>
                간편 문의 보내기
              </Button>
              <p className="text-center text-[11px] text-slate-400">
                제출 시 개인정보 수집·이용에 동의한 것으로 간주됩니다.
              </p>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
