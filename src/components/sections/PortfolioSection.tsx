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

// 배지 표시용 영문 라벨 (내부 데이터 키는 한글 유지)
const TIER_LABEL: Record<Tier, string> = {
  베이직: "BASIC",
  스탠다드: "STANDARD",
  프리미엄: "PREMIUM",
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
        className={`group flex flex-col ${hasDemo ? "cursor-pointer" : "cursor-default opacity-60"}`}
      >
        {/* 사진틀 (테두리 없는 둥근 이미지 프레임) */}
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 transition-all duration-300 ${
            isActive ? "ring-2 ring-primary-500 ring-offset-2" : ""
          }`}
        >
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-5xl">{item.id === "it-ai-history" ? "🤖" : "⌨️"}</span>
            </div>
          )}

          {/* 호버 오버레이 */}
          {hasDemo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
              <div
                className={`flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-lg transition-all duration-200 ${
                  isActive ? "opacity-100" : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                }`}
              >
                {isActive ? (
                  <>
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary-500" />
                    실행 중
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            <div className="absolute right-3 top-3 rounded-full bg-gray-900/70 px-2.5 py-0.5 text-xs font-medium text-white">
              준비 중
            </div>
          )}
        </div>

        {/* 이미지 아래 정보 (박스 없이) */}
        <div className="mt-4">
          {/* 태그를 lusion식 점 구분 대문자 라인으로 */}
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
            {item.tags.join(" · ")}
          </p>

          <div className="mt-1.5 flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-gray-900 sm:text-2xl">{item.title}</h3>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${TIER_BADGE[item.tier]}`}>
              {TIER_LABEL[item.tier]}
            </span>
          </div>

          {/* 설명은 한 줄로 통일해 카드 높이 일관성 유지 */}
          <p className="mt-1.5 line-clamp-1 text-sm leading-relaxed text-gray-500">{item.description}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="font-black text-primary-600">{item.priceDisplay}</span>
            <span className="text-gray-300">·</span>
            <span className="font-semibold text-gray-600">{item.period}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  function renderRow(start: number, end: number) {
    return (
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {PORTFOLIO_ITEMS.slice(start, end).map((item, i) => renderCard(item, start + i))}
      </div>
    );
  }

  return (
    <section id="portfolio" className="py-24" ref={sectionRef}>
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">

        {/* 헤더 (lusion 'Featured Work' 스타일 — 좌측 정렬 큰 타이틀) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
            Portfolio
          </span>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            완성된 콘텐츠를
            <br className="hidden sm:block" /> 직접 체험해 보세요.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
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
