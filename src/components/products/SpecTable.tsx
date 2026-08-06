import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { specTable } from "@/data/company";

const columns: { key: keyof (typeof specTable)[number]; label: string }[] = [
  { key: "category", label: "구분" },
  { key: "voltage", label: "정격전압" },
  { key: "current", label: "정격전류" },
  { key: "ip", label: "보호등급 (IP)" },
  { key: "standard", label: "적용 규격" },
  { key: "material", label: "함체 소재" },
  { key: "finish", label: "표면 처리" },
];

export default function SpecTable() {
  return (
    <section className="bg-grey-100 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Specification"
          title="제품 사양표"
          desc="아래 제원은 표준 사양이며, 고객 요청 사양 및 발주처 규격에 따라 조정될 수 있습니다."
        />

        <div className="mt-10 overflow-x-auto rounded-lg border border-navy-900/10 bg-white">
          <table className="w-full min-w-[860px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-navy-900 text-white">
                {columns.map((c) => (
                  <th key={c.key} scope="col" className="px-5 py-3.5 text-xs font-bold tracking-wide whitespace-nowrap uppercase">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specTable.map((row, i) => (
                <tr
                  key={row.category}
                  className={`border-t border-navy-900/10 ${i % 2 === 1 ? "bg-grey-50" : "bg-white"}`}
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      className={`px-5 py-4 align-top whitespace-nowrap text-slate-700 ${
                        c.key === "category" ? "font-bold text-navy-900" : "tabular"
                      }`}
                    >
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          ※ 상기 사양은 표준 라인업 기준이며, KS C IEC 61439 등 관련 규격 및 발주처 시방서에 따라
          상세 스펙은 변경될 수 있습니다.
        </p>
      </Container>
    </section>
  );
}
