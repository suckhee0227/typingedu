import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PORTFOLIO_ITEMS } from "../../lib/constants";
import type { Tier } from "../../types";

const TIER_BADGE: Record<Tier, string> = {
  베이직: "bg-slate-100 text-slate-600",
  스탠다드: "bg-primary-100 text-primary-700",
  프리미엄: "bg-gradient-to-r from-primary-500 to-primary-700 text-white",
};

const TIER_LABEL: Record<Tier, string> = {
  베이직: "BASIC",
  스탠다드: "STANDARD",
  프리미엄: "PREMIUM",
};

// 제목이 슬롯/잭팟처럼 글자별로 아래에서 튀어 올라 제자리에 맞춰짐
const slotContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.035 } } };
const slotChar: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 480, damping: 20 } },
};
function SlotHeading({ text, className }: { text: string; className?: string }) {
  return (
    <motion.h3
      variants={slotContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-40px" }}
      className={`inline-flex overflow-hidden ${className ?? ""}`}
    >
      {Array.from(text).map((c, i) => (
        <motion.span key={i} variants={slotChar} className="inline-block" style={{ whiteSpace: "pre" }}>
          {c}
        </motion.span>
      ))}
    </motion.h3>
  );
}

export default function PortfolioSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openDone, setOpenDone] = useState(false); // 열림(왜곡) 애니메이션 끝나면 iframe 로드
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onOpenDemo(e: Event) {
      setOpenDone(false);
      setIframeLoaded(false);
      setInteracting(false);
      setActiveId((e as CustomEvent<string>).detail);
    }
    window.addEventListener("open-portfolio-demo", onOpenDemo);
    return () => window.removeEventListener("open-portfolio-demo", onOpenDemo);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 열면 iframe 로드(지니 변형 후) + 열리는 창으로 자동 스크롤 (Lenis로 확실히)
  useEffect(() => {
    if (!activeId) return;
    const t1 = setTimeout(() => setOpenDone(true), 640);
    const t2 = setTimeout(() => {
      const el = panelRef.current;
      if (!el) return;
      const lenis = (window as unknown as {
        __lenis?: { scrollTo: (t: Element | number, o?: { offset?: number; duration?: number }) => void };
      }).__lenis;
      if (lenis) lenis.scrollTo(el, { offset: -90, duration: 0.9 });
      else el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeId]);

  const activeItem = PORTFOLIO_ITEMS.find((p) => p.id === activeId) ?? null;
  const activeIndex = PORTFOLIO_ITEMS.findIndex((p) => p.id === activeId);
  // 지니가 클릭한 카드 방향(컬럼·줄)으로 빨려들도록 변형 기준점 설정
  const col = activeIndex % 3;
  const genieOrigin = `${col === 0 ? "14%" : col === 2 ? "86%" : "50%"} ${activeIndex >= 3 ? "100%" : "0%"}`;
  const genieSkewX = col === 2 ? -14 : 14;

  function openDemo(id: string, hasDemo: boolean) {
    if (!hasDemo) return;
    setActiveId((prev) => (prev === id ? null : id));
    setOpenDone(false);
    setIframeLoaded(false);
    setInteracting(false);
  }

  function renderCard(item: (typeof PORTFOLIO_ITEMS)[number], i: number) {
    const hasDemo = !!item.demoUrl;
    const isActive = activeId === item.id;
    return (
      <motion.div
        key={item.id}
        // 루션식 등장: 옆에서 살짝 찌그러지며(skew) 올라옴
        initial={{ opacity: 0, x: 48, skewX: -5, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, skewX: 0, scale: 1 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => openDemo(item.id, hasDemo)}
        className={`group flex flex-col ${hasDemo ? "cursor-pointer" : "cursor-default opacity-60"}`}
      >
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 transition-shadow duration-300 ${
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
            <div className="absolute right-3 top-3 z-10 rounded-full bg-gray-900/70 px-2.5 py-0.5 text-xs font-medium text-white">
              준비 중
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">{item.tags.join(" · ")}</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <SlotHeading text={item.title} className="text-[clamp(1.15rem,1.6vw,1.6rem)] font-bold text-gray-900" />
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

  function renderRow(start: number, end: number) {
    return (
      <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
        {PORTFOLIO_ITEMS.slice(start, end).map((item, i) => renderCard(item, start + i))}
      </div>
    );
  }

  // 데모 창 — 카드 썸네일이 layoutId로 이 창에 빨려나오듯 모핑(맥북 지니), 닫으면 카드 자리로 빨려들어감
  const panel = (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          ref={panelRef}
          key={activeItem.id}
          // 맥북 지니: 클릭한 카드 방향으로 휘며(skew) 비대칭 축소되어 빨려듦/빨려나옴
          initial={{ scaleX: 0.12, scaleY: 0.06, skewX: genieSkewX, skewY: 6, opacity: 0 }}
          animate={{ scaleX: 1, scaleY: 1, skewX: 0, skewY: 0, opacity: 1 }}
          exit={{ scaleX: 0.12, scaleY: 0.06, skewX: genieSkewX, skewY: 6, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ height: "72vh", transformOrigin: genieOrigin }}
          className="relative my-8 overflow-hidden rounded-3xl bg-black shadow-2xl"
        >
          {/* 빨려드는 동안 보이는 썸네일 — object-fill로 휘며 뭉개짐(검은화면 X). 로드되면 가려짐 */}
          {activeItem.thumbnail && (
            <img
              src={activeItem.thumbnail}
              alt={activeItem.title}
              className={`absolute inset-0 h-full w-full object-fill transition-opacity duration-300 ${
                iframeLoaded ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {openDone && !iframeLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/30">
              <div className="h-10 w-10 animate-spin rounded-full border-gray-600 border-t-primary-400" style={{ borderWidth: 3, borderStyle: "solid" }} />
              <span className="text-sm text-white/70">앱 불러오는 중...</span>
            </div>
          )}

          {/* 모핑이 끝난 뒤에만 iframe 로드 → 펼쳐지는 이미지가 또렷이 보임. 클릭 전엔 휠 통과(자유 스크롤) */}
          {openDone && (
            <iframe
              src={activeItem.demoUrl}
              title={activeItem.title}
              className={`absolute inset-0 h-full w-full border-0 ${interacting ? "" : "pointer-events-none"}`}
              onLoad={() => setIframeLoaded(true)}
              allow="autoplay"
            />
          )}

          {iframeLoaded && !interacting && (
            <button
              onClick={() => setInteracting(true)}
              className="group absolute inset-0 z-10 flex items-end justify-center bg-transparent pb-8"
              aria-label="클릭하여 체험"
            >
              <span className="rounded-full bg-black/55 px-4 py-2 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors group-hover:bg-black/70">
                ▶ 클릭하여 체험 · 스크롤은 자유롭게
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveId(null)}
            aria-label="닫기"
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section id="portfolio" className="py-24" ref={sectionRef}>
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center sm:mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Portfolio</span>
          <h2 className="mt-3 text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-gray-900">
            완성된 콘텐츠를
            <br className="hidden sm:block" /> 직접 체험해 보세요.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[clamp(1rem,1.4vw,1.25rem)] text-gray-600">
            카드를 클릭하면 실제 콘텐츠가 바로 실행됩니다.
          </p>
        </motion.div>

        {renderRow(0, 3)}

        {/* 두 줄 사이 데모 창 — 클릭한 카드 자리에서 모핑되어 펼쳐지고 닫으면 그 자리로 빨려들어감 */}
        {panel}
        {!activeItem && <div className="h-8" />}

        {renderRow(3, 6)}
      </div>
    </section>
  );
}
