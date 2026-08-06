"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import {
  UploadSimple,
  FileText,
  X,
  CheckCircle,
  PaperPlaneTilt,
  Clock,
} from "@phosphor-icons/react";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { inquiryTopics } from "@/data/company";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function RfqForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section id="rfq" className="scroll-mt-28 bg-white py-20 sm:py-24">
        <Container>
          <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-lg border border-navy-900/10 bg-grey-50 px-8 py-16 text-center">
            <CheckCircle size={56} weight="fill" className="text-electric-600" />
            <h3 className="text-xl font-bold text-navy-900">RFQ 접수가 완료되었습니다</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              첨부해 주신 도면과 문의 내용을 담당 엔지니어가 검토 후, 영업일 기준 24시간 이내
              1차 회신드리겠습니다. 감사합니다.
            </p>
            <Button variant="ghost" onClick={() => { setSubmitted(false); setFiles([]); setAgreed(false); }} className="mt-2">
              새 문의 작성하기
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="rfq" className="scroll-mt-28 bg-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="RFQ"
            title="도면 검토 및 견적 문의"
            desc="도면 및 사양서를 첨부해 주시면 보다 정확한 견적을 받아보실 수 있습니다."
          />
          <Badge tone="electric" className="shrink-0">
            <Clock size={14} weight="bold" />
            24시간 접수 가능
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="회사명" required id="rfq-company" placeholder="예) (주)한국엔지니어링서비스" />
              <Field label="담당자명" required id="rfq-name" placeholder="홍길동" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="연락처" required id="rfq-tel" type="tel" placeholder="010-0000-0000" />
              <Field label="이메일" required id="rfq-email" type="email" placeholder="example@company.com" />
            </div>

            <div>
              <label htmlFor="rfq-topic" className="mb-1.5 block text-xs font-semibold text-navy-900">
                문의 분야 <span className="text-electric-600">*</span>
              </label>
              <select
                id="rfq-topic"
                required
                className="w-full rounded-sm border border-navy-900/15 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
              >
                {inquiryTopics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rfq-msg" className="mb-1.5 block text-xs font-semibold text-navy-900">
                문의 내용 <span className="text-electric-600">*</span>
              </label>
              <textarea
                id="rfq-msg"
                required
                rows={5}
                placeholder="설치 환경, 희망 납기, 특이 사양(방폭/내진 여부 등)을 자유롭게 작성해 주세요."
                className="w-full resize-none rounded-sm border border-navy-900/15 px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-navy-900">도면 / 사양서 첨부</p>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  dragging ? "border-electric-600 bg-electric-50" : "border-navy-900/15 bg-grey-50 hover:bg-grey-100"
                }`}
              >
                <UploadSimple size={26} weight="bold" className="text-electric-600" />
                <p className="text-sm font-semibold text-navy-900">파일을 드래그하거나 클릭하여 업로드</p>
                <p className="text-xs text-slate-500">PDF, DWG, DXF, JPG, PNG · 파일당 최대 20MB</p>
                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
                />
              </div>

              {files.length > 0 ? (
                <ul className="mt-3 flex flex-col gap-2">
                  {files.map((f) => (
                    <li
                      key={f.name}
                      className="flex items-center gap-2.5 rounded-sm border border-navy-900/10 bg-white px-3.5 py-2.5 text-xs"
                    >
                      <FileText size={16} className="shrink-0 text-electric-600" weight="fill" />
                      <span className="flex-1 truncate font-medium text-navy-800">{f.name}</span>
                      <span className="shrink-0 text-slate-400">{formatSize(f.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(f.name)}
                        aria-label={`${f.name} 삭제`}
                        className="shrink-0 cursor-pointer text-slate-400 hover:text-electric-600"
                      >
                        <X size={14} weight="bold" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <label className="flex items-start gap-2.5 text-xs text-slate-600">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-electric-600"
              />
              <span>
                [필수] 견적 상담을 위한 개인정보(성명, 연락처, 이메일) 수집 및 이용에 동의합니다.
                수집된 정보는 견적 응대 목적으로만 사용되며, 상담 완료 후 관련 법령에 따라 파기됩니다.
              </span>
            </label>

            <Button type="submit" variant="primary" className="w-full" icon={<PaperPlaneTilt size={17} weight="bold" />}>
              RFQ 제출하기
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}

function Field({
  label,
  id,
  required,
  type = "text",
  placeholder,
}: {
  label: string;
  id: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-navy-900">
        {label} {required ? <span className="text-electric-600">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-sm border border-navy-900/15 px-3.5 py-2.5 text-sm text-navy-900 outline-none placeholder:text-slate-400 focus:border-electric-600 focus:ring-2 focus:ring-electric-600/20"
      />
    </div>
  );
}
