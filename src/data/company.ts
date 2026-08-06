// 회사 핵심 정보
// 실제 데이터: 사업자등록증 / ISO 9001:2015 인증서 / Rockwell Automation SI 인증서
// 그 외 산업 표준 더미데이터 포함 (전기·PLC 자동제어 기업 기준)

export const company = {
  nameKo: "한국엔지니어링서비스",
  nameKoFull: "(주)한국엔지니어링서비스",
  nameEn: "Korea Engineering Service Co., Ltd.",
  nameShort: "KES",
  ceo: "정성일",
  founded: "2009-01-01",
  foundedYear: 2009,
  bizRegNo: "410-86-24751",
  corpRegNo: "200111-0269922",
  addressKo: "광주광역시 광산구 비아로 120 (비아동)",
  addressEn: "120 Biaro, Gwangsan-gu, Gwangju, Republic of Korea",
  zipCode: "62243",
  tel: "062-956-7740",
  telSub: "062-956-7741",
  fax: "062-956-7742",
  email: "newkesco@hanmail.net",
  mapQuery: "광주광역시 광산구 비아로 120",
  businessType: "제조업 / 서비스업",
  businessItems: [
    "계측장비·자동화시스템·산업용기기 제조",
    "수배전반설비·회로카드조립체 제조",
    "프로그래머블 로직 컨트롤러(PLC) 제조",
    "물질검사 및 시험기구 개발",
    "소프트웨어 공급",
  ],
};

export const nav = [
  { href: "/about", label: "회사소개", labelEn: "About Us" },
  { href: "/business", label: "사업분야", labelEn: "Business" },
  { href: "/products", label: "제품소개", labelEn: "Products" },
  { href: "/support", label: "고객지원", labelEn: "Support" },
];

export const navSub: Record<string, { href: string; label: string; desc: string }[]> = {
  "/about": [
    { href: "/about#ceo", label: "CEO 인사말", desc: "경영철학과 비전" },
    { href: "/about#vision", label: "기업 비전", desc: "미션 · 비전 · 핵심가치" },
    { href: "/about#quality", label: "품질보증 체계", desc: "KEPIC · ISO 9001 · 검사 인프라" },
    { href: "/about#history", label: "연혁", desc: "2009 ~ 현재" },
  ],
  "/business": [
    { href: "/business#track1", label: "Track 1. 산업용 자동화", desc: "PLC · HMI 턴키 솔루션" },
    { href: "/business#track2", label: "Track 2. 원전·특수 플랜트", desc: "원전 & 대형 특수 플랜트 제어반" },
    { href: "/business#process", label: "5단계 공정 프로세스", desc: "상담부터 시운전까지" },
  ],
  "/products": [
    { href: "/products#semiconductor", label: "반도체 제어반", desc: "Cleanroom 대응 정밀 제어" },
    { href: "/products#battery", label: "이차전지 제어반", desc: "배터리 공정 자동화" },
    { href: "/products#water", label: "수처리 제어반", desc: "상하수도 · 산업용수 제어" },
    { href: "/products#special", label: "방폭·내진 특수 판넬", desc: "Ex-proof / Seismic 인증" },
  ],
  "/support": [
    { href: "/support#rfq", label: "RFQ 견적문의", desc: "도면 첨부 · 24시간 접수" },
    { href: "/support#faq", label: "자주 묻는 질문", desc: "FAQ" },
    { href: "/support#location", label: "오시는 길", desc: "위치 및 연락처" },
  ],
};

export const certifications = [
  {
    id: "iso9001",
    title: "ISO 9001:2015",
    subtitle: "품질경영시스템 인증",
    issuer: "ICR (International Certification Registrar)",
    number: "QI611923",
    scope: "발전설비보조장비, 계측시험장비 및 자동제어시스템에 대한 설계/개발 및 제조",
    firstIssued: "2016-10-18",
    issued: "2023-11-02",
    validUntil: "2026-10-19",
    iafCode: "18, 19",
  },
  {
    id: "rockwell",
    title: "Rockwell Automation Bronze System Integrator",
    subtitle: "PartnerNetwork™ Certified SI",
    issuer: "Rockwell Automation",
    number: "2022 Annual Membership",
    scope: "Control · Visualization · General Motion · Machine Safety · Mechatronics · Digital Engineering",
    firstIssued: "2022-01-01",
    issued: "2022-01-01",
    validUntil: "연간 갱신",
    iafCode: "SI Program",
  },
  {
    id: "kepic",
    title: "KEPIC MN / EN",
    subtitle: "원자력 기자재 품질보증 등록",
    issuer: "한국전력기술인협회(KEPIC)",
    number: "KEPIC-MN 24-00XX (예시)",
    scope: "원자력발전소 계측제어설비 및 전기 기자재 설계·제작·시험",
    firstIssued: "2017-05-01",
    issued: "2024-05-01",
    validUntil: "2027-04-30",
    iafCode: "MN, EN",
  },
  {
    id: "kesco",
    title: "KOSHA / 전기안전 자체검사 등록업체",
    subtitle: "전기설비 안전 자격 등록",
    issuer: "한국전기안전공사",
    number: "등록 제 2019-CTR-XXXX 호 (예시)",
    scope: "수배전반 및 자동제어반 전기설비 자체점검",
    firstIssued: "2019-03-01",
    issued: "2023-03-01",
    validUntil: "2026-02-28",
    iafCode: "-",
  },
];

