import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRICING_PLANS, PORTFOLIO_ITEMS } from "../../lib/constants";

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
          <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            합리적인 가격 정책
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            난이도와 요구사항에 따라 가격을 책정합니다.
            단건 결제도 가능하여 부담 없이 시작할 수 있습니다.
          </p>
          <div className="mt-4 inline-block px-5 py-2 bg-yellow-50 border border-yellow-200 rounded-full">
            <span className="text-yellow-800 font-semibold text-sm">
              첫 거래 고객 특별 할인 혜택
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-primary-600 text-white shadow-xl shadow-primary-200 scale-105"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                  가장 인기
                </div>
              )}

              <h3
                className={`text-lg font-bold mb-2 ${
                  plan.highlighted ? "text-white" : "text-gray-900"
                }`}
              >
                {plan.name}
              </h3>

              <div className="mb-1">
                {plan.originalPrice && (
                  <span
                    className={`text-sm line-through ${
                      plan.highlighted ? "text-white/50" : "text-gray-400"
                    }`}
                  >
                    {plan.originalPrice}
                  </span>
                )}
              </div>
              <div className="mb-1">
                <span
                  className={`text-4xl font-bold ${
                    plan.highlighted ? "text-white" : "text-gray-900"
                  }`}
                >
                  {plan.price}
                </span>
              </div>
              {plan.period && (
                <div className="mb-6">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      plan.highlighted
                        ? "bg-white/20 text-white"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
              )}
              {!plan.period && <div className="mb-6" />}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <svg
                      className={`w-5 h-5 shrink-0 ${
                        plan.highlighted ? "text-yellow-300" : "text-primary-500"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={
                        plan.highlighted ? "text-white/90" : "text-gray-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.cta === "혜택받고 시작하기" ? "#contact" : "#contact"}
                onClick={
                  plan.cta === "혜택받고 시작하기"
                    ? () =>
                        window.dispatchEvent(
                          new Event("open-contact-widget")
                        )
                    : undefined
                }
                className={`block w-full py-3 rounded-xl text-center font-semibold text-sm transition-colors ${
                  plan.highlighted
                    ? "bg-white text-primary-600 hover:bg-gray-50"
                    : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                }`}
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
                            <span className="font-bold text-primary-600">{item.ourPrice}만원</span>
                            <span className="text-gray-300">vs</span>
                            <span className="text-gray-400 line-through">외주 {item.outsourcePrice}만원</span>
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
