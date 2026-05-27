import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import { lazy, Suspense, useRef, useEffect } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 첫 헤드라인("대담한 교육…")이 마스크 뒤에서 한 단어씩 솟아오름(세련된 등장)
const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } },
};
const token: Variants = {
  hidden: { y: "110%" },
  show: { y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

function Word({ children }: { children: string }) {
  return (
    <span className="mr-[0.25em] inline-block overflow-hidden pb-[0.14em] align-bottom">
      <motion.span variants={token} className="inline-block">
        {children}
      </motion.span>
    </span>
  );
}

// 두번째 헤드라인의 노란 강조 — 마우스 올리면 글자만 커지고 더 빛남(박스/배경 없음, 반응형은 부모 clamp 따라감)
function Hl({ children }: { children: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.14 }}
      transition={{ type: "spring", stiffness: 400, damping: 13 }}
      className="pointer-events-auto inline-block origin-center cursor-default text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.5)] transition-[filter,color] duration-200 hover:text-yellow-200 hover:drop-shadow-[0_0_42px_rgba(253,224,71,0.95)]"
    >
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

  // A(처음): "대담한 교육…" → B(스크롤, 더 중요): "우리 기관의 교육 철학…" + 통계 + CTA
  // 두번째가 핵심이라 일찍 등장해 오래 머무름(0.5~1.0 구간 유지)
  const aOpacity = useTransform(progress, [0, 0.26], [1, 0]);
  const aY = useTransform(progress, [0, 0.3], ["0%", "-12%"]);
  const bOpacity = useTransform(progress, [0.3, 0.5], [0, 1]);
  const bY = useTransform(progress, [0.3, 0.5], ["12%", "0%"]);
  // CTA는 두번째 상태에서만 보이고 클릭 가능
  const ctaPointer = useTransform(progress, [0.28, 0.34], ["none", "auto"]);

  return (
    // 흰 배경(회색·경계선 없음) 위에 떠 있는 작은 유체 박스 — 메인1 스타일
    <section ref={sectionRef} id="hero" className="relative h-[300vh] bg-white">
      {/* items-end + 위쪽 공백 → 히어로가 살짝 아래로, 상단 브랜드(네비)와 간격 ↑ */}
      <div className="sticky top-0 flex h-screen items-end justify-center px-3 pb-[4vh] sm:px-5">
        <div className="relative h-[84vh] w-full max-w-[1400px] overflow-hidden rounded-[1.75rem] bg-[#0a1030] shadow-[0_30px_80px_-24px_rgba(30,30,80,0.4)]">
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
          <div className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-6xl flex-col justify-between px-7 py-9 sm:px-12 sm:py-12">
            {/* 상단: 헤드라인 (A/B 겹쳐 교차). B는 헤드라인 밑에 설명까지 */}
            <div className="grid">
              <motion.h1
                variants={headlineContainer}
                initial="hidden"
                animate="show"
                style={{ opacity: aOpacity, y: aY }}
                className="col-start-1 row-start-1 text-[clamp(2.3rem,6.5vw,5.5rem)] font-bold leading-[1.04] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
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
                <h2 className="text-[clamp(1.8rem,4.6vw,3.6rem)] font-bold leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
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
                    <div className="text-[clamp(1.35rem,2.1vw,1.9rem)] font-bold text-white">{stat.value}</div>
                    <div className="mt-0.5 text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              <div className="sm:max-w-[30rem] sm:text-right">
                {/* 데스크톱에서 딱 두 줄로 */}
                <motion.p
                  style={{ opacity: aOpacity }}
                  className="text-sm leading-relaxed text-white/80"
                >
                  기획·모션·3D·개발을 하나로 묶어, 보는 즉시 빠져들고 직접 만지고 싶어지는{" "}
                  <br className="hidden sm:block" />
                  학습 경험을 만듭니다. 캠페인부터 몰입형 교구까지.
                </motion.p>

                {/* CTA는 두번째 상태에서만 등장(+클릭 가능) */}
                <motion.div
                  style={{ opacity: bOpacity, pointerEvents: ctaPointer }}
                  className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end"
                >
                  <button
                    onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
                    className="rounded-xl bg-white px-6 py-3 text-center text-base font-bold text-primary-600 transition-colors hover:bg-gray-100"
                  >
                    무료 상담 신청
                  </button>
                  <a
                    href="#portfolio"
                    className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-center text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                  >
                    데모 체험하기
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