export const partners = [
  "Rockwell Automation",
  "Siemens",
  "Schneider Electric",
  "LS ELECTRIC",
  "한국전력공사 (KEPCO)",
  "한국수력원자력 (KHNP)",
  "한국전력기술 (KEPCO E&C)",
  "두산에너빌리티",
];

export const history = [
  {
    year: "2009",
    items: ["01월 (주)한국엔지니어링서비스 법인 설립 (광주광역시 광산구)", "계측시험장비 · 자동제어시스템 설계/제작 사업 개시"],
  },
  {
    year: "2012",
    items: ["산업용 PLC·HMI 통합 제어반 제작 라인 구축", "반도체 협력사向 계측 제어반 최초 납품"],
  },
  {
    year: "2016",
    items: ["ISO 9001:2015 품질경영시스템 최초 인증 취득 (ICR)", "수배전반 자체 조립·검사 인프라 확충"],
  },
  {
    year: "2018",
    items: ["사업장 이전 및 사업자등록 정정 (광산구 비아로 120)", "이차전지 공정 자동화 제어반 사업 진출"],
  },
  {
    year: "2020",
    items: ["원전 보조기기 설계/제작 KEPIC 등록 (MN·EN)", "방폭(Ex-proof)·내진 특수 판넬 라인 신설"],
  },
  {
    year: "2022",
    items: ["Rockwell Automation PartnerNetwork Bronze System Integrator 인증", "대형 특수 플랜트 제어반 Track 2 사업부 분리 운영"],
  },
  {
    year: "2023",
    items: ["ISO 9001:2015 갱신 인증 (인증번호 QI611923)", "수처리 제어반 전담 생산라인 증설"],
  },
  {
    year: "2025",
    items: ["24시간 도면 검토/견적 대응 고객지원 체계 오픈", "누적 턴키 프로젝트 350건 돌파 (누계 기준)"],
  },
];

export const stats = [
  { label: "설립", value: "2009", unit: "년" },
  { label: "누적 프로젝트", value: "350", unit: "건 +" },
  { label: "품질 인증", value: "ISO 9001", unit: "" },
  { label: "SI 등급", value: "Rockwell Bronze", unit: "" },
];

export const coreStrengths = [
  {
    title: "ISO 9001 품질보증 체계",
    desc: "설계 → 제작 → 검사 전 과정에 걸친 품질경영시스템으로 산업용 자동제어시스템의 신뢰성을 보증합니다.",
    icon: "seal-check",
  },
  {
    title: "Rockwell Automation 공인 SI",
    desc: "Bronze System Integrator 인증을 통해 Control · Process · Power · Information 전 영역의 통합 솔루션을 제공합니다.",
    icon: "hand-shake",
  },
  {
    title: "원전 · 특수 플랜트 실적",
    desc: "KEPIC 등록 기반의 원자력 발전설비 보조장비 및 대형 특수 플랜트 제어반 설계/제작 역량을 보유하고 있습니다.",
    icon: "shield-check",
  },
  {
    title: "24시간 도면 검토 대응",
    desc: "긴급 RFQ 및 도면 검토 요청에 24시간 내 1차 회신을 원칙으로 하는 신속 대응 체계를 운영합니다.",
    icon: "clock",
  },
];

