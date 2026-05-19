import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ContactForm from "../forms/ContactForm";

export default function FloatingWidget() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-contact-widget", handler);
    return () => window.removeEventListener("open-contact-widget", handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 팝업 */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-[340px] sm:w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            {/* 헤더 */}
            <div className="relative bg-gradient-to-r from-primary-600 to-accent-500 px-5 py-5">
              {/* 닫기 버튼 — 우측 상단 */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="닫기"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="flex items-center gap-3 pr-8">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-tight">무료 상담 문의</p>
                  <p className="text-white/75 text-xs mt-0.5">부담 없이 문의하세요. 빠르게 답변드립니다.</p>
                </div>
              </div>
            </div>

            {/* 폼 */}
            <div className="p-5 overflow-y-auto" style={{ maxHeight: "calc(100vh - 220px)" }}>
              <ContactForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 플로팅 버튼 */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full shadow-xl flex items-center justify-center"
        aria-label="상담 위젯"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-white text-xl"
            >✕</motion.span>
          ) : (
            <motion.img
              key="icon"
              src="/consultant-icon.png"
              alt="상담"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-8 h-8 brightness-0 invert"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
