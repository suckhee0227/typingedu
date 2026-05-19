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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 bg-white rounded-2xl shadow-xl border border-gray-100 w-80 sm:w-96 max-h-[80vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-500 px-5 py-4 text-white">
              <p className="font-bold text-sm">무료 상담 문의</p>
              <p className="text-white/80 text-xs mt-0.5">
                맞춤형 교구 제작, 부담 없이 문의하세요.
              </p>
            </div>

            {/* Form */}
            <div className="p-5 overflow-y-auto">
              <ContactForm />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="상담 위젯"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </motion.button>
    </div>
  );
}
