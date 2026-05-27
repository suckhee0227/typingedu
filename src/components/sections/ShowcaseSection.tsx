import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const FluidCanvas = lazy(() => import("../three/FluidCanvas"));

// 광고 영상: /public/ad.mp4 를 넣으면 카드 안에서 재생됨. 없으면 포스터(데모 썸네일)가 보임.
const VIDEO_SRC = "/ad.mp4";
const POSTER = "/apps/tap-tap-3d/assets/thumbnail.png";

/**
 * lusion.co 스타일 쇼케이스 섹션 (기존 히어로/ScrollVideoSection 아래에 추가).
 * - 배경: 마우스 따라 물이 번지는 유체 시뮬레이션(FluidCanvas)
 * - 텍스트: 큰 볼드 헤드라인 + 오른쪽 설명/버튼
 * - 영상 카드: 왼쪽 아래 작게 시작 → 스크롤 내리면 맥북 줌처럼 풀스크린으로 확대·재생
 *   → 더 내리면 다시 원래 작은 카드로 복귀(기존처럼).
 */
export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 작은 카드(왼쪽 아래) → 풀스크린 → 다시 작은 카드
  const kf = [0, 0.4, 0.6, 1];
  const cardWidth = useTransform(scrollYProgress, kf, [
    "clamp(220px, 26vw, 360px)",
    "100%",
    "100%",
    "clamp(220px, 26vw, 360px)",
  ]);
  const cardHeight = useTransform(scrollYProgress, kf, [
    "clamp(150px, 17vw, 240px)",
    "100%",
    "100%",
    "clamp(150px, 17vw, 240px)",
  ]);
  const cardLeft = useTransform(scrollYProgress, kf, [
    "clamp(16px, 4vw, 64px)",
    "0px",
    "0px",
    "clamp(16px, 4vw, 64px)",
  ]);
  const cardBottom = useTransform(scrollYProgress, kf, [
    "clamp(24px, 7vh, 96px)",
    "0px",
    "0px",
    "clamp(24px, 7vh, 96px)",
  ]);
  const cardRadius = useTransform(scrollYProgress, kf, ["20px", "0px", "0px", "20px"]);
  const cardShadow = useTransform(scrollYProgress, kf, [
    "0 20px 60px rgba(0,0,0,0.45)",
    "0 0 0 rgba(0,0,0,0)",
    "0 0 0 rgba(0,0,0,0)",
    "0 20px 60px rgba(0,0,0,0.45)",
  ]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.28, 0.72, 1], [1, 0, 0, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -40]);

  // 카드가 충분히 커졌을 때만 재생
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const video = videoRef.current;
    if (!video) return;
    if (v > 0.34 && v < 0.66) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  // 모바일: 유체/스크롤 줌 생략하고 간결한 정적 버전
  if (isMobile) {
    return (
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-accent-700 px-6 py-20 text-white">
        <h2 className="text-4xl font-bold leading-tight">
          대담한 교육,
          <br />
          살아 움직이게.
        </h2>
        <p className="mt-5 text-white/70 leading-relaxed">
          기획·모션·3D·개발을 하나로. 보는 즉시 빠져드는 학습 경험을 만듭니다.
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl shadow-2xl">
          <video src={VIDEO_SRC} poster={POSTER} muted playsInline loop autoPlay className="w-full" />
        </div>
      </section>
    );
  }

  return (
    // 250vh 스크롤 동안 안쪽 화면이 고정되며 영상 카드가 확대/축소됨
    <section ref={sectionRef} className="relative h-[250vh] bg-[#0a1030]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 유체 시뮬레이션 배경 (마우스 반응) */}
        <Suspense fallback={<div className="absolute inset-0 bg-[#0a1030]" />}>
          <FluidCanvas />
        </Suspense>

        {/* 텍스트 레이아웃 (lusion 스타일). 카드 확대 시 페이드아웃. 포인터는 통과시켜 유체 반응 유지 */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="pointer-events-none absolute inset-0 z-10 mx-auto flex max-w-7xl flex-col justify-between px-6 py-24 sm:px-10"
        >
          <h2 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)] sm:text-6xl lg:text-7xl">
            대담한 교육,
            <br />
            살아 움직이게.
          </h2>

          <div className="flex justify-end">
            <div className="max-w-md text-right">
              <p className="text-base leading-relaxed text-white/75 sm:text-lg">
                기획·모션·3D·개발을 하나로 묶어, 보는 즉시 빠져들고 직접 만지고 싶어지는
                학습 경험을 만듭니다. 캠페인부터 몰입형 교구까지.
              </p>
              <a
                href="#process"
                className="pointer-events-auto mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                제작 과정 보기
              </a>
            </div>
          </div>
        </motion.div>

        {/* 스크롤로 확대되는 영상 카드 (맥북 화면 줌 스타일) */}
        <motion.div
          style={{
            width: cardWidth,
            height: cardHeight,
            left: cardLeft,
            bottom: cardBottom,
            borderRadius: cardRadius,
            boxShadow: cardShadow,
          }}
          className="absolute z-20 overflow-hidden bg-black"
        >
          <video
            ref={videoRef}
            src={VIDEO_SRC}
            poster={POSTER}
            muted
            playsInline
            loop
            preload="metadata"
            className="h-full w-full object-cover"
          />
          {/* 살짝 어둡게 + 라벨 (영상 없을 때 포스터 위에 표시) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>

        {/* 스크롤 안내 */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center text-xs text-white/50">
          <span className="mb-1 block animate-bounce">↓</span>
          스크롤하면 영상이 확대됩니다
        </div>
      </div>
    </section>
  );
}
