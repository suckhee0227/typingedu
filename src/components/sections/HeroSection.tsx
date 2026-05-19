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
            className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6"
          >
            맞춤형 스마트 교구 제작 전문
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            우리 기관의 교육 철학 그대로,
            <br />
            <span className="text-yellow-300">1/10 비용</span>으로
            <br />
            <span className="text-yellow-300">단 1주</span> 만에 완성
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg sm:text-xl text-white/80 mb-8 leading-relaxed"
          >
            자체 개발 엔진으로 외주 대비 비용 90% 절감.
            <br />
            교재 속 문제를 그대로 디지털 교구로 만들어 드립니다.
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
