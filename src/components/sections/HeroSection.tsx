import { motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const HeroScene = lazy(() => import("../three/HeroScene"));

export default function HeroSection() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background */}
      {isMobile ? (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500" />
      ) : (
        <Suspense
          fallback={
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500" />
          }
        >
          <HeroScene />
        </Suspense>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white text-sm font-semibold tracking-wide">
              맞춤형 스마트 교구 제작
            </span>
            {["#교구", "#학습용", "#기업 내부 교육용", "#개인 교습용", "#대형 학원용", "#Gamification", "#시각화"].map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-yellow-400/20 border border-yellow-300/40 rounded-md text-yellow-200 text-xs font-medium">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            우리 기관의 교육 철학 그대로,
            <br />
            <motion.span
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative inline-block cursor-default"
            >
              <span className="relative z-10 text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.5)] hover:drop-shadow-[0_0_32px_rgba(253,224,71,0.9)] transition-all duration-200">1/10 비용</span>
              <span className="absolute inset-x-0 -bottom-0.5 h-1.5 bg-yellow-400/30 rounded-full scale-x-0 hover:scale-x-100 transition-transform duration-200 origin-left" />
            </motion.span>
            으로
            <br />
            <motion.span
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative inline-block cursor-default"
            >
              <span className="relative z-10 text-yellow-300 drop-shadow-[0_0_24px_rgba(253,224,71,0.5)] hover:drop-shadow-[0_0_32px_rgba(253,224,71,0.9)] transition-all duration-200">단 1주</span>
              <span className="absolute inset-x-0 -bottom-0.5 h-1.5 bg-yellow-400/30 rounded-full scale-x-0 hover:scale-x-100 transition-transform duration-200 origin-left" />
            </motion.span>
            {" "}만에 완성
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed"
          >
            특허 출원 한 자체 개발 엔진으로 외주대비 비용 90% 절감.
            <br />
            컨텐츠 시각화를 통한 몰입도 향상.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
              className="px-8 py-4 bg-white text-primary-600 rounded-xl text-lg font-bold hover:bg-gray-50 transition-colors text-center"
            >
              무료 상담 신청
            </button>
            <a
              href="#portfolio"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl text-lg font-medium hover:bg-white/20 transition-colors text-center"
            >
              데모 체험하기
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 grid grid-cols-3 gap-8 max-w-lg"
          >
            {[
              { value: "90%", label: "비용 절감" },
              { value: "1주", label: "제작 기간" },
              { value: "0%", label: "소통 로스" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
