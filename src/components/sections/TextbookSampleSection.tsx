import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─────────────────────────────────────────
   브라우저 창 프레임
───────────────────────────────────────── */
function BrowserFrame({ children, url }: { children: React.ReactNode; url: string }) {
  return (
    <div className="h-full flex flex-col rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      {/* 크롬 바 */}
      <div className="flex items-center gap-3 px-4 py-2.5 shrink-0 bg-[#f0f0f0] border-b border-gray-300">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center gap-2 bg-white rounded-md px-3 py-1 border border-gray-300">
          <svg className="w-3 h-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[11px] text-gray-500 truncate">{url}</span>
        </div>
      </div>
      {/* 콘텐츠 */}
      <div className="flex-1 overflow-hidden bg-white">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   쎈 수학 Before
───────────────────────────────────────── */
function MathBefore() {
  return (
    <div
      className="h-full flex flex-col overflow-hidden"
      style={{ fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", fontSize: 12 }}
    >
      <div className="px-3 py-2 flex items-center justify-between shrink-0" style={{ background: "#1a3a6e" }}>
        <div className="flex items-center gap-2">
          <span className="text-white font-black text-base tracking-tight">쎈</span>
          <span className="text-[10px]" style={{ color: "#93c5fd" }}>수학 B</span>
          <div className="w-px h-3 bg-blue-600" />
          <span className="text-[10px]" style={{ color: "#bfdbfe" }}>초등 5-1</span>
        </div>
        <span className="text-[10px]" style={{ color: "#bfdbfe" }}>Ⅳ. 분수의 덧셈과 뺄셈</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex items-center justify-center py-4 shrink-0" style={{ background: "#1e4d9b", width: 26 }}>
          <span className="text-white text-[10px] font-bold" style={{ writingMode: "vertical-rl", letterSpacing: "0.16em" }}>
            유형 08
          </span>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-auto bg-white">
          <div className="pb-1.5" style={{ borderBottom: "2px solid #1a3a6e" }}>
            <span className="font-bold text-sm" style={{ color: "#1a3a6e" }}>분모가 다른 분수의 덧셈</span>
          </div>
          <div className="rounded overflow-hidden" style={{ border: "1px solid #bfdbfe" }}>
            <div className="px-2 py-1 flex items-center gap-1.5" style={{ background: "#dbeafe", borderBottom: "1px solid #bfdbfe" }}>
              <div className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] text-white font-bold" style={{ background: "#1a3a6e" }}>개</div>
              <span className="text-[10px] font-bold" style={{ color: "#1a3a6e" }}>개념 정리</span>
            </div>
            <div className="p-2.5 space-y-1.5" style={{ background: "#eff6ff" }}>
              <p className="text-[11px] text-gray-700">분모가 다른 두 분수는 <span className="font-bold" style={{ color: "#1a3a6e" }}>통분</span>한 후 분자끼리 더합니다.</p>
              <div className="text-center font-mono text-sm py-1 rounded" style={{ background: "#fff", border: "1px solid #e0eaff" }}>
                ½ + ⅓ = ³⁄₆ + ²⁄₆ = <span className="font-bold" style={{ color: "#1a3a6e" }}>⁵⁄₆</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { n: 1, q: "계산하시오.", expr: "²⁄₃ + ¼ = ?" },
              { n: 2, q: "빈칸에 알맞은 수를 구하시오.", expr: "²⁄₅ + ¼ = □/20 + □/20 = □" },
              { n: 3, q: "[서술형] 계산하고 풀이 과정을 쓰시오.", expr: "³⁄₄ + ²⁄₅", lines: true },
            ].map((item) => (
              <div key={item.n} className="flex gap-2">
                <div className="w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5" style={{ background: "#1a3a6e" }}>
                  {item.n}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-[11px] text-gray-700">{item.q}</p>
                  <p className="text-[11px] font-mono text-gray-500">{item.expr}</p>
                  {item.lines && (
                    <div className="mt-2 space-y-2.5">
                      <div className="border-b border-dashed border-gray-300 h-4" />
                      <div className="border-b border-dashed border-gray-300 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-[9px] text-gray-300">수학 5-1</span>
            <span className="text-[10px] font-medium text-gray-400">78</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   능률 Grammar Inside Before
───────────────────────────────────────── */
function EnglishBefore() {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white" style={{ fontFamily: "'Apple SD Gothic Neo','Malgun Gothic',sans-serif", fontSize: 12 }}>
      <div className="px-4 pt-3 pb-2 border-b border-gray-200 shrink-0">
        <div className="flex items-baseline justify-between mb-0.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black tracking-tight" style={{ color: "#ea580c" }}>UNIT</span>
            <span className="text-3xl font-black leading-none" style={{ color: "#ea580c" }}>03</span>
          </div>
          <span className="text-[9px] text-gray-400">Grammar Inside · Level 2</span>
        </div>
        <p className="font-bold text-gray-800 text-sm mb-1">비교급과 최상급</p>
        <div className="h-0.5 rounded-full" style={{ background: "linear-gradient(to right,#ea580c,#fed7aa)" }} />
      </div>
      <div className="flex-1 p-3 space-y-3 overflow-auto">
        <div className="rounded overflow-hidden" style={{ border: "1px solid #93c5fd" }}>
          <div className="px-2.5 py-1.5" style={{ background: "#1d4ed8" }}>
            <span className="text-white text-[10px] font-bold tracking-wide">▶ GRAMMAR POINT 1</span>
          </div>
          <div className="p-2.5 space-y-1.5" style={{ background: "#eff6ff" }}>
            <p className="text-[11px] font-bold" style={{ color: "#1d4ed8" }}>
              형용사/부사의 비교급: 원급 + <span style={{ background: "#bfdbfe", padding: "0 4px", borderRadius: 2 }}>-er</span> + than
            </p>
            <div className="text-[10px] text-gray-600 space-y-0.5">
              <p>• tall → tall<strong style={{ color: "#1d4ed8" }}>er</strong> &nbsp;·&nbsp; fast → fast<strong style={{ color: "#1d4ed8" }}>er</strong></p>
              <p>• big → big<strong style={{ color: "#1d4ed8" }}>ger</strong> &nbsp;·&nbsp; happy → happ<strong style={{ color: "#1d4ed8" }}>ier</strong></p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Examples</p>
          <div className="space-y-2.5">
            {[
              { n: "1", pre: "He is", post: "than Tom.", hint: "(tall)" },
              { n: "2", pre: "She runs", post: "than I do.", hint: "(fast)" },
              { n: "3", pre: "This book is", post: "than that one.", hint: "(interesting)" },
            ].map((ex) => (
              <div key={ex.n} className="flex gap-1.5 text-[11px] text-gray-700 items-baseline flex-wrap">
                <span className="font-bold shrink-0" style={{ color: "#ea580c" }}>{ex.n}.</span>
                <span>{ex.pre}</span>
                <span className="inline-block border-b border-gray-400" style={{ width: 44, marginBottom: -1 }} />
                <span>{ex.post}</span>
                <span className="text-[9px] text-gray-400">{ex.hint}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <div className="px-2 py-0.5 rounded" style={{ background: "#ea580c" }}>
              <span className="text-white text-[9px] font-bold">Check Up</span>
            </div>
            <div className="flex-1 h-px" style={{ background: "#fed7aa" }} />
          </div>
          <div className="space-y-1.5">
            {[
              "Tom is ____________ than Mike. (강하다 → strong)",
              "This bag is ____________ than that. (무겁다 → heavy)",
              "She is ____________ than her sister. (바쁘다 → busy)",
            ].map((q, i) => (
              <div key={i} className="flex gap-1 text-[10px] text-gray-600">
                <span className="font-bold shrink-0">({i + 1})</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <span className="text-[9px] text-gray-300">p. 42</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   수학 After — 풀와이드 웹앱 UI
───────────────────────────────────────── */
function MathAfter() {
  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "system-ui,sans-serif", background: "#f8faff" }}>
      {/* 상단 내비 */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>초등 5학년</span>
          <span>›</span>
          <span>분수의 덧셈</span>
          <span>›</span>
          <span className="font-semibold text-gray-700">유형 08 · 3번</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="text-sm font-bold text-gray-700">320</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">김</span>
          </div>
        </div>
      </div>

      {/* 진행바 */}
      <div className="px-5 pt-3 pb-0 shrink-0">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
          <span>문제 3 / 5</span>
          <span className="text-green-500 font-semibold">🔥 3연속 정답!</span>
        </div>
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(to right,#1a3a6e,#3b82f6)" }}
            initial={{ width: "40%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* 문제 + 보기 */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-4 gap-5">
        {/* 문제 카드 */}
        <div className="w-full rounded-2xl p-5 text-center" style={{ background: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "1.5px solid #bfdbfe" }}>
          <p className="text-xs font-semibold text-blue-500 mb-3 tracking-wide uppercase">다음을 계산하시오</p>
          <div className="flex items-center justify-center gap-4">
            <span className="text-5xl font-black" style={{ color: "#1a3a6e" }}>²⁄₃</span>
            <span className="text-3xl font-bold text-blue-300">+</span>
            <span className="text-5xl font-black" style={{ color: "#1a3a6e" }}>¼</span>
            <span className="text-3xl font-bold text-gray-200">=</span>
            <span className="text-4xl font-black text-gray-200">?</span>
          </div>
          {/* 타이머 */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-1.5 w-32 rounded-full bg-blue-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-blue-400"
                initial={{ width: "100%" }}
                animate={{ width: "55%" }}
                transition={{ duration: 2, ease: "linear" }}
              />
            </div>
            <span className="text-xs text-blue-400 font-medium">12초</span>
          </div>
        </div>

        {/* 선택지 — 2×2 그리드 */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {[
            { val: "⁵⁄₆", ok: false },
            { val: "¹¹⁄₁₂", ok: true },
            { val: "³⁄₇", ok: false },
            { val: "⁷⁄₁₂", ok: false },
          ].map((c, i) => (
            <motion.div
              key={i}
              whileHover={!c.ok ? { scale: 1.02 } : {}}
              className="rounded-xl py-3.5 text-center font-black text-2xl cursor-pointer"
              style={
                c.ok
                  ? { background: "#22c55e", color: "white", boxShadow: "0 4px 20px rgba(34,197,94,0.35)" }
                  : { background: "white", color: "#374151", border: "1.5px solid #e5e7eb", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }
              }
            >
              {c.val}
              {c.ok && <div className="text-xs font-semibold mt-0.5 opacity-90">정답! ✓</div>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 하단 바 */}
      <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
        <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← 이전 문제</button>
        <div className="flex gap-1.5">
          {[1,2,3,4,5].map(n => (
            <div key={n} className={`w-2 h-2 rounded-full ${n <= 3 ? "bg-blue-500" : "bg-gray-200"}`} />
          ))}
        </div>
        <button className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors">다음 문제 →</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   영어 After — 풀와이드 웹앱 UI
───────────────────────────────────────── */
function EnglishAfter() {
  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "system-ui,sans-serif", background: "#fff8f5" }}>
      {/* 상단 내비 */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>중등 1학년</span>
          <span>›</span>
          <span>Grammar Inside</span>
          <span>›</span>
          <span className="font-semibold text-gray-700">UNIT 03 · 비교급</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-0.5">
            {[1,2,3].map(s => (
              <span key={s} className="text-sm" style={{ color: s <= 2 ? "#fbbf24" : "#e5e7eb" }}>★</span>
            ))}
          </div>
          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-xs font-bold text-orange-600">이</span>
          </div>
        </div>
      </div>

      {/* 진행바 */}
      <div className="px-5 pt-3 pb-0 shrink-0">
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          <span>문제 3 / 6</span>
          <span className="font-semibold text-orange-500">Grammar Point 1</span>
        </div>
        <div className="h-2 rounded-full bg-orange-100 overflow-hidden">
          <div className="h-full rounded-full w-1/2" style={{ background: "linear-gradient(to right,#ea580c,#f97316)" }} />
        </div>
      </div>

      {/* 문제 영역 */}
      <div className="flex-1 flex flex-col px-5 py-4 gap-4 overflow-hidden">
        {/* 문제 카드 */}
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,#fff7ed,#ffedd5)", border: "1.5px solid #fed7aa" }}>
          <p className="text-xs font-bold text-orange-500 uppercase tracking-wide mb-3">빈칸에 알맞은 비교급을 선택하세요</p>
          <p className="text-xl font-semibold text-gray-800 leading-relaxed">
            He is{" "}
            <motion.span
              className="inline-block font-black border-b-2 px-2 min-w-[72px] text-center"
              style={{ borderColor: "#ea580c", color: "#ea580c", verticalAlign: "bottom" }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              taller
            </motion.span>
            {" "}than Tom.
          </p>
          <p className="text-xs text-gray-400 mt-2">힌트: tall의 비교급은?</p>
        </div>

        {/* 단어 선택지 */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2.5">보기에서 선택하세요</p>
          <div className="flex flex-wrap gap-2">
            {[
              { word: "taller", sel: true },
              { word: "tallest", sel: false },
              { word: "more tall", sel: false },
              { word: "most tall", sel: false },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={!item.sel ? { scale: 1.03 } : {}}
                className="px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-all"
                style={
                  item.sel
                    ? { background: "#ea580c", color: "white", boxShadow: "0 4px 14px rgba(234,88,12,0.3)" }
                    : { background: "white", color: "#374151", border: "1.5px solid #e5e7eb" }
                }
              >
                {item.word}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 완료 목록 */}
        <div>
          <p className="text-xs font-semibold text-gray-400 mb-2">완료한 문제</p>
          <div className="flex flex-wrap gap-2">
            {["fast → faster", "big → bigger"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 바 */}
      <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between shrink-0">
        <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">← 이전</button>
        <div className="flex gap-1.5">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className={`w-2 h-2 rounded-full ${n <= 3 ? "bg-orange-400" : "bg-gray-200"}`} />
          ))}
        </div>
        <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all" style={{ background: "#ea580c" }}>
          다음 →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   샘플 데이터
───────────────────────────────────────── */
const SAMPLES = [
  {
    id: "math",
    subject: "수학",
    grade: "초등 5학년",
    ref: "쎈 수학 B",
    accent: "#1a3a6e",
    url: "typx.ai/play/math-fraction-05",
    before: <MathBefore />,
    after: <MathAfter />,
  },
  {
    id: "english",
    subject: "영어",
    grade: "중등 1학년",
    ref: "능률 Grammar Inside",
    accent: "#ea580c",
    url: "typx.ai/play/grammar-comparative-01",
    before: <EnglishBefore />,
    after: <EnglishAfter />,
  },
];

/* ─────────────────────────────────────────
   메인 섹션
───────────────────────────────────────── */
export default function TextbookSampleSection() {
  const [current, setCurrent] = useState(0);
  const sample = SAMPLES[current];

  return (
    <section className="py-24 bg-gradient-to-b from-white via-slate-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-primary-600 font-semibold text-sm tracking-wide uppercase">
            Before & After
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 mb-4">
            교재 속 문제가 이렇게 바뀝니다
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            종이 교재의 문제를 그대로 인터랙티브 디지털 교구로 변환합니다.
          </p>
        </motion.div>

        {/* 탭 */}
        <div className="flex justify-center gap-2 mb-10">
          {SAMPLES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={
                current === i
                  ? { background: s.accent, color: "white", boxShadow: "0 4px 14px rgba(0,0,0,0.18)" }
                  : { background: "#f3f4f6", color: "#4b5563" }
              }
            >
              {s.subject} · {s.grade}
              <span className="ml-2 text-[10px] opacity-60 font-normal hidden sm:inline">
                ({s.ref})
              </span>
            </button>
          ))}
        </div>

        {/* Before / After */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 items-stretch">

            {/* Before */}
            <div>
              <div className="flex justify-center mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  BEFORE · 종이 교재
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`before-${sample.id}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  className="rounded-2xl border border-amber-200/70 shadow overflow-hidden h-[420px]"
                  style={{
                    background: "#fafaf8",
                    backgroundImage: "repeating-linear-gradient(transparent,transparent 27px,#e5e7eb1a 28px)",
                  }}
                >
                  {sample.before}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* After — 브라우저 창 */}
            <div>
              <div className="flex justify-center mb-3">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: sample.accent }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  AFTER · 디지털 교구
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`after-${sample.id}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.22 }}
                  className="h-[420px]"
                >
                  <BrowserFrame url={sample.url}>
                    {sample.after}
                  </BrowserFrame>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* 변환 화살표 */}
          <div className="flex justify-center mt-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-full text-sm text-gray-500 border border-gray-100">
              <span>종이 교재</span>
              <svg className="w-5 h-5" style={{ color: sample.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-medium" style={{ color: sample.accent }}>인터랙티브 디지털 교구로 변환</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
