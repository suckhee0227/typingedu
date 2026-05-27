import { motion, type Variants } from "framer-motion";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 헤드라인이 토큰 단위로 하나씩 "이뤄지다가" 완성되는 등장 애니메이션
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
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

// 강조 단어 (라이트 배경용 — 프라이머리 컬러 + 밑줄 호버)
function Highlight({ children }: { children: string }) {
  return (
    <motion.span
      variants={token}
      whileHover={{ scale: 1.06 }}
      className="relative mr-[0.25em] inline-block cursor-default"
    >
      <span className="relative z-10 text-primary-600">{children}</span>
      <span className="absolute inset-x-0 bottom-0.5 h-3 origin-left -z-0 rounded bg-primary-200/70" />
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

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col bg-[#f4f3fb] px-3 pb-3 pt-20 sm:px-4 sm:pt-24"
    >
      {/* 상단 텍스트 영역 (라이트 배경, 다크 텍스트) */}
      <div className="mx-auto mb-5 w-full max-w-7xl px-2 sm:mb-7 sm:px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5 inline-flex flex-wrap items-center gap-2"
        >
          <span className="rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-semibold tracking-wide text-white">
            맞춤형 스마트 교구 제작
          </span>
          {["#교구", "#학습용", "#기업 내부 교육용", "#개인 교습용", "#대형 학원용", "#Gamification", "#시각화"].map(
            (tag) => (
              <span
                key={tag}
                className="rounded-md border border-primary-100 bg-primary-50 px-2.5 py-1 text-xs font-medium text-primary-700"
              >
                {tag}
              </span>
            )
          )}
        </motion.div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* 헤드라인 — 토큰이 하나씩 등장해 기존 문구로 완성 */}
          <motion.h1
            variants={headlineContainer}
            initial="hidden"
            animate="show"
            className="text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
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

          {/* 설명 + CTA (오른쪽) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="lg:max-w-sm lg:text-right"
          >
            <p className="text-base leading-relaxed text-gray-600 sm:text-lg">
              특허 출원한 자체 개발 엔진으로 외주대비 비용 90% 절감. 콘텐츠 시각화를 통한 몰입도 향상.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:justify-end">
              <button
                onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
                className="rounded-xl bg-primary-600 px-6 py-3.5 text-center text-base font-bold text-white transition-colors hover:bg-primary-700"
              >
                무료 상담 신청
              </button>
              <a
                href="#portfolio"
                className="rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-center text-base font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                데모 체험하기
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 유체 "사진틀" — 둥근 프레임 안에 마우스 반응 유체가 꽉 참 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto min-h-[42vh] w-full max-w-[1600px] flex-1 overflow-hidden rounded-[1.75rem] bg-[#0a1030] shadow-[0_30px_80px_-20px_rgba(30,30,80,0.35)]"
      >
        {isMobile ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />
        ) : (
          <Suspense fallback={<div className="absolute inset-0 bg-[#0a1030]" />}>
            <FluidCanvas />
          </Suspense>
        )}

        {/* 프레임 하단: 통계 + 스크롤 힌트 (포인터 통과 → 유체 반응 유지) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 sm:p-8">
          <div className="grid grid-cols-3 gap-6 sm:gap-10">
            {[
              { value: "90%", label: "비용 절감" },
              { value: "1주", label: "제작 기간" },
              { value: "0%", label: "소통 로스" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</div>
                <div className="mt-0.5 text-xs text-white/60 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-xs tracking-widest text-white/50 sm:flex">
            SCROLL TO EXPLORE
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
