import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoApp {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  appPath: string;
  tag: string;
}

// 그리드에 보여줄 총 슬롯 수 (실제 앱 + '곧 추가됩니다' 플레이스홀더)
const TOTAL_SLOTS = 6;

const DEMO_APPS: DemoApp[] = [
  {
    id: "mineral-resources-dashboard-v3",
    title: "지하자원 대시보드",
    description:
      "세계 각국의 지하·천연자원 생산 현황과 시뮬레이션을 직접 조작해보세요.",
    thumbnail: "/apps/mineral-resources-dashboard-v3/assets/thumbnail_512.webp",
    appPath: "/apps/mineral-resources-dashboard-v3/index.html",
    tag: "지리 · 사회",
  },
  {
    id: "arithmetic-playground",
    title: "딩동댕 사칙연산",
    description:
      "6~10세 어린이를 위한 사칙연산 연습 게임. 직접 풀어보며 익혀요.",
    thumbnail: "/apps/arithmetic-playground/assets/thumbnail.png",
    appPath: "/apps/arithmetic-playground/index.html",
    tag: "수학",
  },
  {
    id: "history-of-it-and-ai",
    title: "금쪽같은 내 AI 역사",
    description:
      "IT와 AI의 발전 과정을 인터랙티브하게 따라가 보는 학습 콘텐츠입니다.",
    thumbnail: "/apps/history-of-it-and-ai/assets/thumbnail_512.webp",
    appPath: "/apps/history-of-it-and-ai/index.html",
    tag: "사회 · IT",
  },
];

function AppCard({
  app,
  isActive,
  onClick,
}: {
  app: DemoApp;
  isActive: boolean;
  onClick: () => void;
}) {
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

        {/* 태그 */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-700 shadow-sm">
            {app.tag}
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

export default function DemoSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const activeApp = DEMO_APPS.find((a) => a.id === activeId) ?? null;

  function handleCardClick(app: DemoApp) {
    if (activeId === app.id) {
      setActiveId(null);
    } else {
      setIframeLoaded(false);
      setActiveId(app.id);
    }
  }

  useEffect(() => {
    if (activeId && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    }
  }, [activeId]);

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

        {/* 썸네일 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {DEMO_APPS.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <AppCard
                app={app}
                isActive={activeId === app.id}
                onClick={() => handleCardClick(app)}
              />
            </motion.div>
          ))}

          {/* 추가 예정 슬롯 — 총 6칸이 되도록 채움 */}
          {Array.from({ length: Math.max(0, TOTAL_SLOTS - DEMO_APPS.length) }).map((_, i) => (
            <motion.div
              key={`placeholder-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (DEMO_APPS.length + i) * 0.08 }}
              className="rounded-2xl border-2 border-dashed border-gray-200 aspect-video flex flex-col items-center justify-center text-gray-300 gap-2 hover:border-indigo-200 hover:text-indigo-300 transition-colors duration-200"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium">곧 추가됩니다</span>
            </motion.div>
          ))}
        </div>

        {/* 앱 실행 패널 */}
        <AnimatePresence>
          {activeApp && (
            <motion.div
              ref={panelRef}
              key={activeApp.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
                {/* 패널 헤더 */}
                <div className="flex items-center justify-between px-5 py-3 bg-[#f0f0f0] border-b border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setActiveId(null)}
                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
                      />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-md px-3 py-1 border border-gray-300 text-[11px] text-gray-500">
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      typingedu.com/demo/{activeApp.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">{activeApp.title}</span>
                    <button
                      onClick={() => setActiveId(null)}
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
                    key={activeApp.id}
                    src={activeApp.appPath}
                    title={activeApp.title}
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoaded(true)}
                    allow="autoplay"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
