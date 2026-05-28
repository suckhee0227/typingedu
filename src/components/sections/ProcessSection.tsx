import { motion, type Variants } from "framer-motion";
import { PROCESS_STEPS } from "../../lib/constants";
import RevealText from "../ui/RevealText";
import RevealTextDown from "../ui/RevealTextDown";

// 섹션이 보이면 단계가 하나씩 바로바로 등장 (스크롤 고정 없음)
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } } };
const stepItem: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProcessSection() {
  return (
    <section id="process" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="mb-16 text-center"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">Process</span>
          <h2 className="mt-3 mb-4 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight text-gray-900">
            <RevealText text="간단한 4단계로 완성" />
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(1rem,1.4vw,1.25rem)] text-gray-600">
            <RevealTextDown text="복잡한 절차 없이 빠르게 맞춤형 교구를 도입하세요." />
          </p>
        </motion.div>

        <div className="relative">
          {/* 연결선 — 단계가 등장할 때 좌→우로 채워짐 */}
          <div className="absolute left-[12.5%] right-[12.5%] top-12 hidden h-0.5 bg-primary-100 md:block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-primary-400"
            />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, margin: "-80px" }}
            className="relative grid gap-8 md:grid-cols-4"
          >
            {PROCESS_STEPS.map((step) => (
              <motion.div key={step.step} variants={stepItem} className="relative text-center">
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
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
