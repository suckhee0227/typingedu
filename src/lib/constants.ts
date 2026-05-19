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
  {
    id: "functions-and-graphs",
    title: "함수와 그래프",
    description: "함수식을 입력하면 그래프가 실시간으로 그려지는 인터랙티브 수학 도구",
    demoUrl: "/apps/functions-and-graphs/index.html",
    thumbnail: "/apps/functions-and-graphs/assets/thumbnail.webp",
    tags: ["수학", "그래프", "중등"],
    ourPrice: 50,
    outsourcePrice: 120,
  },
  {
    id: "mineral-resources-dashboard-v3",
    title: "세계 대전",
    description: "세계 각국의 지하·천연자원 현황과 시뮬레이션을 직접 조작하는 교구",
    demoUrl: "/apps/mineral-resources-dashboard-v3/index.html",
    thumbnail: "/apps/mineral-resources-dashboard-v3/assets/thumbnail.webp",
    tags: ["지리", "사회", "중등"],
    ourPrice: 80,
    outsourcePrice: 250,
  },
  {
    id: "it-ai-history",
    title: "IT와 AI 역사",
    description: "IT와 AI의 발전 역사를 타이핑으로 학습하는 교구",
    demoUrl: "/apps/history-of-it-and-ai/index.html",
    thumbnail: "/apps/history-of-it-and-ai/assets/thumbnail.webp",
    tags: ["IT", "AI", "역사"],
    ourPrice: 180,
    outsourcePrice: 400,
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "상담",
    description: "교육 기관의 철학과 니즈를 파악합니다",
    icon: "💬",
  },
  {
    step: 2,
    title: "샘플 확인",
    description: "맞춤형 샘플을 제작하여 방향을 확정합니다",
    icon: "🎯",
  },
  {
    step: 3,
    title: "제작",
    description: "자체 엔진으로 빠르게 교구를 제작합니다",
    icon: "⚡",
  },
  {
    step: 4,
    title: "납품",
    description: "완성된 교구를 납품하고 사후 지원합니다",
    icon: "🚀",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: "스타터",
    price: "50~200만원",
    period: "교구 1종 기준",
    features: [
      "교구 1종 제작 (기본 템플릿 활용)",
      "난이도별 맞춤 제작",
      "샘플 미리보기 제공",
      "1회 수정 무료",
      "1개월 유지보수",
    ],
    cta: "혜택받고 시작하기",
  },
  {
    name: "엔터프라이즈",
    price: "B2B · 강사 전용",
    period: "",
    features: [
      "무제한 교구 제작 및 전용 커리큘럼 설계",
      "12개월 유지보수",
      "전용 관리 페이지 제공",
      "강사 제휴 프로그램 (수강생 연동 혜택)",
    ],
    cta: "기업/기관 도입 문의",
  },
];
