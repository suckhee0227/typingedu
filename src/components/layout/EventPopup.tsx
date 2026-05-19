import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventPopup() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener("open-event-popup", handler);
    return () => window.removeEventListener("open-event-popup", handler);
  }, []);

  const handleClose = () => {
    setShow(false);
  };

  const handleCTA = () => {
    handleClose();
    window.dispatchEvent(new Event("open-contact-widget"));
  };

  return (
    <>

    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* 상단 그라데이션 배경 */}
            <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-accent-500 px-8 pt-10 pb-8 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold mb-4">
                기간 한정 6월까지
              </div>
              <h3 className="text-4xl sm:text-5xl font-black text-yellow-300 leading-tight tracking-tight">
                1+1
              </h3>
              <p className="text-white/70 text-xs mt-1 mb-1">첫 거래 기준</p>
              <p className="text-white/90 text-sm mt-2">
                첫 거래시 일반 교구 1종을 무료로 제작해 드립니다.
              </p>
            </div>

            {/* 본문 */}
            <div className="px-8 py-6">
              <ul className="space-y-3 mb-6">
                {[
                  "기본 템플릿 활용 교구 1종 무료",
                  "난이도별 맞춤 제작 가능",
                  "샘플 미리보기 제공",
                  "프리미엄 제작의뢰시 일반 교구 2종 제작",
                ].map((text) => (
                  <li key={text} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-primary-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {text}
                  </li>
                ))}
              </ul>

              <button
                onClick={handleCTA}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-primary-200 transition-all"
              >
                무료 상담 신청하기
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2.5 text-gray-400 text-xs mt-2 hover:text-gray-600 transition-colors"
              >
                다음에 할게요
              </button>
            </div>

            {/* 닫기 버튼 */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
