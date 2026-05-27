import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_ITEMS } from "../../lib/constants";
import { useScrollSection } from "../../hooks/useScrollSection";

export default function Navbar() {
  const { activeSection, scrollTo } = useScrollSection();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollTo("hero")}
            className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Typing<span className="font-medium text-primary-400">Edu</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-primary-600 bg-primary-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2 -mr-10">
            <button
              onClick={() => window.dispatchEvent(new Event("open-contact-widget"))}
              className="inline-flex items-center justify-center h-9 px-5 bg-primary-600 text-white rounded-lg text-sm font-medium leading-none hover:bg-primary-700 transition-colors"
            >
              무료 상담
            </button>
            <button
              onClick={() => window.dispatchEvent(new Event("open-event-popup"))}
              className="inline-flex items-center justify-center h-9 px-5 bg-yellow-400 text-yellow-900 rounded-lg text-sm font-medium leading-none hover:bg-yellow-300 transition-colors"
            >
              EVENT
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
            aria-label="메뉴"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollTo(item.id);
                    setMobileOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                    activeSection === item.id
                      ? "text-primary-600 bg-primary-50"
                      : "text-gray-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
