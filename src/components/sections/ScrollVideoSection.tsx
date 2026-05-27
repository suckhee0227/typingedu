import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

/**
 * 스크롤로 재생되는 광고영상 섹션.
 *
 * - public/ad.mp4 파일을 넣으면 스크롤 진행도에 맞춰 영상이 스크럽(scrub) 재생됩니다.
 *   (스크롤 아래로 = 영상 진행, 위로 = 되감기)
 * - 아직 영상이 없으면, 스크롤로 "재생"되는 게 보이는 플레이스홀더 타임라인이 표시됩니다.
 * - 이 섹션은 추후 통째로 제거하거나 더 업그레이드할 수 있도록 독립 컴포넌트로 분리해 둠.
 *
 * 영상 교체 방법: /public/ad.mp4 로 파일을 저장하면 끝. (키프레임 많은 인코딩일수록 스크럽이 부드러움)
 */

const VIDEO_SRC = "/ad.mp4";

// 스크롤 구간에 맞춰 페이드 인/아웃되는 개별 장면 (hooks를 최상위에서 호출하려고 분리)
function Scene({
  progress,
  scene,
  index,
  total,
}: {
  progress: MotionValue<number>;
  scene: { t: string; sub: string };
  index: number;
  total: number;
}) {
  const seg = 1 / total;
  const start = index * seg;
  const isLast = index === total - 1;

  const opacity = useTransform(
    progress,
    [start - seg * 0.5, start, start + seg * 0.5, start + seg].map((x) => Math.min(1, Math.max(0, x))),
    isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start - seg * 0.5, start + seg * 0.5], [40, -40]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 -translate-y-1/2 top-1/2">
      <p className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        {scene.t}
      </p>
      <p className="mt-4 text-base sm:text-xl text-white/60">{scene.sub}</p>
    </motion.div>
  );
}

// 플레이스홀더에서 스크롤에 따라 교차되는 "광고 장면"들
const SCENES = [
  { t: "우리 기관의 교육 철학 그대로", sub: "맞춤형 스마트 교구 제작" },
  { t: "외주 대비 1/10 비용", sub: "특허 출원 자체 엔진" },
  { t: "단 1주 만에 완성", sub: "기획부터 배포까지" },
  { t: "지금, 무료 상담 신청", sub: "데모를 직접 체험해 보세요" },
];

export default function ScrollVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideo, setHasVideo] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // 스크롤 진행도 → 영상 currentTime 스크럽
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const video = videoRef.current;
    if (hasVideo && video && video.duration && Number.isFinite(video.duration)) {
      video.currentTime = v * video.duration;
    }
  });

  // 영상 로드 성공 여부 감지
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onLoaded = () => video.duration && setHasVideo(true);
    const onError = () => setHasVideo(false);
    video.addEventListener("loadeddata", onLoaded);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("loadeddata", onLoaded);
      video.removeEventListener("error", onError);
    };
  }, []);

  // 플레이스홀더용 파생 모션 값
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const hue = useTransform(scrollYProgress, [0, 1], [220, 270]);
  const bg = useTransform(hue, (h) => `radial-gradient(circle at 50% 40%, hsl(${h} 70% 22%), hsl(${h} 80% 8%))`);

  return (
    // 300vh 만큼 스크롤하는 동안 안쪽 화면이 고정(sticky)되어 스크럽됨
    <section ref={sectionRef} className="relative h-[300vh] bg-black">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 실제 영상 (있을 때만 노출) */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            hasVideo ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* 플레이스홀더 (영상 없을 때) */}
        {!hasVideo && (
          <motion.div style={{ background: bg }} className="absolute inset-0 flex items-center justify-center">
            {/* 은은한 그리드 */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />

            {/* 교차되는 장면 카피 */}
            <div className="relative text-center px-6">
              {SCENES.map((scene, i) => (
                <Scene key={scene.t} progress={scrollYProgress} scene={scene} index={i} total={SCENES.length} />
              ))}
            </div>

            {/* 안내 배지 */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-xs backdrop-blur-sm">
              ▶ 스크롤로 재생 중 · 광고 영상 자리 (mp4 교체 예정)
            </div>
          </motion.div>
        )}

        {/* 스크럽 타임라인 (영상/플레이스홀더 공통) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[min(640px,80vw)]">
          <div className="h-1 w-full rounded-full bg-white/15 overflow-hidden">
            <motion.div style={{ width: barWidth }} className="h-full rounded-full bg-gradient-to-r from-primary-400 to-accent-400" />
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-white/50 text-xs">
            <span className="animate-bounce">↓</span>
            스크롤해서 재생
          </div>
        </div>
      </div>
    </section>
  );
}
