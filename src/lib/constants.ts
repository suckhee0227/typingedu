import type { PortfolioItem, ProcessStep, PricingPlan, SampleItem } from "../types";

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
    id: "salt-water-concentration",
    title: "소금물 농도 구하기",
    description: "물과 소금을 더하며 해수 농도(%)를 직접 계산·실험하는 화학 농도 학습 교구",
    demoUrl: "/apps/salt-water-concentration/index.html",
    thumbnail: "/apps/salt-water-concentration/assets/thumbnail.png",
    tier: "스탠다드",
    tags: ["과학", "화학", "중등"],
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
    id: "english-study",
    title: "4가지 영어공부",
    description: "그림·뜻·소리를 활용해 4가지 방식으로 재미있게 영단어를 익히는 영어 학습 교구",
    demoUrl: "/apps/english-study/index.html",
    thumbnail: "/apps/english-study/assets/thumbnail.png",
    tier: "베이직",
    tags: ["영어", "어휘", "초등"],
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
    priceDisplay: "80 만 원 내외",
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

// ─────────────────────────────────────────
// 샘플교본 보기 — 카테고리별 샘플 교구 목록
// (상단 '샘플교본' 버튼 → 전체화면 오버레이에서 노출)
// ─────────────────────────────────────────
export const SAMPLE_CATEGORIES = [
  "전체",
  "학교·교과",
  "고객응대·CS",
  "매장·외식",
  "뷰티·건강",
  "안전·위생",
  "전문·생활서비스",
] as const;

