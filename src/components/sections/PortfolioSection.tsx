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
  const sectionRef = useRef<HTMLElement>(null);

  // 외부(플로팅 위젯 등)에서 데모 열기 요청
  useEffect(() => {
    function onOpenDemo(e: Event) {
      setIframeLoaded(false);
      setActiveId((e as CustomEvent<string>).detail);
    }
    window.addEventListener("open-portfolio-demo", onOpenDemo);
    return () => window.removeEventListener("open-portfolio-demo", onOpenDemo);
  }, []);

  // 열려 있을 때 Esc로 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!activeId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeId]);

  const activeItem = PORTFOLIO_ITEMS.find((p) => p.id === activeId) ?? null;

  function openDemo(id: string, hasDemo: boolean) {
    if (!hasDemo) return;
    setIframeLoaded(false);
    setActiveId(id);
  }

  function renderCard(item: (typeof PORTFOLIO_ITEMS)[number], i: number) {
    const hasDemo = !!item.demoUrl;
    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (i % 3) * 0.1 }}
        onClick={() => openDemo(item.id, hasDemo)}
        className={`group flex flex-col ${hasDemo ? "cursor-pointer" : "cursor-default opacity-60"}`}
      >
        {/* 사진틀 — 클릭하면 이 자리에서 빨려나오듯 모달로 확대 (layoutId 공유) */}
        <motion.div
          layoutId={`demo-${item.id}`}
          className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100"
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

          {hasDemo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/25">
              <div className="flex translate-y-1 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-primary-600 opacity-0 shadow-lg transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                체험하기
              </div>
            </div>
          )}

          {!hasDemo && (
            <div className="absolute right-3 top-3 rounded-full bg-gray-900/70 px-2.5 py-0.5 text-xs font-medium text-white">
              준비 중
            </div>
          )}
        </motion.div>

        {/* 이미지 아래 정보 (반응형 텍스트) */}
        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">{item.tags.join(" · ")}</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <h3 className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold text-gray-900">{item.title}</h3>
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider ${TIER_BADGE[item.tier]}`}>
              {TIER_LABEL[item.tier]}
            </span>
          </div>
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

  return (
    <section id="portfolio" className="py-24" ref={sectionRef}>
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        {/* 헤더 (lusion 'Featured Work' 스타일) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Portfolio</span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            완성된 콘텐츠를
            <br className="hidden sm:block" /> 직접 체험해 보세요.
          </h2>
          <p className="mt-4 max-w-2xl text-[clamp(1rem,1.4vw,1.25rem)] text-gray-600">
            카드를 클릭하면 실제 콘텐츠가 바로 실행됩니다.
          </p>
        </motion.div>

        {/* 3개씩 2줄 그리드 */}
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {PORTFOLIO_ITEMS.map((item, i) => renderCard(item, i))}
        </div>
      </div>

      {/* macOS 스타일 데모 — 카드 자리에서 빨려나오듯 열리고, 닫으면 제자리로 빨려들어감 */}
      <AnimatePresence>
        {activeItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveId(null)}
              className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
            />
            <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8">
              <motion.div
                layoutId={`demo-${activeItem.id}`}
                className="pointer-events-auto relative h-[82vh] w-[94vw] max-w-[1200px] overflow-hidden rounded-2xl bg-black shadow-2xl"
              >
                {/* 확대 애니메이션 동안 썸네일이 보이고, 로드되면 플레이 화면으로 */}
                {activeItem.thumbnail && (
                  <img
                    src={activeItem.thumbnail}
                    alt={activeItem.title}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      iframeLoaded ? "opacity-0" : "opacity-100"
                    }`}
                  />
                )}

                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/40">
                    <div
                      className="h-10 w-10 animate-spin rounded-full border-gray-600 border-t-primary-400"
                      style={{ borderWidth: 3, borderStyle: "solid" }}
                    />
                    <span className="text-sm text-white/70">앱 불러오는 중...</span>
                  </div>
                )}

                {/* 딱 플레이 화면만 (브라우저 크롬 없음) */}
                <iframe
                  key={activeItem.id}
                  src={activeItem.demoUrl}
                  title={activeItem.title}
                  className="absolute inset-0 h-full w-full border-0"
                  onLoad={() => setIframeLoaded(true)}
                  allow="autoplay"
                />

                {/* 닫기 */}
                <button
                  onClick={() => setActiveId(null)}
                  aria-label="닫기"
                  className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
