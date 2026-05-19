import { motion } from "framer-motion";
import { PROCESS_STEPS } from "../../lib/constants";

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            간단한 4단계로 완성
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            복잡한 절차 없이 빠르게 맞춤형 교구를 도입하세요.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-primary-200" />

          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-24 h-24 bg-white border-2 border-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-5 relative z-10">
                {step.logoUrl ? (
                  <img src={step.logoUrl} alt="TypingX" className="w-12 h-12 object-contain" />
                ) : (
                  <span className="text-3xl">{step.icon}</span>
                )}
              </div>
              <div className="text-primary-600 font-bold text-sm mb-1">
                STEP {step.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
