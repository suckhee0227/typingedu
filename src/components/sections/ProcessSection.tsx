import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useRef, useEffect } from "react";
import { PROCESS_STEPS } from "../../lib/constants";

// 스크롤 진행도에 맞춰 자기 구간에서 하나씩 등장하는 단계 카드
function StepCard({
  step,
  index,
  progress,
}: {
  step: (typeof PROCESS_STEPS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const start = 0.12 + index * 0.18;
  const opacity = useTransform(progress, [start, start + 0.14], [0, 1]);
  const y = useTransform(progress, [start, start + 0.14], [50, 0]);
  const scale = useTransform(progress, [start, start + 0.14], [0.92, 1]);

  return (
    <motion.div style={{ opacity, y, scale }} className="relative text-center">
      <div className="relative z-10 mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-primary-200 bg-white">
        {step.logoUrl ? (
          <img src={step.logoUrl} alt="TypingX" className="h-12 w-12 object-contain" />
        ) : (
          <span className="text-3xl">{step.icon}</span>
        )}
      </div>
      <div className="mb-1 text-sm font-bold text-primary-600">STEP {step.step}</div>
      <h3 className="mb-2 text-lg font-bold text-gray-900">{step.title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
    </motion.div>
  );
}

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // 스크롤 진행도 직접 측정 (Lenis와 동기화)
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

  const headerOpacity = useTransform(progress, [0, 0.08], [0, 1]);
  const headerY = useTransform(progress, [0, 0.08], [30, 0]);
  const lineWidth = useTransform(progress, [0.12, 0.8], ["0%", "100%"]);

  return (
    // 스크롤 동안 고정되며 단계가 순서대로 등장 (집중 유도)
    <section ref={sectionRef} id="process" className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-16 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Process</span>
            <h2 className="mt-3 mb-4 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight text-gray-900">
              간단한 4단계로 완성
            </h2>
            <p className="mx-auto max-w-2xl text-[clamp(1rem,1.4vw,1.25rem)] text-gray-600">
              복잡한 절차 없이 빠르게 맞춤형 교구를 도입하세요.
            </p>
          </motion.div>

          <div className="relative grid gap-8 md:grid-cols-4">
            {/* 연결선 — 단계가 등장하면서 채워짐 */}
            <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-0.5 bg-primary-100 md:block">
              <motion.div style={{ width: lineWidth }} className="h-full bg-primary-400" />
            </div>

            {PROCESS_STEPS.map((step, i) => (
              <StepCard key={step.step} step={step} index={i} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
