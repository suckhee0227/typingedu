import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { PRICING_PLANS, PORTFOLIO_ITEMS } from "../../lib/constants";

// 기능 항목이 하나씩 순차로 등장
const listContainer: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } };
const listItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function PricingSection() {
  const [showSamples, setShowSamples] = useState(false);

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600">
            Pricing
          </span>
          <h2 className="mt-3 mb-4 text-[clamp(2rem,5vw,4rem)] font-bold tracking-tight text-gray-900">
            합리적인 가격 정책
          </h2>
          <p className="mx-auto max-w-2xl text-[clamp(1rem,1.4vw,1.25rem)] text-gray-600">
            요구사항과 제작 기간에 따라 가격을 책정합니다.
          </p>
          <div className="mt-4 inline-block px-5 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
            <span className="text-yellow-800 font-semibold text-sm">
              첫 거래 고객 특별 할인 혜택
            </span>
          </div>
        </motion.div>

        <div className="max-w-lg mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-3xl px-10 py-12 bg-white border border-gray-100 shadow-xl"
            >
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>

              <div className="mb-1">
                {plan.originalPrice && (
                  <span className="text-base line-through text-gray-400">{plan.originalPrice}</span>
                )}
              </div>
              <div className="mb-2">
                <span className="text-6xl font-black text-gray-900">{plan.price}</span>
              </div>
              {plan.period && (
                <div className="mb-10">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-red-50 text-red-500">
                    {plan.period}
                  </span>
                </div>
              )}

              <motion.ul
                className="space-y-5 mb-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={listContainer}
              >
                {plan.features.map((feature) => (
                  <motion.li key={feature} variants={listItem} className="flex items-center gap-3 text-base">
                    <svg className="w-6 h-6 shrink-0 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-600">{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <a
                href="#contact"
                onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
                className="block w-full py-5 rounded-2xl text-center font-bold text-base transition-colors bg-primary-600 text-white hover:bg-primary-700"
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Sample Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button
            onClick={() => setShowSamples(!showSamples)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
          >
            <span>{showSamples ? "샘플 교본 닫기" : "샘플 교본 보기"}</span>
            <svg
              className={`w-4 h-4 transition-transform ${showSamples ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showSamples && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-5xl mx-auto">
                  {PORTFOLIO_ITEMS.map((item) => {
                    const hasDemo = !!item.demoUrl;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (!hasDemo) return;
                          window.dispatchEvent(
                            new CustomEvent("open-portfolio-demo", { detail: item.id })
                          );
                          setShowSamples(false);
                        }}
                        className={`bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all ${
                          hasDemo
                            ? "cursor-pointer hover:shadow-md hover:border-primary-300"
                            : "opacity-60 cursor-default"
                        }`}
                      >
                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl">🤖</span>
                            </div>
                          )}
                          {!hasDemo && (
                            <div className="absolute top-2 right-2 bg-gray-500/80 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                              준비 중
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                          <p className="text-xs text-gray-500 mb-2">{item.description}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-primary-600">{item.priceDisplay}</span>
                            <span className="text-gray-400">· {item.period}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-400 text-xs mt-4">
                  카드를 클릭하면 포트폴리오 섹션에서 바로 체험할 수 있습니다.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