export const businessTracks = [
  {
    id: "track1",
    tag: "Track 1",
    title: "산업용 자동화 PLC·HMI 턴키",
    subtitle: "Industrial Automation Turnkey Solution",
    desc: "반도체, 이차전지, 식음료, 수처리 등 다양한 산업 현장에 최적화된 PLC/HMI 기반 자동제어 시스템을 설계부터 시운전까지 턴키로 제공합니다.",
    features: [
      "PLC/HMI 프로그래밍 및 통합 SCADA 구축",
      "MCC(모터제어반) · 수배전반 설계/제작",
      "산업용 네트워크(Profinet, EtherNet/IP 등) 통합",
      "현장 계측기기(센서/트랜스미터) 연동 및 캘리브레이션",
    ],
    industries: ["반도체", "이차전지(EV Battery)", "수처리", "식음료/제약", "물류/자동창고"],
  },
  {
    id: "track2",
    tag: "Track 2",
    title: "원전 & 대형 특수 플랜트 제어반",
    subtitle: "Nuclear & Special Plant Control Panel",
    desc: "KEPIC 기준에 따른 원자력 발전설비 보조장비 및 대형 특수 플랜트向 내진/방폭 사양 제어반을 설계·제작하며, 엄격한 품질 검증 절차를 적용합니다.",
    features: [
      "KEPIC MN/EN 기준 설계 및 QA 문서 관리",
      "내진(Seismic) / 방폭(Ex-proof) 사양 특수 판넬 제작",
      "발전설비 보조장비 및 계측시험장비 설계/제작",
      "발주처 입회 시험(FAT/SAT) 및 품질 검사 대응",
    ],
    industries: ["원자력발전", "화력/복합화력 발전", "가스/석유화학 플랜트", "특수 방산 설비"],
  },
];

export const processSteps = [
  {
    step: "01",
    title: "상담 및 요구사항 분석",
    desc: "고객 요청 사항, 설치 환경, 관련 규격(KS/IEC/KEPIC 등)을 분석하여 최적 사양을 도출합니다.",
  },
  {
    step: "02",
    title: "설계 (전기/제어 회로설계)",
    desc: "단선결선도, 제어 로직, PLC 프로그램을 설계하고 고객 도면 검토 및 승인을 진행합니다.",
  },
  {
    step: "03",
    title: "제작 (패널 조립/배선)",
    desc: "자체 생산라인에서 판넬 조립, 배선, 부품 실장을 진행하며 공정별 자체 검사를 수행합니다.",
  },
  {
    step: "04",
    title: "검사 및 시험 (FAT)",
    desc: "절연저항, 내전압, 동작 시퀀스 시험 등 공장 출하 전 시험(FAT)을 통해 품질을 검증합니다.",
  },
  {
    step: "05",
    title: "납품 · 설치 · 시운전 (SAT)",
    desc: "현장 설치 및 시운전(SAT)을 지원하고, 이후 정기점검을 통한 사후관리(A/S)를 제공합니다.",
  },
];

export const productCategories = [
  {
    id: "semiconductor",
    title: "반도체 제어반",
    titleEn: "Semiconductor Control Panel",
    desc: "Cleanroom 환경에 대응하는 저파티클, 고신뢰성 사양의 공정 제어반으로 웨이퍼 공정 설비의 정밀 제어를 지원합니다.",
    tags: ["Cleanroom 대응", "저파티클 사양", "이중화 전원"],
  },
  {
    id: "battery",
    title: "이차전지 제어반",
    titleEn: "Secondary Battery Control Panel",
    desc: "전극·조립·화성공정 전 라인에 적용 가능한 배터리 제조 공정 자동화 제어반을 제공합니다.",
    tags: ["공정 자동화", "데이터 이력관리", "고속 인터록"],
  },
  {
    id: "water",
    title: "수처리 제어반",
    titleEn: "Water Treatment Control Panel",
    desc: "상하수도, 산업용수, 폐수처리 시설向 계측/제어 통합반으로 원격 감시 및 자동 운전을 지원합니다.",
    tags: ["원격 감시(SCADA)", "IP54 이상", "펌프 자동교번"],
  },
  {
    id: "special",
    title: "방폭 · 내진 특수 판넬",
    titleEn: "Explosion-proof / Seismic Panel",
    desc: "위험물 취급 구역 및 지진하중 고려가 필요한 플랜트向 방폭(Ex-proof)·내진(Seismic) 인증 사양 판넬입니다.",
    tags: ["Ex-proof d IIB", "내진 1등급", "KEPIC 대응"],
  },
];

