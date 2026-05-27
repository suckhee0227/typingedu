import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { lazy, Suspense, useRef, useEffect } from "react";
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

// 강조 단어 (유체 위 — 노란색, 밑줄 없음, 반응형은 부모 clamp 폰트 따라감)
function Highlight({ children }: { children: string }) {
  return (
    <motion.span
      variants={token}
      whileHover={{ scale: 1.05 }}
      className="mr-[0.25em] inline-block cursor-default text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.45)]"
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
  const sectionRef = useRef<HTMLElement>(null);

  // 스크롤 진행도를 직접 측정 (Lenis 부드러운 스크롤과 확실히 동기화)
  const progress = useMotionValue(0);
  useEffect(() => {
    let ticking = false;
    const compute = () => {
      const el = sectionRef.current;
      if (el) {
        const travel = el.offsetHeight - window.innerHeight;
        const p = travel > 0 ? -el.getBoundingClientRect().top / travel : 0;
        progress.set(Math.min(1, Math.max(0, p)));
      }
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    compute();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [progress]);

  // 기존 카피 → "대담한 교육, 살아 움직이게."로 교차
  const h1Opacity = useTransform(progress, [0, 0.32], [1, 0]);
  const h1Y = useTransform(progress, [0, 0.4], ["0%", "-12%"]);
  const h2Opacity = useTransform(progress, [0.42, 0.78], [0, 1]);
  const h2Y = useTransform(progress, [0.42, 0.78], ["12%", "0%"]);
  const supportOpacity = useTransform(progress, [0, 0.32], [1, 0]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[200vh]">
      {/* 풀블리드 유체 — 경계선 없이 맨 위부터 꽉 참 */}
      <div className="sticky top-0 h-screen overflow-hidden bg-[#0a1030]">
        {isMobile ? (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />
        ) : (
          <Suspense fallback={<div className="absolute inset-0 bg-[#0a1030]" />}>
            <FluidCanvas />
          </Suspense>
        )}

        {/* 가독성 그라데이션 (포인터 통과) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/30" />

        {/* 콘텐츠 (포인터 통과 → 유체 반응, 버튼만 클릭) */}
        <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-between px-6 pb-10 pt-24 sm:px-10 sm:pb-14">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ opacity: supportOpacity }}
              className="mb-5 inline-flex flex-wrap items-center gap-2"
            >
              <span className="rounded-lg border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
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

            {/* 두 헤드라인을 같은 자리에 겹쳐 스크롤로 교차 */}
            <div className="grid">
              <motion.h1
                variants={headlineContainer}
                initial="hidden"
                animate="show"
                style={{ opacity: h1Opacity, y: h1Y }}
                className="col-start-1 row-start-1 text-[clamp(1.9rem,5vw,3.75rem)] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
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
                className="col-start-1 row-start-1 text-[clamp(2.1rem,6.5vw,5rem)] font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
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
                  <div className="text-[clamp(1.3rem,2.2vw,1.85rem)] font-bold text-white">{stat.value}</div>
                  <div className="mt-0.5 text-xs text-white/60 sm:text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <motion.div style={{ opacity: supportOpacity }} className="sm:max-w-sm sm:text-right">
              <p className="text-sm leading-relaxed text-white/75">
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
    </section>
  );
}
