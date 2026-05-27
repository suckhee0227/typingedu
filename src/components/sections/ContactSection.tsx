import { motion, type Variants } from "framer-motion";
import ContactForm from "../forms/ContactForm";
import RevealText from "../ui/RevealText";

// 항목이 하나씩 순차로 등장
const listContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } };
const listItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
              Contact
            </span>
            <h2 className="mt-3 mb-4 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight text-gray-900">
              <RevealText text="무료 상담 신청" justify="start" />
            </h2>
            <p className="mb-8 text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-gray-600">
              교육 철학에 맞는 맞춤형 교구,
              <br />
              부담 없이 문의해 주세요.
            </p>

            <motion.div
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              variants={listContainer}
            >
              {[
                { label: "빠른 응답", desc: "24시간 이내 회신" },
                { label: "무료 샘플", desc: "상담 후 맞춤 샘플 제작" },
                { label: "부담 제로", desc: "상담만으로 비용 발생 없음" },
              ].map((item) => (
                <motion.div key={item.label} variants={listItem} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mt-0.5 shrink-0">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 text-sm">
                      {item.label}
                    </span>
                    <span className="text-gray-500 text-sm"> — {item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
