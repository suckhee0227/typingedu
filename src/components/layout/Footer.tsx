import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import termsText from "../../content/terms.md?raw";
import privacyText from "../../content/privacy.md?raw";

type LegalKey = "terms" | "privacy";
const LEGAL: Record<LegalKey, { title: string; text: string }> = {
  terms: { title: "이용약관", text: termsText },
  privacy: { title: "개인정보보호방침", text: privacyText },
};

// 마크다운 → 예쁜 약관 문서 스타일
const mdComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="mb-5 text-xl font-bold text-gray-900">{children}</h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="mt-7 mb-2 border-l-[3px] border-primary-400 pl-2.5 text-base font-bold text-gray-900">{children}</h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="mt-4 mb-1.5 text-sm font-semibold text-gray-800">{children}</h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 text-sm leading-relaxed text-gray-600">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600 marker:text-primary-400">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600 marker:font-semibold marker:text-primary-500">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => <li className="pl-0.5">{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold text-gray-800">{children}</strong>,
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a href={href} className="text-primary-600 underline underline-offset-2" target="_blank" rel="noreferrer">{children}</a>
  ),
  hr: () => <hr className="my-6 border-gray-100" />,
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mb-3 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-gray-600">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left font-semibold text-gray-700">{children}</th>
  ),
  td: ({ children }: { children?: ReactNode }) => <td className="border border-gray-200 px-3 py-2 align-top">{children}</td>,
};

export default function Footer() {
  const [legal, setLegal] = useState<LegalKey | null>(null);

  useEffect(() => {
    if (!legal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setLegal(null);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [legal]);

  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-2xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Typing<span className="font-medium text-primary-300">Edu</span>
            </h3>
            <p className="text-sm leading-relaxed">
              특허 출원 자체 엔진 기반 맞춤형 스마트 교구 제작 전문
              <br />
              교육 기관의 철학을 디지털로 구현합니다.
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">연락처</h4>
            <ul className="space-y-2 text-sm">
              <li>이메일: help@vibeedu.ai</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#portfolio" className="hover:text-white transition-colors">
                  포트폴리오
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  가격안내
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  문의하기
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div>
            &copy; {new Date().getFullYear()} <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>typingedu</span>. All rights reserved.
          </div>
          <div className="flex gap-4">
            <button onClick={() => setLegal("privacy")} className="hover:text-white transition-colors">
              개인정보보호방침
            </button>
            <button onClick={() => setLegal("terms")} className="hover:text-white transition-colors">
              이용약관
            </button>
          </div>
        </div>
      </div>

      {/* 약관/방침 모달 — 이미지 문서 표시 */}
      <AnimatePresence>
        {legal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLegal(null)}
            data-lenis-prevent
            className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-4 flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-bold text-gray-900">{LEGAL[legal].title}</h3>
                <button
                  onClick={() => setLegal(null)}
                  aria-label="닫기"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div data-lenis-prevent className="overflow-y-auto px-6 py-6 sm:px-8">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {LEGAL[legal].text}
                </ReactMarkdown>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
