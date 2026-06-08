import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SAMPLE_CATEGORIES, SAMPLE_ITEMS } from "../../lib/constants";
import type { SampleItem } from "../../types";

/* 샘플교본 보기 — 상단 '샘플교본' 버튼으로 열리는 전체화면 오버레이.
   카테고리 탭으로 분류된 교구 샘플 그리드 + 클릭 시 데모 실행(iframe). */
export default function SampleTextbookOverlay() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("전체");
  const [demo, setDemo] = useState<SampleItem | null>(null);

  // 상단 버튼이 보내는 이벤트로 열림
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-sample-textbook", onOpen);
    return () => window.removeEventListener("open-sample-textbook", onOpen);
  }, []);

  // 열려 있는 동안: 배경 스크롤/관성스크롤 잠금, 닫히면 상태 초기화
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop?: () => void; start?: () => void } }).__lenis;
    if (open) {
      lenis?.stop?.();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start?.();
      document.body.style.overflow = "";
      setDemo(null);
      setCategory("전체");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC: 데모 열려있으면 데모만, 아니면 오버레이 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (demo) setDemo(null);
      else setOpen(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, demo]);

  const items =
    category === "전체" ? SAMPLE_ITEMS : SAMPLE_ITEMS.filter((i) => i.category === category);

  const countOf = (c: string) =>
    c === "전체" ? SAMPLE_ITEMS.length : SAMPLE_ITEMS.filter((i) => i.category === c).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[60] bg-gray-50 overflow-y-auto overscroll-contain"
        >
          {/* 헤더 + 카테고리 탭 */}
          <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">샘플 교본</h2>
                <p className="text-xs sm:text-sm text-gray-500">업종별 인터랙티브 교구 샘플을 둘러보세요</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex gap-2 overflow-x-auto">
              {SAMPLE_CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    category === c
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c}
                  <span
                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      category === c ? "bg-white/25 text-white" : "bg-white text-gray-500"
                    }`}
                  >
                    {countOf(c)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 카드 그리드 */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((it) => (
                <motion.button
                  key={it.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setDemo(it)}
                  className="group text-left bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-primary-300 transition-all"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={it.thumbnail}
                      alt={it.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 mb-2">
                      {it.category}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-snug">{it.title}</h3>
                    <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">{it.description}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-600">
                      미리보기 실행
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* 데모 실행 뷰어 */}
          <AnimatePresence>
            {demo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[70] bg-black/70 flex items-center justify-center p-3 sm:p-6"
                onClick={() => setDemo(null)}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-6xl h-[85vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl"
                >
                  <div className="flex items-center gap-3 px-4 py-2.5 shrink-0 bg-[#f0f0f0] border-b border-gray-300">
                    <div className="flex gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-1 border border-gray-300 min-w-0">
                      <span className="text-[11px] text-gray-500 truncate">{demo.title}</span>
                    </div>
                    <button
                      onClick={() => setDemo(null)}
                      aria-label="데모 닫기"
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <iframe src={demo.demoUrl} title={demo.title} className="flex-1 w-full bg-white" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
