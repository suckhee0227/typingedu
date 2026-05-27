import type { PortfolioItem, ProcessStep, PricingPlan } from "../types";

export const NAV_ITEMS = [
  { id: "hero", label: "홈" },
  { id: "expertise", label: "전문성" },
  { id: "portfolio", label: "포트폴리오" },
  { id: "process", label: "제작과정" },
  { id: "pricing", label: "가격" },
  { id: "contact", label: "문의하기" },
] as const;

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  // 1줄 (베이직 · 스탠다드 · 프리미엄)
  {
    id: "draw-flags-world-tour",
    title: "국기 그려서 세계일주",
    description: "여러 나라의 국기를 직접 그려보며 세계 여러 나라를 여행하듯 익히는 교구",
    demoUrl: "/apps/draw-flags-world-tour/index.html",
    thumbnail: "/apps/draw-flags-world-tour/assets/thumbnail.png",
    tier: "베이직",
    tags: ["사회", "세계", "초등"],
    priceDisplay: "39 만 원",
    period: "1일",
  },
  {
    id: "tap-tap-3d",
    title: "3D 탭탭",
    description: "3D 공간에서 블록을 탭해 맞추는 입체 감각 트레이닝 교구",
    demoUrl: "/apps/tap-tap-3d/index.html",
    thumbnail: "/apps/tap-tap-3d/assets/thumbnail.png",
    tier: "스탠다드",
    tags: ["공간지각", "게임", "초등"],
    priceDisplay: "80 만 원 내외",
    period: "1주",
  },
  {
    id: "it-ai-history",
    title: "IT와 AI 역사",
    description: "IT와 AI의 발전 역사를 타이핑으로 학습하는 교구",
    demoUrl: "/apps/history-of-it-and-ai/index.html",
    thumbnail: "/apps/history-of-it-and-ai/assets/thumbnail.png",
    tier: "프리미엄",
    tags: ["IT", "AI", "역사"],
    priceDisplay: "300 만 원 내외",
    period: "2주",
  },
  // 2줄 (베이직 · 스탠다드 · 프리미엄)
  {
    id: "arithmetic-playground",
    title: "사칙연산 놀이",
    description: "숫자 블록을 연산 기호 앞뒤로 드래그해 나만의 수식을 만드는 인터랙티브 연산 학습 교구",
    demoUrl: "/apps/arithmetic-playground/index.html",
    thumbnail: "/apps/arithmetic-playground/assets/thumbnail.png",
    tier: "베이직",
    tags: ["수학", "사칙연산", "초등"],
    priceDisplay: "39 만 원",
    period: "1일",
  },
  {
    id: "village-of-100-people",
    title: "100명이 사는 마을",
    description: "전 세계와 한국을 100명이 사는 마을로 비유해 인구·통계를 한눈에 살펴보는 교구",
    demoUrl: "/apps/village-of-100-people/index.html",
    thumbnail: "/apps/village-of-100-people/assets/thumbnail.png",
    tier: "스탠다드",
    tags: ["사회", "통계", "중등"],
    priceDisplay: "협의",
    period: "1주",
  },
  {
    id: "mineral-resources-dashboard-v3",
    title: "지하자원 대시보드",
    description: "세계 각국의 지하·천연자원 현황과 시뮬레이션을 직접 조작하는 교구",
    demoUrl: "/apps/mineral-resources-dashboard-v3/index.html",
    thumbnail: "/apps/mineral-resources-dashboard-v3/assets/thumbnail.png",
    tier: "프리미엄",
    tags: ["지리", "사회", "중등"],
    priceDisplay: "150 만 원 내외",
    period: "2주",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "상담",
    description: "고객 요구 사항 파악",
    icon: "💬",
  },
  {
    step: 2,
    title: "샘플",
    description: "샘플을 제작하여 초안 확정",
    icon: "🎯",
  },
  {
    step: 3,
    title: "제작",
    description: "자체 엔진으로 신속한 고품질 교구 제작",
    icon: "",
    logoUrl: "/typingx-logo.png",
  },
  {
    step: 4,
    title: "납품",
    description: "완성된 교구 납품",
    icon: "🚀",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "스타터",
    price: "39만 원 ~",
    period: "부가세 별도",
    features: [
      "교구 1종 제작 (기본 템플릿 활용)",
      "난이도별 맞춤 제작",
      "샘플 미리보기 제공",
    ],
    cta: "혜택받고 시작하기",
  },
];