export const SAMPLE_ITEMS: SampleItem[] = [
  // 학교·교과 (기존 포트폴리오 교구)
  {
    id: "arithmetic-playground",
    title: "사칙연산 놀이",
    description: "숫자 블록을 연산 기호 앞뒤로 드래그해 나만의 수식을 만드는 인터랙티브 연산 학습 교구",
    demoUrl: "/apps/arithmetic-playground/index.html",
    thumbnail: "/apps/arithmetic-playground/assets/thumbnail.png",
    category: "학교·교과",
  },
  {
    id: "salt-water-concentration",
    title: "소금물 농도 구하기",
    description: "물과 소금을 더하며 해수 농도(%)를 직접 계산·실험하는 화학 농도 학습 교구",
    demoUrl: "/apps/salt-water-concentration/index.html",
    thumbnail: "/apps/salt-water-concentration/assets/thumbnail.png",
    category: "학교·교과",
  },
  {
    id: "history-of-it-and-ai",
    title: "IT와 AI 역사",
    description: "IT와 AI의 발전 역사를 타이핑으로 학습하는 교구",
    demoUrl: "/apps/history-of-it-and-ai/index.html",
    thumbnail: "/apps/history-of-it-and-ai/assets/thumbnail.png",
    category: "학교·교과",
  },
  {
    id: "english-study",
    title: "4가지 영어공부",
    description: "그림·뜻·소리를 활용해 4가지 방식으로 재미있게 영단어를 익히는 영어 학습 교구",
    demoUrl: "/apps/english-study/index.html",
    thumbnail: "/apps/english-study/assets/thumbnail.png",
    category: "학교·교과",
  },
  {
    id: "village-of-100-people",
    title: "100명이 사는 마을",
    description: "전 세계와 한국을 100명이 사는 마을로 비유해 인구·통계를 한눈에 살펴보는 교구",
    demoUrl: "/apps/village-of-100-people/index.html",
    thumbnail: "/apps/village-of-100-people/assets/thumbnail.png",
    category: "학교·교과",
  },
  {
    id: "mineral-resources-dashboard-v3",
    title: "지하자원 대시보드",
    description: "세계 각국의 지하·천연자원 현황과 시뮬레이션을 직접 조작하는 교구",
    demoUrl: "/apps/mineral-resources-dashboard-v3/index.html",
    thumbnail: "/apps/mineral-resources-dashboard-v3/assets/thumbnail.png",
    category: "학교·교과",
  },
  // 고객응대·CS
  {
    id: "call-center-counseling",
    title: "상담원 응대 매뉴얼 스마트 퀴즈",
    description: "상담원 응대 매뉴얼을 카드·체크리스트·퀴즈로 익히는 콜센터 교육 콘텐츠",
    demoUrl: "/apps/call-center-counseling/index.html",
    thumbnail: "/apps/call-center-counseling/assets/thumbnail.png",
    category: "고객응대·CS",
  },
  {
    id: "online-shopping-benefits",
    title: "고객 혜택 찾기 스마트 퀴즈",
    description: "쿠폰·적립·배송 등 쇼핑몰 고객 혜택을 익히는 학습 콘텐츠",
    demoUrl: "/apps/online-shopping-benefits/index.html",
    thumbnail: "/apps/online-shopping-benefits/assets/thumbnail.png",
    category: "고객응대·CS",
  },
  {
    id: "customer-service-training",
    title: "고객 서비스 역량 강화 스마트 상황 퀴즈",
    description: "상황별 고객 응대 역량을 키우는 기업 서비스 교육 콘텐츠",
    demoUrl: "/apps/customer-service-training/index.html",
    thumbnail: "/apps/customer-service-training/assets/thumbnail.png",
    category: "고객응대·CS",
  },
  // 매장·외식
  {
    id: "cafe-restaurant-training",
    title: "신입 알바 매장교육 스마트 퀴즈",
    description: "신입 알바 매장 업무·위생·응대를 익히는 외식 매장 교육",
    demoUrl: "/apps/cafe-restaurant-training/index.html",
    thumbnail: "/apps/cafe-restaurant-training/assets/thumbnail.png",
    category: "매장·외식",
  },
  {
    id: "studycafe-usage",
    title: "스터디카페 이용수칙 스마트 안내",
    description: "무인 스터디카페 이용수칙을 안내하는 학습 콘텐츠",
    demoUrl: "/apps/studycafe-usage/index.html",
    thumbnail: "/apps/studycafe-usage/assets/thumbnail.png",
    category: "매장·외식",
  },
  // 뷰티·건강
  {
    id: "beauty-homecare",
    title: "시술 후 홈케어 스마트 안내",
    description: "시술 후 홈케어 방법을 안내하는 뷰티샵 교육 콘텐츠",
    demoUrl: "/apps/beauty-homecare/index.html",
    thumbnail: "/apps/beauty-homecare/assets/thumbnail.png",
    category: "뷰티·건강",
  },
  {
    id: "nail-aftercare",
    title: "네일 시술 후 관리 안내 스마트 퀴즈",
    description: "네일 시술 후 관리 방법을 안내하는 학습 콘텐츠",
    demoUrl: "/apps/nail-aftercare/index.html",
    thumbnail: "/apps/nail-aftercare/assets/thumbnail.png",
    category: "뷰티·건강",
  },
  {
    id: "eyelash-aftercare",
    title: "속눈썹 연장 후 관리 안내 스마트 퀴즈",
    description: "속눈썹 연장 후 관리 방법을 안내하는 학습 콘텐츠",
    demoUrl: "/apps/eyelash-aftercare/index.html",
    thumbnail: "/apps/eyelash-aftercare/assets/thumbnail.png",
    category: "뷰티·건강",
  },
  {
    id: "pt-pilates-firstclass",
    title: "첫 수업 준비 스마트 안내",
    description: "첫 수업 준비물·주의사항을 안내하는 PT·필라테스 콘텐츠",
    demoUrl: "/apps/pt-pilates-firstclass/index.html",
    thumbnail: "/apps/pt-pilates-firstclass/assets/thumbnail.png",
    category: "뷰티·건강",
  },
  // 안전·위생
  {
    id: "logistics-safety",
    title: "물류센터 안전수칙 스마트 퀴즈",
    description: "물류센터 안전수칙을 익히는 현장 안전 교육 콘텐츠",
    demoUrl: "/apps/logistics-safety/index.html",
    thumbnail: "/apps/logistics-safety/assets/thumbnail.png",
    category: "안전·위생",
  },
  {
    id: "food-manufacturing-hygiene",
    title: "식품위생·작업안전 스마트 안내",
    description: "식품위생·작업안전 수칙을 익히는 제조 현장 교육",
    demoUrl: "/apps/food-manufacturing-hygiene/index.html",
    thumbnail: "/apps/food-manufacturing-hygiene/assets/thumbnail.png",
    category: "안전·위생",
  },
  {
    id: "home-care-safety",
    title: "방문요양 안전수칙 스마트 안내",
    description: "방문요양 안전수칙을 익히는 돌봄 종사자 교육",
    demoUrl: "/apps/home-care-safety/index.html",
    thumbnail: "/apps/home-care-safety/assets/thumbnail.png",
    category: "안전·위생",
  },
  // 전문·생활서비스
  {
    id: "realestate-contract-checklist",
    title: "계약 전 체크리스트 스마트 안내",
    description: "계약 전 체크리스트를 익히는 부동산중개 교육 콘텐츠",
    demoUrl: "/apps/realestate-contract-checklist/index.html",
    thumbnail: "/apps/realestate-contract-checklist/assets/thumbnail.png",
    category: "전문·생활서비스",
  },
  {
    id: "moving-cleaning-guide",
    title: "서비스 이용 전후 안내 스마트 콘텐츠",
    description: "이사·청소·방역 서비스 이용 전후 안내 콘텐츠",
    demoUrl: "/apps/moving-cleaning-guide/index.html",
    thumbnail: "/apps/moving-cleaning-guide/assets/thumbnail.png",
    category: "전문·생활서비스",
  },
  {
    id: "it-security-habits",
    title: "정보보안 습관 만들기 스마트 퀴즈",
    description: "정보보안 습관을 익히는 IT 보안 교육 콘텐츠",
    demoUrl: "/apps/it-security-habits/index.html",
    thumbnail: "/apps/it-security-habits/assets/thumbnail.png",
    category: "전문·생활서비스",
  },
  {
    id: "new-employee-onboarding",
    title: "신입사원 온보딩 스마트 안내 퀴즈",
    description: "회사 핵심 정보를 익히는 신입사원 온보딩 콘텐츠",
    demoUrl: "/apps/new-employee-onboarding/index.html",
    thumbnail: "/apps/new-employee-onboarding/assets/thumbnail.png",
    category: "전문·생활서비스",
  },
];
