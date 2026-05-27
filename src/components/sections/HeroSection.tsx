import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { lazy, Suspense, useRef, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 첫 헤드라인("대담한 교육…")이 토큰 단위로 하나씩 등장
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
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

function Word({ children }: { children: string }) {
  return (
    <motion.span variants={token} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  );
}

// 두번째 헤드라인의 노란 강조 (밑줄 없음, 반응형은 부모 clamp 따라감)
function Hl({ children }: { children: string }) {
  return <span className="text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.45)]">{children}</span>;
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

  // A(처음): "대담한 교육…"  →  B(스크롤): "우리 기관의 교육 철학…" + 통계
  const aOpacity = useTransform(progress, [0, 0.38], [1, 0]);
  const aY = useTransform(progress, [0, 0.42], ["0%", "-12%"]);
  const bOpacity = useTransform(progress, [0.34, 0.72], [0, 1]);
  const bY = useTransform(progress, [0.34, 0.72], ["12%", "0%"]);

  return (
    // 흰 배경(회색·경계선 없음) 위에 떠 있는 작은 유체 박스 — 메인1 스타일
    <section ref={sectionRef} id="hero" className="relative h-[200vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center justify-center px-4 pt-14 sm:px-6">
        <div className="relative h-[78vh] w-full max-w-[1280px] overflow-hidden rounded-[1.75rem] bg-[#0a1030] shadow-[0_30px_80px_-24px_rgba(30,30,80,0.4)]">
          {isMobile ? (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />
          ) : (
            <Suspense fallback={<div className="absolute inset-0 bg-[#0a1030]" />}>
              <FluidCanvas />
            </Suspense>
          )}

          {/* 가독성 그라데이션 (포인터 통과) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/30" />

          {/* 박스 안 콘텐츠 (포인터 통과 → 유체 반응, 버튼만 클릭) */}
          <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-5xl flex-col justify-between px-6 py-7 sm:px-9 sm:py-9">
            {/* 상단: 헤드라인 (A/B 겹쳐 교차). B는 헤드라인 밑에 설명까지 */}
            <div className="grid">
              <motion.h1
                variants={headlineContainer}
                initial="hidden"
                animate="show"
                style={{ opacity: aOpacity, y: aY }}
                className="col-start-1 row-start-1 text-[clamp(1.9rem,5vw,4rem)] font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              >
                <Word>대담한</Word>
                <Word>교육,</Word>
                <br />
                <Word>살아</Word>
                <Word>움직이게.</Word>
              </motion.h1>

              <motion.div style={{ opacity: bOpacity, y: bY }} className="col-start-1 row-start-1">
                <div className="mb-3.5 inline-flex flex-wrap items-center gap-2">
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
                </div>
                <h2 className="text-[clamp(1.55rem,3.8vw,2.9rem)] font-bold leading-[1.12] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                  우리 기관의 교육 철학 그대로,
                  <br />
                  <Hl>1/10 비용</Hl> 으로
                  <br />
                  <Hl>단 1주</Hl> 만에 완성
                </h2>
                {/* 특허 설명 — 메인 텍스트 바로 밑(원래 위치) */}
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75">
                  특허 출원한 자체 개발 엔진으로 외주대비 비용 90% 절감.
                  <br className="hidden sm:block" />
                  콘텐츠 시각화를 통한 몰입도 향상.
                </p>
              </motion.div>
            </div>

            {/* 하단: 통계(좌, B에서 등장) + 서브텍스트(우, A에서만) + CTA(항상) */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <motion.div style={{ opacity: bOpacity }} className="grid grid-cols-3 gap-6 sm:gap-10">
                {[
                  { value: "90%", label: "비용 절감" },
                  { value: "1주", label: "제작 기간" },
                  { value: "0%", label: "소통 로스" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-[clamp(1.15rem,1.8vw,1.55rem)] font-bold text-white">{stat.value}</div>
                    <div className="mt-0.5 text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <div className="sm:max-w-xs sm:text-right">
                <motion.p
                  style={{ opacity: aOpacity }}
                  className="text-sm leading-relaxed text-white/80"
                >
                  기획·모션·3D·개발을 하나로 묶어, 보는 즉시 빠져들고 직접 만지고 싶어지는 학습 경험을 만듭니다.
                  캠페인부터 몰입형 교구까지.
                </motion.p>

                {/* CTA는 항상 보이게 */}
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
