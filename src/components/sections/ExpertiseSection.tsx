import { motion } from "framer-motion";


const advantages = [
  {
    title: "자체 개발 엔진",
    desc: "수년간 축적된 개발 엔진으로 빠르고 안정적인 디지털 교구 및 다양한 콘텐츠 제작",
    icon: (
      <img src="/typingx-logo.png" alt="TypingX 로고" className="w-9 h-9 object-contain" />
    ),
    iconBg: "bg-primary-50",
  },
  {
    title: "교재 기반 디지털 전환",
    desc: "기존 교재를 그대로 인터랙티브 디지털 교구화",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    iconBg: "bg-primary-50",
  },
  {
    title: "교육 특화 전문성 보유",
    desc: "교육 현장의 니즈를 깊이 이해하고 학습 효과를 극대화하는 설계",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    iconBg: "bg-primary-50",
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
    <section id="expertise" className="py-24">
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
            Why 타이핑에듀?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            외주개발, 왜 비싸고 느릴까요?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            특허 출원한 자체개발 엔진으로 비용과 시간을 획기적으로 줄입니다.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          custom={0}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-20"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-500 text-left">비교 항목</th>
                <th className="pl-10 pr-6 py-4 text-sm font-semibold text-red-500 text-center">일반 외주</th>
                <th className="px-6 py-4 text-sm font-semibold text-primary-600 text-center">타이핑에듀</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-50">
                <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">교구 1종 제작비</td>
                <td className="pl-10 pr-6 py-4 text-sm text-gray-500 text-center">300만 원~/건</td>
                <td className="px-6 py-4 text-sm text-primary-600 font-semibold text-center">39만 원~/건</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">앱 개발비</td>
                <td className="pl-10 pr-6 py-4 text-sm text-gray-500 text-center">1000~2000만 원</td>
                <td className="px-6 py-4 text-sm text-primary-600 font-semibold text-center">400~800만 원</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td rowSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900 align-middle border-r border-gray-100 w-36">제작 기간</td>
                <td className="px-6 py-4 text-sm text-gray-500 w-24">교구</td>
                <td className="pl-10 pr-6 py-4 text-sm text-gray-500 text-center">2주</td>
                <td className="px-6 py-4 text-sm text-primary-600 font-semibold text-center">1주일 이내</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500 w-24">앱</td>
                <td className="pl-10 pr-6 py-4 text-sm text-gray-500 text-center">1개월 이상</td>
                <td className="px-6 py-4 text-sm text-primary-600 font-semibold text-center">1개월 이상</td>
              </tr>
              <tr>
                <td colSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900">결과물 품질</td>
                <td className="pl-10 pr-6 py-4 text-sm text-gray-500 text-center">다수 프로젝트 병행, 품질 편차</td>
                <td className="px-6 py-4 text-sm text-primary-600 font-semibold text-center">자체 개발 엔진으로 일관된 고품질</td>
              </tr>
            </tbody>
          </table>
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
              <div className={`w-14 h-14 ${item.iconBg} text-primary-600 rounded-xl flex items-center justify-center mb-5`}>
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
