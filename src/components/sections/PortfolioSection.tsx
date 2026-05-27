import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_ITEMS } from "../../lib/constants";
import type { Tier } from "../../types";

// 티어 배지 스타일 (베이직 · 스탠다드 · 프리미엄)
const TIER_BADGE: Record<Tier, string> = {
  베이직: "bg-slate-100 text-slate-600",
  스탠다드: "bg-primary-100 text-primary-700",
  프리미엄: "bg-gradient-to-r from-primary-500 to-primary-700 text-white",
};

export default function PortfolioSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onOpenDemo(e: Event) {
      const id = (e as CustomEvent<string>).detail;
      setIframeLoaded(false);
      setActiveId(id);
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
    window.addEventListener("open-portfolio-demo", onOpenDemo);
    return () => window.removeEventListener("open-portfolio-demo", onOpenDemo);
  }, []);

  const activeItem = PORTFOLIO_ITEMS.find((p) => p.id === activeId) ?? null;

  function handleCardClick(id: string, hasDemoUrl: boolean) {
    if (!hasDemoUrl) return;
    if (activeId === id) {
      setActiveId(null);
    } else {
      setIframeLoaded(false);
      setActiveId(id);
    }
  }

  useEffect(() => {
    if (activeId && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
    }
  }, [activeId]);

  // 활성 카드가 아랫줄(인덱스 3~5)이면 패널이 위로 펼쳐지는 느낌
  const activeIndex = PORTFOLIO_ITEMS.findIndex((p) => p.id === activeId);
  const activeFromBottom = activeIndex >= 3;

  function renderCard(item: (typeof PORTFOLIO_ITEMS)[number], i: number) {
    const hasDemo = !!item.demoUrl;
    const isActive = activeId === item.id;
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (i % 3) * 0.1 }}
        onClick={() => handleCardClick(item.id, hasDemo)}
        className={`group rounded-2xl border-2 transition-all overflow-hidden flex flex-col ${
          hasDemo ? "cursor-pointer" : "cursor-default opacity-60"
        } ${
          isActive
            ? "border-primary-400 shadow-lg shadow-primary-100"
            : "border-gray-100 hover:border-primary-300 hover:shadow-md"
        }`}
      >
        {/* 썸네일 */}
        <div className="aspect-[4/3] bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl">
                {item.id === "it-ai-history" ? "🤖" : "⌨️"}
              </span>
            </div>
          )}

          {/* 호버 오버레이 */}
          {hasDemo && (
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className={`transition-all duration-200 bg-white/90 rounded-full px-4 py-2 text-sm font-semibold text-primary-600 shadow flex items-center gap-2 ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                {isActive ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                    실행 중
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    체험하기
                  </>
                )}
              </div>
            </div>
          )}

          {!hasDemo && (
            <div className="absolute top-2 right-2 bg-gray-500/80 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              준비 중
            </div>
          )}
        </div>

        {/* 카드 내용 */}
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-gray-900 mb-0.5 flex items-center gap-2">
            {item.title}
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md tracking-wide ${TIER_BADGE[item.tier]}`}>
              {item.tier}
            </span>
          </h3>
          <p className="text-sm text-gray-500 mb-2 flex-1">{item.description}</p>

          {/* 가격 / 기간 */}
          <div className="rounded-xl overflow-hidden border border-gray-100 mb-2">
            <div className="grid grid-cols-2 text-center text-xs font-semibold bg-gray-50 py-1 border-b border-gray-100">
              <span className="text-gray-400">가격</span>
              <span className="text-gray-400">기간</span>
            </div>
            <div className="grid grid-cols-2 text-center py-2 bg-white">
              <span className="text-sm font-black text-primary-600 self-center">{item.priceDisplay}</span>
              <span className="text-sm font-bold text-gray-700 self-center">{item.period}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-primary-50 text-primary-600 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  function renderRow(start: number, end: number) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {PORTFOLIO_ITEMS.slice(start, end).map((item, i) => renderCard(item, start + i))}
      </div>
    );
  }

  return (
    <section id="portfolio" className="py-24" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            완성된 콘텐츠를 직접 체험해 보세요.
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            카드를 클릭하면 실제 콘텐츠가 바로 실행됩니다.
          </p>
        </motion.div>

        {/* 윗줄 (베이직 · 스탠다드 · 프리미엄) — 누르면 아래 가운데 패널로 열림 */}
        {renderRow(0, 3)}

        {/* 가운데 공유 패널 — 윗줄/아랫줄 모두 동일한 위치에서 실행 */}
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              ref={panelRef}
              key={activeItem.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden my-8"
              style={{ transformOrigin: activeFromBottom ? "bottom" : "top" }}
            >
              <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-2xl">
                {/* 브라우저 크롬 바 */}
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
                      <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      typingedu.com/demo/{activeItem.id}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium hidden sm:block">{activeItem.title}</span>
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
                <div className="relative bg-gray-900" style={{ height: "72vh", minHeight: 500 }}>
                  {!iframeLoaded && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-900 z-10">
                      <div
                        className="w-10 h-10 rounded-full border-t-primary-500 border-gray-700 animate-spin"
                        style={{ borderWidth: 3, borderStyle: "solid" }}
                      />
                      <span className="text-sm text-gray-400">앱 불러오는 중...</span>
                    </div>
                  )}
                  <iframe
                    key={activeItem.id}
                    src={activeItem.demoUrl}
                    title={activeItem.title}
                    className="w-full h-full border-0"
                    onLoad={() => setIframeLoaded(true)}
                    allow="autoplay"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 패널이 닫혀 있을 때 두 줄 간격 유지 */}
        {!activeItem && <div className="h-8" />}

        {/* 아랫줄 (베이직 · 스탠다드 · 프리미엄) — 누르면 위 가운데 패널로 열림 */}
        {renderRow(3, 6)}
      </div>
    </section>
  );
}
