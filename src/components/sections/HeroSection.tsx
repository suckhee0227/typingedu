import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 첫 헤드라인이 토큰 단위로 하나씩 "이뤄지다가" 완성되는 등장 애니메이션
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
};
const token: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

// 강조 단어 (흰 배경 위 — 프라이머리 컬러, 밑줄 없음, 반응형은 부모 폰트크기 따라감)
function Highlight({ children }: { children: string }) {
  return (
    <motion.span
      variants={token}
      whileHover={{ scale: 1.05 }}
      className="mr-[0.25em] inline-block cursor-default text-primary-600"
    >
      {children}
    </motion.span>
  );
}

function Word({ children }: { children: string }) {
  return (
    <motion.span variants={token} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export default function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 흰 화면(텍스트만) → 스크롤하면 유체가 떠오르고 헤드라인이 교차
  const fluidOpacity = useTransform(scrollYProgress, [0.05, 0.5], [0, 1]);
  const h1Opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const h1Y = useTransform(scrollYProgress, [0, 0.35], ["0%", "-25%"]);
  const h2Opacity = useTransform(scrollYProgress, [0.4, 0.72], [0, 1]);
  const h2Y = useTransform(scrollYProgress, [0.4, 0.72], ["25%", "0%"]);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        {/* 유체 레이어 — 처음엔 안 보이다가 스크롤하면 떠오름 */}
        <motion.div style={{ opacity: fluidOpacity }} className="absolute inset-0 bg-[#0a1030]">
          {isMobile ? (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />
          ) : (
            <Suspense fallback={<div className="absolute inset-0 bg-[#0a1030]" />}>
              <FluidCanvas />
            </Suspense>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/30" />
        </motion.div>

        {/* 콘텐츠 (포인터 통과 → 유체 반응, 버튼만 클릭) */}
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pb-10 pt-24 sm:px-10 sm:pb-14">
          {/* 헤드라인: 흰 배경의 기존 카피 ↔ 유체 위 "대담한 교육..." */}
          <div className="grid">
            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              style={{ opacity: h1Opacity, y: h1Y }}
              className="col-start-1 row-start-1 text-[clamp(2.25rem,6vw,4.75rem)] font-bold leading-[1.1] tracking-tight text-gray-900"
            >
              <Word>우리</Word>
              <Word>기관의</Word>
              <Word>교육</Word>
              <Word>철학</Word>
              <Word>그대로,</Word>
              <br />
              <Highlight>1/10 비용</Highlight>
              <Word>으로</Word>
              <br />
              <Highlight>단 1주</Highlight>
              <Word>만에</Word>
              <Word>완성</Word>
            </motion.h1>

            <motion.h2
              style={{ opacity: h2Opacity, y: h2Y }}
              className="col-start-1 row-start-1 text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[1.04] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            >
              대담한 교육,
              <br />
              살아 움직이게.
            </motion.h2>
          </div>

          {/* 하단: 통계 + 설명·CTA (스크롤로 유체와 함께 등장) */}
          <motion.div
            style={{ opacity: h2Opacity }}
            className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
          >
            <div className="grid grid-cols-3 gap-6 sm:gap-10">
              {[
                { value: "90%", label: "비용 절감" },
                { value: "1주", label: "제작 기간" },
                { value: "0%", label: "소통 로스" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-[clamp(1.4rem,2.4vw,2rem)] font-bold text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-white/60 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="sm:max-w-sm sm:text-right">
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                특허 출원한 자체 개발 엔진으로 외주대비 비용 90% 절감. 콘텐츠 시각화를 통한 몰입도 향상.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
                  className="pointer-events-auto rounded-xl bg-white px-6 py-3 text-center text-base font-bold text-primary-600 transition-colors hover:bg-gray-100"
                >
                  무료 상담 신청
                </button>
                <a
                  href="#portfolio"
                  className="pointer-events-auto rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  데모 체험하기
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 스크롤 힌트 (흰 화면일 때만) */}
        <motion.div
          style={{ opacity: scrollHintOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-1 text-xs tracking-widest text-gray-400"
        >
          SCROLL
          <span className="animate-bounce">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
