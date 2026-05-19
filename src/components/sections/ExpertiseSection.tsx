import { motion } from "framer-motion";

const comparisons = [
  {
    category: "교구 1종 제작비",
    outsource: "200~500만원 / 건",
    typingedu: "50~200만원",
  },
  {
    category: "앱 전체 개발비",
    outsource: "3,000~8,000만원",
    typingedu: "1,000만원~",
  },
  {
    category: "제작 기간",
    outsource: "3~8개월",
    typingedu: "1주일 이내",
  },
  {
    category: "유지보수",
    outsource: "별도 계약 / 월 수백만원",
    typingedu: "기본 포함",
  },
  {
    category: "수정 대응",
    outsource: "2주 이상 (추가요금)",
    typingedu: "무료 1회",
  },
  {
    category: "결과물 품질",
    outsource: "다수 프로젝트 병행, 품질 편차",
    typingedu: "교육 특화 엔진으로 일관된 고품질",
  },
];

const advantages = [
  {
    title: "자체 개발 엔진",
    desc: "수년간 축적된 교육용 게임 엔진으로 빠르고 안정적인 디지털 교구, 교육용 애니메이션 앱 제작",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "교재 기반 디지털 전환",
    desc: "기존 교재·교과서의 문제를 그대로 인터랙티브 디지털 교구로 변환",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "교육 도메인 전문성",
    desc: "교육 현장의 니즈를 깊이 이해하고 학습 효과를 극대화하는 설계",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function ExpertiseSection() {
  return (
    <section id="expertise" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
            Why 타이핑 에듀
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            외주 개발, 왜 비싸고 느릴까요?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            자체 교육 특화 엔진으로 비용과 시간을 획기적으로 줄입니다.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-20"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
            <div className="px-6 py-4 text-sm font-semibold text-gray-500">
              비교 항목
            </div>
            <div className="px-6 py-4 text-sm font-semibold text-red-500 text-center">
              일반 외주
            </div>
            <div className="px-6 py-4 text-sm font-semibold text-primary-600 text-center">
              타이핑 에듀
            </div>
          </div>
          {comparisons.map((row, i) => (
            <motion.div
              key={row.category}
              variants={fadeUp}
              custom={i + 1}
              className="grid grid-cols-3 border-b border-gray-50 last:border-0"
            >
              <div className="px-6 py-4 text-sm font-medium text-gray-900">
                {row.category}
              </div>
              <div className="px-6 py-4 text-sm text-gray-500 text-center">
                {row.outsource}
              </div>
              <div className="px-6 py-4 text-sm text-primary-600 font-semibold text-center">
                {row.typingedu}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Advantages */}
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((item, i) => (
            <motion.div
              key={item.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              custom={i}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center mb-5">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
