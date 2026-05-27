import { motion } from "framer-motion";
import ContactForm from "../forms/ContactForm";

export default function ContactSection() {
  return (
    <section id="contact" className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
              무료 상담 신청
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              교육 철학에 맞는 맞춤형 교구,
              <br />
              부담 없이 문의해 주세요.
            </p>

            <div className="space-y-4">
              {[
                { label: "빠른 응답", desc: "24시간 이내 회신" },
                { label: "무료 샘플", desc: "상담 후 맞춤 샘플 제작" },
                { label: "부담 제로", desc: "상담만으로 비용 발생 없음" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
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
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
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
