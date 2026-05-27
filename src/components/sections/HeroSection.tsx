import { motion, type Variants } from "framer-motion";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 헤드라인이 토큰 단위로 하나씩 "이뤄지다가" 완성되는 등장 애니메이션
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.35 } },
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

// 노란 하이라이트 단어 (기존 디자인 유지 + 호버 효과)
function Highlight({ children }: { children: string }) {
  return (
    <motion.span
      variants={token}
      whileHover={{ scale: 1.08 }}
      className="relative mr-[0.25em] inline-block cursor-default"
    >
      <span className="relative z-10 text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.5)] transition-all duration-200 hover:drop-shadow-[0_0_32px_rgba(253,224,71,0.9)]">
        {children}
      </span>
      <span className="absolute inset-x-0 -bottom-0.5 h-1.5 origin-left scale-x-0 rounded-full bg-yellow-400/30 transition-transform duration-200 hover:scale-x-100" />
    </motion.span>
  );
}

// 일반 단어 토큰
function Word({ children }: { children: string }) {
  return (
    <motion.span variants={token} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

export default function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background: 마우스 따라 물이 번지는 유체 (모바일은 그라데이션 폴백) */}
      {isMobile ? (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500" />
      ) : (
        <Suspense
          fallback={<div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />}
        >
          <FluidCanvas />
        </Suspense>
      )}

      {/* 가독성용 어둡게 오버레이 (포인터는 통과시켜 유체 반응 유지) */}
      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      {/* Content (포인터 통과 → 유체가 반응. 버튼/링크만 클릭 가능) */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 inline-flex flex-wrap items-center gap-2"
          >
            <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm">
              맞춤형 스마트 교구 제작
            </span>
            {["#교구", "#학습용", "#기업 내부 교육용", "#개인 교습용", "#대형 학원용", "#Gamification", "#시각화"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-yellow-300/40 bg-yellow-400/20 px-2.5 py-1 text-xs font-medium text-yellow-200"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>

          {/* 헤드라인 — 토큰이 하나씩 등장해 기존 문구로 완성 */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate="show"
            className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
            className="mb-8 text-lg leading-relaxed text-white/80 sm:text-xl"
          >
            특허 출원한 자체 개발 엔진으로 외주대비 비용 90% 절감.
            <br />
            콘텐츠 시각화를 통한 몰입도 향상.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <button
              onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
              className="pointer-events-auto rounded-xl bg-white px-8 py-4 text-center text-lg font-bold text-primary-600 transition-colors hover:bg-gray-50"
            >
              무료 상담 신청
            </button>
            <a
              href="#portfolio"
              className="pointer-events-auto rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-center text-lg font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              데모 체험하기
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="mt-16 grid max-w-lg grid-cols-3 gap-8"
          >
            {[
              { value: "90%", label: "비용 절감" },
              { value: "1주", label: "제작 기간" },
              { value: "0%", label: "소통 로스" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
