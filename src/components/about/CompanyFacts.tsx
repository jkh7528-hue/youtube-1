import Container from "../ui/Container";
import { company } from "@/data/company";

const rows: [string, string][] = [
  ["회사명", company.nameKoFull],
  ["대표이사", company.ceo],
  ["설립일", `${company.founded} (${company.foundedYear}년)`],
  ["사업자등록번호", company.bizRegNo],
  ["법인등록번호", company.corpRegNo],
  ["업태", company.businessType],
  ["본사 소재지", company.addressKo],
  ["대표전화 / 팩스", `${company.tel} / ${company.fax}`],
];

export default function CompanyFacts() {
  return (
    <section className="border-b border-navy-900/10 bg-grey-50 py-14">
      <Container>
        <div className="overflow-hidden rounded-lg border border-navy-900/10 bg-white">
          <dl className="grid grid-cols-1 divide-y divide-navy-900/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:gap-6">
                <dt className="w-32 shrink-0 text-xs font-bold tracking-wide text-slate-400 uppercase">
                  {label}
                </dt>
                <dd className="text-sm font-medium text-navy-900">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
