import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { lazy, Suspense, useRef } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 첫 헤드라인이 토큰 단위로 하나씩 "이뤄지다가" 완성되는 등장 애니메이션
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

// 강조 단어 (어두운 유체 위 — 노란 하이라이트 + 호버)
function Highlight({ children }: { children: string }) {
  return (
    <motion.span
      variants={token}
      whileHover={{ scale: 1.06 }}
      className="relative mr-[0.25em] inline-block cursor-default"
    >
      <span className="relative z-10 text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.5)]">{children}</span>
      <span className="absolute inset-x-0 -bottom-0.5 h-1.5 origin-left rounded-full bg-yellow-400/30" />
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

  // 섹션을 스크롤하는 동안 프레임이 고정되고, 그 사이 헤드라인이 모핑됨
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 첫 헤드라인(기존 카피) → 두번째 헤드라인("대담한 교육, 살아 움직이게.")으로 교차
  const h1Opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const h1Y = useTransform(scrollYProgress, [0, 0.4], ["0%", "-30%"]);
  const h2Opacity = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);
  const h2Y = useTransform(scrollYProgress, [0.35, 0.7], ["30%", "0%"]);
  const supportOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[200vh] bg-[#f4f3fb] px-3 pb-3 pt-20 sm:px-4 sm:pt-24"
    >
      <div className="sticky top-20 sm:top-24">
        {/* 유체 "사진틀" — 둥근 프레임 안에 텍스트까지 모두 들어감 */}
        <div className="relative mx-auto h-[calc(100vh-6rem)] w-full max-w-[1600px] overflow-hidden rounded-[1.75rem] bg-[#0a1030] shadow-[0_30px_80px_-20px_rgba(30,30,80,0.35)]">
          {isMobile ? (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />
          ) : (
            <Suspense fallback={<div className="absolute inset-0 bg-[#0a1030]" />}>
              <FluidCanvas />
            </Suspense>
          )}

          {/* 가독성 그라데이션 (포인터 통과) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/30" />

          {/* 콘텐츠 오버레이 (포인터 통과 → 유체 반응, 버튼만 클릭 가능) */}
          <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 py-9 sm:px-10 sm:py-12">
            {/* 상단: 배지 + 모핑 헤드라인 */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ opacity: supportOpacity }}
                className="mb-5 inline-flex flex-wrap items-center gap-2"
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

              {/* 두 헤드라인을 같은 자리에 겹쳐서 스크롤로 교차 */}
              <div className="grid">
                <motion.h1
                  variants={headlineContainer}
                  initial="hidden"
                  animate="show"
                  style={{ opacity: h1Opacity, y: h1Y }}
                  className="col-start-1 row-start-1 text-4xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] sm:text-5xl lg:text-6xl"
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
                  className="col-start-1 row-start-1 text-5xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl"
                >
                  대담한 교육,
                  <br />
                  살아 움직이게.
                </motion.h2>
              </div>
            </div>

            {/* 하단: 통계(좌) + 설명·CTA(우) */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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

              <motion.div style={{ opacity: supportOpacity }} className="sm:max-w-sm sm:text-right">
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
