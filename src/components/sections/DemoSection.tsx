import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tier = "베이직" | "스탠다드" | "프리미엄";

interface DemoApp {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  appPath: string;
  tier: Tier;
}

// 티어별 배지 스타일
const TIER_STYLE: Record<Tier, { bg: string; color: string; border: string }> = {
  베이직: { bg: "rgba(241,245,249,0.95)", color: "#475569", border: "rgba(148,163,184,0.4)" },
  스탠다드: { bg: "rgba(238,242,255,0.95)", color: "#4f46e5", border: "rgba(99,102,241,0.35)" },
  프리미엄: { bg: "rgba(254,243,199,0.95)", color: "#b45309", border: "rgba(217,119,6,0.4)" },
};

// 윗줄: 누르면 아래로 열림 / 아랫줄: 누르면 위로 열림 — 가운데 공유 패널에서 플레이
// 컬럼 순서(좌→우): 베이직 · 스탠다드 · 프리미엄
const TOP_ROW: DemoApp[] = [
  {
    id: "draw-flags-world-tour",
    title: "국기 그려서 세계일주",
    description:
      "여러 나라의 국기를 직접 그려보며 세계 여러 나라를 여행하듯 익혀요.",
    thumbnail: "/apps/draw-flags-world-tour/assets/thumbnail_512.webp",
    appPath: "/apps/draw-flags-world-tour/index.html",
    tier: "베이직",
  },
  {
    id: "tap-tap-3d",
    title: "3D 탭탭",
    description:
      "3D 공간에서 블록을 탭해 맞추는 입체 감각 트레이닝 게임이에요.",
    thumbnail: "/apps/tap-tap-3d/assets/thumbnail_512.webp",
    appPath: "/apps/tap-tap-3d/index.html",
    tier: "스탠다드",
  },
  {
    id: "history-of-it-and-ai",
    title: "금쪽같은 내 AI 역사",
    description:
      "IT와 AI의 발전 과정을 인터랙티브하게 따라가 보는 학습 콘텐츠입니다.",
    thumbnail: "/apps/history-of-it-and-ai/assets/thumbnail_512.webp",
    appPath: "/apps/history-of-it-and-ai/index.html",
    tier: "프리미엄",
  },
];

const BOTTOM_ROW: DemoApp[] = [
  {
    id: "arithmetic-playground",
    title: "딩동댕 사칙연산",
    description:
      "6~10세 어린이를 위한 사칙연산 연습 게임. 직접 풀어보며 익혀요.",
    thumbnail: "/apps/arithmetic-playground/assets/thumbnail.png",
    appPath: "/apps/arithmetic-playground/index.html",
    tier: "베이직",
  },
  {
    id: "village-of-100-people",
    title: "100명이 사는 마을",
    description:
      "전 세계와 한국을 100명이 사는 마을로 비유해 인구·통계를 한눈에 살펴봐요.",
    thumbnail: "/apps/village-of-100-people/assets/thumbnail_512.webp",
    appPath: "/apps/village-of-100-people/index.html",
    tier: "스탠다드",
  },
  {
    id: "mineral-resources-dashboard-v3",
    title: "지하자원 대시보드",
    description:
      "세계 각국의 지하·천연자원 생산 현황과 시뮬레이션을 직접 조작해보세요.",
    thumbnail: "/apps/mineral-resources-dashboard-v3/assets/thumbnail_512.webp",
    appPath: "/apps/mineral-resources-dashboard-v3/index.html",
    tier: "프리미엄",
  },
];

const ALL_APPS = [...TOP_ROW, ...BOTTOM_ROW];