export const specTable = [
  {
    category: "반도체 제어반",
    voltage: "AC 220V/380V, 3상 4선식",
    current: "정격 100~800A",
    ip: "IP42 (Cleanroom 사양 별도)",
    standard: "KS C IEC 61439-1/2",
    material: "SGCC 냉연 아연도금강판 (t=2.0~2.3T)",
    finish: "정전분체도장 (Munsell 5Y7/1)",
  },
  {
    category: "이차전지 제어반",
    voltage: "AC 220V/380V, DC 24V 제어",
    current: "정격 100~1,200A",
    ip: "IP44",
    standard: "KS C IEC 61439-1/2, KS C IEC 60529",
    material: "SGCC 냉연 아연도금강판 (t=2.3T)",
    finish: "정전분체도장 (지정 색상 대응)",
  },
  {
    category: "수처리 제어반",
    voltage: "AC 220V/380V, 3상 4선식",
    current: "정격 60~630A",
    ip: "IP54 이상 (옥외형 IP65)",
    standard: "KS C IEC 61439-1/2, KS C 8467",
    material: "STS304 스테인리스 (옥외형)",
    finish: "헤어라인 마감 / 분체도장",
  },
  {
    category: "방폭·내진 특수 판넬",
    voltage: "AC 220V/380V/440V",
    current: "정격 100~2,000A",
    ip: "IP65 (방폭: Ex-proof d IIB T4)",
    standard: "KEPIC MN/EN, KS C IEC 60079",
    material: "STS316L / 알루미늄 다이캐스팅",
    finish: "내식 특수도장",
  },
];

export const faqs = [
  {
    q: "견적(RFQ) 요청 시 필요한 자료는 무엇인가요?",
    a: "단선결선도(SLD), 사양서, 설치 환경 정보(실내/실외, 방폭 여부 등)가 있으면 정확한 견적이 가능합니다. 자료가 없으신 경우에도 요구사항 설명만으로 1차 상담이 가능합니다.",
  },
  {
    q: "도면 검토 및 견적 회신까지 얼마나 걸리나요?",
    a: "접수 후 24시간 이내 1차 검토 결과를 안내드리며, 표준 사양 기준 정식 견적서는 영업일 기준 2~3일 이내 발송을 원칙으로 합니다.",
  },
  {
    q: "원전/특수 플랜트向 제어반도 제작이 가능한가요?",
    a: "당사는 KEPIC MN/EN 등록업체로서 원자력 발전설비 보조장비 및 내진/방폭 사양의 특수 플랜트 제어반 설계·제작 실적을 보유하고 있습니다.",
  },
  {
    q: "소량 맞춤 제작(커스터마이징)도 대응하나요?",
    a: "1면 단위의 소량 주문부터 대형 턴키 프로젝트까지 대응 가능하며, 고객 사양에 맞춘 맞춤 설계를 기본으로 진행합니다.",
  },
  {
    q: "해외 프로젝트 납품 및 수출 대응이 가능한가요?",
    a: "IEC 국제 규격 기반 설계가 가능하며, 해외 발주처 표준(사양서) 검토 및 수출 포장/선적 대응 경험을 보유하고 있습니다.",
  },
  {
    q: "납품 후 사후관리(A/S)는 어떻게 진행되나요?",
    a: "납품 및 시운전(SAT) 이후 정기 점검 서비스를 제공하며, 긴급 장애 발생 시 원격/현장 기술지원을 통해 신속히 대응합니다.",
  },
  {
    q: "품질 인증서(ISO, KEPIC 등) 사본을 제공받을 수 있나요?",
    a: "네, 계약 진행 또는 입찰 참여 시 ISO 9001, KEPIC 등록증 등 관련 인증서 사본을 공식적으로 제공해 드립니다.",
  },
];

export const portfolioItems = [
  { id: 1, category: "semiconductor", title: "반도체 클린룸 공정 제어반 턴키", client: "OO반도체 평택캠퍼스", year: "2024" },
  { id: 2, category: "battery", title: "이차전지 전극공정 자동화 판넬", client: "OO배터리 청주공장", year: "2024" },
  { id: 3, category: "water", title: "산업용수 재이용시설 통합 제어반", client: "OO산업단지 수처리센터", year: "2023" },
  { id: 4, category: "special", title: "원전 보조설비 내진 특수판넬", client: "한빛원자력본부 (예시)", year: "2023" },
  { id: 5, category: "semiconductor", title: "웨이퍼 이송 설비 계측제어반", client: "OO전자 화성캠퍼스", year: "2022" },
  { id: 6, category: "battery", title: "배터리 화성공정 MCC 제작", client: "OO에너지솔루션", year: "2022" },
  { id: 7, category: "water", title: "하수처리장 원격감시 제어시스템", client: "OO광역시 환경공단", year: "2021" },
  { id: 8, category: "special", title: "방폭 구역 전동기 제어반(Ex-proof)", client: "OO화학 여수공장", year: "2021" },
] as const;

export const inquiryTopics = [
  "산업용 자동화 PLC/HMI",
  "원전·특수 플랜트 제어반",
  "반도체 제어반",
  "이차전지 제어반",
  "수처리 제어반",
  "방폭·내진 특수 판넬",
  "기타 문의",
];