function AppCard({
  app,
  isActive,
  onClick,
}: {
  app: DemoApp;
  isActive: boolean;
  onClick: () => void;
}) {
  const tier = TIER_STYLE[app.tier];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative w-full text-left focus:outline-none"
    >
      {/* 썸네일 */}
      <div
        className="relative rounded-2xl overflow-hidden border-2 transition-all duration-300"
        style={{
          borderColor: isActive ? "#6366f1" : "transparent",
          boxShadow: isActive
            ? "0 0 0 4px rgba(99,102,241,0.15), 0 8px 32px rgba(99,102,241,0.2)"
            : "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={app.thumbnail}
            alt={app.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          {/* 오버레이 */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
            style={{
              background: isActive
                ? "rgba(99,102,241,0.12)"
                : "rgba(0,0,0,0)",
            }}
          >
            {!isActive && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full px-4 py-2 text-sm font-semibold text-indigo-600 shadow-lg flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                체험하기
              </div>
            )}
            {isActive && (
              <div className="bg-indigo-600 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                실행 중
              </div>
            )}
          </div>
        </div>

        {/* 티어 배지 */}
        <div className="absolute top-3 left-3">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border"
            style={{ background: tier.bg, color: tier.color, borderColor: tier.border }}
          >
            {app.tier}
          </span>
        </div>
      </div>

      {/* 텍스트 */}
      <div className="mt-3 px-1">
        <h3
          className="font-bold text-base transition-colors duration-200"
          style={{ color: isActive ? "#6366f1" : "#111827" }}
        >
          {app.title}
        </h3>
        <p className="text-sm text-gray-500 mt-0.5 leading-snug">
          {app.description}
        </p>
      </div>
    </motion.button>
  );
}

function PlayPanel({
  app,
  fromBottom,
  onClose,
}: {
  app: DemoApp;
  fromBottom: boolean;
  onClose: () => void;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  return (
    <motion.div
      key={app.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="overflow-hidden"
      // 윗줄은 아래로, 아랫줄은 위로 펼쳐지는 느낌
      style={{ transformOrigin: fromBottom ? "bottom" : "top" }}
    >
      <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
        {/* 패널 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#f0f0f0] border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
              />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 border border-gray-300 text-[11px] text-gray-500">
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              typingedu.com/demo/{app.id}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">{app.title}</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* iframe 영역 */}
        <div className="relative bg-gray-50" style={{ height: "70vh", minHeight: 480 }}>
          {!iframeLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50 z-10">
              <div className="w-10 h-10 rounded-full border-3 border-indigo-200 border-t-indigo-600 animate-spin" style={{ borderWidth: 3 }} />
              <span className="text-sm text-gray-400">앱 불러오는 중...</span>
            </div>
          )}
          <iframe
            key={app.id}
            src={app.appPath}
            title={app.title}
            className="w-full h-full border-0"
            onLoad={() => setIframeLoaded(true)}
            allow="autoplay"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function DemoSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeApp = ALL_APPS.find((a) => a.id === activeId) ?? null;
  const activeInBottom = BOTTOM_ROW.some((a) => a.id === activeId);

  function handleCardClick(app: DemoApp) {
    setActiveId((cur) => (cur === app.id ? null : app.id));
  }

  useEffect(() => {
    if (activeId && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  }, [activeId]);

  function renderRow(apps: DemoApp[], offset: number) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (offset + i) * 0.08 }}
          >
            <AppCard
              app={app}
              isActive={activeId === app.id}
              onClick={() => handleCardClick(app)}
            />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            LIVE DEMO
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            직접 체험해보세요
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            썸네일을 클릭하면 실제 교구가 바로 실행됩니다.
          </p>
        </motion.div>

        {/* 윗줄 — 누르면 아래(가운데 패널)로 열림 */}
        {renderRow(TOP_ROW, 0)}

        {/* 가운데 공유 플레이 패널 (윗줄/아랫줄 모두 동일한 위치에서 실행) */}
        <AnimatePresence mode="wait">
          {activeApp && (
            <div ref={panelRef} className="my-8">
              <PlayPanel
                app={activeApp}
                fromBottom={activeInBottom}
                onClose={() => setActiveId(null)}
              />
            </div>
          )}
        </AnimatePresence>

        {/* 패널이 닫혀 있을 때 두 줄 간격 유지 */}
        {!activeApp && <div className="h-8" />}

        {/* 아랫줄 — 누르면 위(가운데 패널)로 열림 */}
        {renderRow(BOTTOM_ROW, TOP_ROW.length)}
      </div>
    </section>
  );
}
