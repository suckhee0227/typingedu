// import section
import { AppHelper } from "./appHelper";

// ───────── 인터페이스 ─────────
interface IAssetList { images: any[]; sounds: any[]; }
interface IAppData { logicalWidth: number; logicalHeight: number; }
interface ITheme { primary: string; primaryDark: string; bgTop: string; bgBottom: string; charTop: string; charBottom: string; }
interface IIconItem { icon: string; label: string; }
interface ICard { icon: string; title: string; desc: string; }
interface IQuizItem { q: string; a: string; expl: string; }
interface IContact { name: string; phone: string; hours: string; note: string; }
interface ITextData {
  theme: ITheme; mascot: string; motif: string; layout: string;
  startSub: string; startTitle: string; startDesc: string;
  usageGuide: IIconItem[]; timeInfo: string; quizInfo: string; startBtn: string;
  cardsTitle: string; cards: ICard[]; cardPrev: string; cardNext: string; cardDone: string;
  checklistTitle: string; checklistDesc: string; checklistItems: IIconItem[];
  checklistProgress: string; checklistHint: string; checklistNext: string;
  quizTitle: string; quizItems: IQuizItem[]; nextBtn: string; lastBtn: string;
  correctText: string; wrongText: string;
  resultTitle: string; resultPerfect: string; resultGood: string; resultScore: string; resultDesc: string; restartBtn: string;
  contact: IContact;
}

// ───────── 상태 ─────────
let assetList: IAssetList;
let appData: IAppData;
let textData: ITextData;
let theme: ITheme;
let mascot = "💧";
let motif = "";
let layoutId = "softLeft";

let appCanvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let uiLayer: HTMLElement;

let currentState = "START";
let cardIndex = 0;
let quizIndex = 0;
let score = 0;
let checklistStatus: boolean[] = [];
let quizAnswered = false;
let time = 0;
let animationFrameId = 0;

interface IConfetti { x: number; y: number; vx: number; vy: number; size: number; color: string; rot: number; vr: number; }
let confetti: IConfetti[] = [];
let celebrating = false;

const BUBBLES = [
  { x: 230, y: 240, r: 50, phase: 0 }, { x: 1750, y: 880, r: 90, phase: 1.2 },
  { x: 1620, y: 170, r: 40, phase: 2.4 }, { x: 160, y: 860, r: 70, phase: 3.6 },
  { x: 780, y: 990, r: 30, phase: 4.8 }, { x: 90, y: 520, r: 35, phase: 0.6 },
];

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0,2),16)}, ${parseInt(h.substring(2,4),16)}, ${parseInt(h.substring(4,6),16)}, ${alpha})`;
}

// ───────── 레이아웃 정의 (진료과별로 화면 구성이 다름) ─────────
interface IRect { left: number; top: number; width: number; height: number; }
interface ILayout {
  radius: number;
  mascot: { left: number; top: number; size: number } | null;
  chrome: "sidebarL" | "topHero" | "topBar" | "bottomBar" | "none";
  short: IRect;   // START / RESULT
  tall: IRect;    // CARDS / CHECKLIST / QUIZ
}
const LAYOUTS: { [k: string]: ILayout } = {
  // 정형외과 — 좌측 사이드바
  sidebarL: { radius: 32, chrome: "sidebarL", mascot: { left: 13.5, top: 31, size: 196 },
    short: { left: 32, top: 12, width: 63, height: 76 }, tall: { left: 32, top: 6, width: 63, height: 88 } },
  // 소아과 — 상단 히어로(큰 캐릭터)
  topHero: { radius: 46, chrome: "topHero", mascot: { left: 50, top: 14, size: 200 },
    short: { left: 13, top: 29, width: 74, height: 68 }, tall: { left: 11, top: 25, width: 78, height: 74 } },
  // 치과 — 상단 헤더바 + 중앙
  topBar: { radius: 28, chrome: "topBar", mascot: { left: 50, top: 9.5, size: 116 },
    short: { left: 16, top: 17, width: 68, height: 73 }, tall: { left: 13, top: 16, width: 74, height: 81 } },
  // 안과 — 중앙 집중(좁은 컬럼)
  centered: { radius: 40, chrome: "none", mascot: { left: 50, top: 13, size: 162 },
    short: { left: 25, top: 23, width: 50, height: 71 }, tall: { left: 22, top: 22, width: 56, height: 75 } },
  // 내과 — 문서/클립보드(우측 캐릭터)
  document: { radius: 18, chrome: "none", mascot: { left: 80, top: 33, size: 196 },
    short: { left: 5, top: 13, width: 66, height: 72 }, tall: { left: 5, top: 7, width: 68, height: 87 } },
  // 요양병원 — 큰 글씨 + 하단바
  bottomBar: { radius: 34, chrome: "bottomBar", mascot: { left: 50, top: 10, size: 138 },
    short: { left: 9, top: 15, width: 82, height: 70 }, tall: { left: 7, top: 14, width: 86, height: 76 } },
  // 산부인과 — 좌측 캐릭터 soft
  softLeft: { radius: 52, chrome: "none", mascot: { left: 14, top: 41, size: 208 },
    short: { left: 37, top: 12, width: 58, height: 76 }, tall: { left: 35, top: 6, width: 60, height: 88 } },
  // 동물병원 — 우측 캐릭터(미러)
  mirrorR: { radius: 40, chrome: "none", mascot: { left: 80, top: 41, size: 208 },
    short: { left: 5, top: 12, width: 58, height: 76 }, tall: { left: 5, top: 8, width: 58, height: 84 } },
};
function L(): ILayout { return LAYOUTS[layoutId] || LAYOUTS.softLeft; }

function injectStyles(): void {
  if (document.getElementById("appAnims")) return;
  const s = document.createElement("style");
  s.id = "appAnims";
  s.textContent = `
@keyframes fadeInUp { from { opacity:0; transform:translateY(48px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@keyframes pop { 0%{transform:scale(0.6);} 60%{transform:scale(1.18);} 100%{transform:scale(1);} }
@keyframes popIn { 0%{transform:scale(0);opacity:0;} 70%{transform:scale(1.2);} 100%{transform:scale(1);opacity:1;} }
@keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-14px);} 40%{transform:translateX(14px);} 60%{transform:translateX(-9px);} 80%{transform:translateX(9px);} }
@keyframes pulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.04);} }
@keyframes floatY { 0%,100%{transform:translate(-50%,-50%);} 50%{transform:translate(-50%,calc(-50% - 16px));} }
`;
  document.head.appendChild(s);
}

function clearUI(): void { while (uiLayer.firstChild) uiLayer.removeChild(uiLayer.firstChild); }

// ── 마스코트 DOM ──
function makeMascotEl(): HTMLElement {
  const lay = L();
  if (!lay.mascot) return document.createElement("div");
  const sz = lay.mascot.size;
  const el = AppHelper.createUIElement("div", "", {
    position: "absolute", left: lay.mascot.left + "%", top: lay.mascot.top + "%",
    width: sz + "px", height: sz + "px", transform: "translate(-50%,-50%)",
    borderRadius: "50%", backgroundColor: "#FFFFFF",
    border: `${Math.round(sz * 0.045)}px solid ${hexToRgba(theme.charBottom, 0.9)}`,
    boxShadow: `0 14px 32px ${hexToRgba(theme.primary, 0.28)}`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: Math.round(sz * 0.5) + "px", zIndex: "3", pointerEvents: "none",
    animation: "floatY 3.2s ease-in-out infinite",
  }, mascot);
  return el;
}

// ── 레이아웃별 크롬(사이드바/상단바 등) ──
function addChrome(): void {
  const lay = L();
  const grad = `linear-gradient(160deg, ${theme.primary}, ${theme.primaryDark})`;
  const common: Partial<CSSStyleDeclaration> = { position: "absolute", zIndex: "0", pointerEvents: "none", background: grad };
  if (lay.chrome === "sidebarL") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "0", top: "0", width: "27%", height: "100%", borderRadius: "0 56px 56px 0" }));
  } else if (lay.chrome === "topHero") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "0", top: "0", width: "100%", height: "30%", borderRadius: "0 0 70px 70px" }));
  } else if (lay.chrome === "topBar") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "4%", top: "3.5%", width: "92%", height: "11%", borderRadius: "30px" }));
  } else if (lay.chrome === "bottomBar") {
    uiLayer.appendChild(AppHelper.createUIElement("div", "", { ...common, left: "0", bottom: "0", width: "100%", height: "9%", borderRadius: "60px 60px 0 0" }));
  }
}

// ── 한 화면 프레임 적용: 크롬+마스코트+콘텐츠 카드 생성 후 카드 반환 ──
function applyScreen(screen: string): HTMLElement {
  clearUI();
  addChrome();
  const lay = L();
  if (lay.mascot) uiLayer.appendChild(makeMascotEl());
  const r = (screen === "START" || screen === "RESULT") ? lay.short : lay.tall;
  const card = AppHelper.createUIElement("div", "", {
    position: "absolute", left: r.left + "%", top: r.top + "%", width: r.width + "%", height: r.height + "%",
    backgroundColor: "rgba(255,255,255,0.97)", borderRadius: lay.radius + "px",
    display: "flex", flexDirection: "column", alignItems: "center", boxSizing: "border-box",
    boxShadow: `0 18px 40px ${hexToRgba(theme.primary, 0.18)}`, pointerEvents: "auto",
    fontFamily: "sans-serif", zIndex: "1", animation: "fadeInUp 0.5s ease both", overflow: "hidden",
  });
  uiLayer.appendChild(card);
  return card;
}

function setStyle(el: HTMLElement, s: Partial<CSSStyleDeclaration>): void { Object.assign(el.style, s); }

function showScreen(state: string): void {
  currentState = state;
  celebrating = false; confetti = [];
  if (state === "START") renderStart();
  else if (state === "CARDS") renderCards();
  else if (state === "CHECKLIST") renderChecklist();
  else if (state === "QUIZ") { quizAnswered = false; renderQuiz(); }
  else if (state === "RESULT") renderResult();
}

// ───────── 화면들 ─────────
function renderStart(): void {
  const c = applyScreen("START");
  setStyle(c, { justifyContent: "center", padding: "4% 6%", rowGap: "3%" });

  const tg = AppHelper.createUIElement("div", "", { textAlign: "center" });
  tg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "34px", color: theme.primary, fontWeight: "bold", marginBottom: "14px" }, textData.startSub));
  tg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "60px", color: "#333", fontWeight: "900", lineHeight: "1.25", whiteSpace: "pre-line" }, textData.startTitle));
  c.appendChild(tg);

  c.appendChild(AppHelper.createUIElement("div", "", { fontSize: "36px", color: "#666", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.45" }, textData.startDesc));

  const guide = AppHelper.createUIElement("div", "", { display: "flex", width: "94%", justifyContent: "space-between", columnGap: "3%" });
  for (const g of textData.usageGuide) {
    const cell = AppHelper.createUIElement("div", "", { flex: "1", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: hexToRgba(theme.primary, 0.08), borderRadius: "20px", padding: "14px 6px", rowGap: "8px" });
    cell.appendChild(AppHelper.createUIElement("div", "", { fontSize: "36px" }, g.icon));
    cell.appendChild(AppHelper.createUIElement("div", "", { fontSize: "23px", color: "#555", textAlign: "center", lineHeight: "1.3", whiteSpace: "pre-line" }, g.label));
    guide.appendChild(cell);
  }
  c.appendChild(guide);

  c.appendChild(AppHelper.createUIElement("button", "startBtn", {
    width: "82%", minHeight: "108px", padding: "18px 0", marginTop: "1%",
    fontSize: "48px", fontWeight: "bold", fontFamily: "sans-serif",
    backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer",
    boxShadow: `0 10px 24px ${hexToRgba(theme.primary, 0.35)}`, animation: "pulse 2s ease-in-out infinite",
  }, textData.startBtn, [{ event: "click", handler: () => showScreen("CARDS") }]));
}

function renderCards(): void {
  const total = textData.cards.length;
  const card = textData.cards[cardIndex];
  const isLast = cardIndex === total - 1;
  const c = applyScreen("CARDS");
  setStyle(c, { justifyContent: "flex-start", padding: "4% 5% 5%" });

  const header = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center", marginBottom: "2%" });
  header.appendChild(AppHelper.createUIElement("div", "", { fontSize: "30px", color: theme.primary, fontWeight: "bold" }, `${textData.cardsTitle}  ${cardIndex + 1} / ${total}`));
  c.appendChild(header);

  const middle = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "4%" });
  const box = AppHelper.createUIElement("div", "", { width: "86%", backgroundColor: hexToRgba(theme.primary, 0.07), border: `3px solid ${hexToRgba(theme.primary, 0.25)}`, borderRadius: "30px", padding: "5% 6%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "20px", animation: "slideIn 0.3s ease both" });
  box.appendChild(AppHelper.createUIElement("div", "", { width: "140px", height: "140px", minHeight: "140px", borderRadius: "50%", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "78px", boxShadow: `0 8px 20px ${hexToRgba(theme.primary, 0.2)}` }, card.icon));
  if (card.title) {
    box.appendChild(AppHelper.createUIElement("div", "", { fontSize: "48px", color: "#333", fontWeight: "900", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.3" }, card.title));
    box.appendChild(AppHelper.createUIElement("div", "", { fontSize: "36px", color: "#555", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5" }, card.desc));
  } else {
    box.appendChild(AppHelper.createUIElement("div", "", { fontSize: "44px", color: "#333", fontWeight: "bold", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.45" }, card.desc));
  }
  const dots = AppHelper.createUIElement("div", "", { display: "flex", columnGap: "14px", justifyContent: "center", marginTop: "1%" });
  for (let i = 0; i < total; i++) dots.appendChild(AppHelper.createUIElement("div", "", { width: i === cardIndex ? "42px" : "16px", height: "16px", borderRadius: "8px", backgroundColor: i === cardIndex ? theme.primary : hexToRgba(theme.primary, 0.25), transition: "all 0.25s" }));
  middle.appendChild(box);
  middle.appendChild(dots);
  c.appendChild(middle);

  const nav = AppHelper.createUIElement("div", "", { width: "100%", display: "flex", justifyContent: "space-between", columnGap: "4%", marginTop: "2%" });
  nav.appendChild(AppHelper.createUIElement("button", "", { width: "26%", minHeight: "92px", padding: "16px 0", fontSize: "36px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: cardIndex === 0 ? "#EEE" : "#FFF", color: cardIndex === 0 ? "#BBB" : theme.primary, border: `3px solid ${cardIndex === 0 ? "#EEE" : hexToRgba(theme.primary, 0.4)}`, borderRadius: "50px", cursor: cardIndex === 0 ? "default" : "pointer" }, textData.cardPrev, [{ event: "click", handler: () => { if (cardIndex > 0) { cardIndex--; renderCards(); } } }]));
  nav.appendChild(AppHelper.createUIElement("button", "", { flex: "1", minHeight: "92px", padding: "16px 0", fontSize: "38px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 8px 18px ${hexToRgba(theme.primary, 0.3)}` }, isLast ? textData.cardDone : textData.cardNext, [{ event: "click", handler: () => { if (isLast) { cardIndex = 0; showScreen("CHECKLIST"); } else { cardIndex++; renderCards(); } } }]));
  c.appendChild(nav);
}

function renderChecklist(): void {
  const c = applyScreen("CHECKLIST");
  setStyle(c, { justifyContent: "flex-start", padding: "4% 5% 5%" });
  const total = textData.checklistItems.length;
  const done = checklistStatus.filter(Boolean).length;

  const hg = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "1.5%", width: "100%" });
  hg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "46px", color: theme.primary, fontWeight: "900", marginBottom: "6px" }, textData.checklistTitle));
  hg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "28px", color: "#666", whiteSpace: "pre-line" }, textData.checklistDesc));
  c.appendChild(hg);

  const pw = AppHelper.createUIElement("div", "", { width: "100%", marginBottom: "2%", display: "flex", flexDirection: "column", alignItems: "center" });
  pw.appendChild(AppHelper.createUIElement("div", "", { fontSize: "28px", color: theme.primary, fontWeight: "bold", marginBottom: "8px" }, (textData.checklistProgress || "{done}/{total}").replace("{done}", String(done)).replace("{total}", String(total))));
  const track = AppHelper.createUIElement("div", "", { width: "86%", height: "14px", backgroundColor: "#EFECEA", borderRadius: "10px", overflow: "hidden" });
  track.appendChild(AppHelper.createUIElement("div", "", { width: `${(done / total) * 100}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 0.35s ease" }));
  pw.appendChild(track);
  c.appendChild(pw);

  const list = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "10px" });
  for (let i = 0; i < total; i++) {
    const on = checklistStatus[i];
    const it = textData.checklistItems[i];
    const row = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", minHeight: "0", display: "flex", alignItems: "center", backgroundColor: on ? hexToRgba(theme.primary, 0.08) : "#F8F8F8", borderRadius: "18px", padding: "0 3.5%", boxSizing: "border-box", cursor: "pointer", border: on ? `3px solid ${theme.primary}` : "3px solid transparent", transition: "all 0.2s" }, "", [{ event: "click", handler: () => { checklistStatus[i] = !checklistStatus[i]; renderChecklist(); } }]);
    row.appendChild(AppHelper.createUIElement("div", "", { width: "60px", height: "60px", minWidth: "60px", borderRadius: "16px", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px", marginRight: "3.5%", boxShadow: on ? `0 4px 12px ${hexToRgba(theme.primary, 0.25)}` : "0 2px 8px rgba(0,0,0,0.06)" }, it.icon));
    row.appendChild(AppHelper.createUIElement("div", "", { fontSize: "30px", color: on ? "#333" : "#777", fontWeight: on ? "bold" : "normal", flex: "1", lineHeight: "1.3" }, it.label));
    const ck = AppHelper.createUIElement("div", "", { width: "48px", height: "48px", minWidth: "48px", borderRadius: "24px", border: on ? "none" : "4px solid #CCC", backgroundColor: on ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "2.5%", boxSizing: "border-box" });
    if (on) { ck.style.animation = "pop 0.3s ease"; ck.appendChild(AppHelper.createUIElement("div", "", { color: "#FFF", fontSize: "30px", fontWeight: "bold" }, "✓")); }
    row.appendChild(ck);
    list.appendChild(row);
  }
  c.appendChild(list);

  const all = checklistStatus.every(Boolean);
  c.appendChild(AppHelper.createUIElement("div", "", { fontSize: "25px", color: "#AAA", marginTop: "1.5%", textAlign: "center", opacity: all ? "0" : "1", transition: "opacity 0.3s" }, textData.checklistHint || ""));
  c.appendChild(AppHelper.createUIElement("button", "checkNextBtn", { width: "80%", minHeight: "92px", padding: "16px 0", marginTop: "1.5%", fontSize: "40px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: all ? theme.primary : "#DDD", color: "#FFF", border: "none", borderRadius: "50px", cursor: all ? "pointer" : "not-allowed", boxShadow: all ? `0 10px 20px ${hexToRgba(theme.primary, 0.3)}` : "none", transition: "background-color 0.3s", animation: all ? "pop 0.3s ease" : "none" }, textData.checklistNext, [{ event: "click", handler: () => { if (all) showScreen("QUIZ"); } }]));
}

function renderQuiz(): void {
  const q = textData.quizItems[quizIndex];
  const total = textData.quizItems.length;
  const isLast = quizIndex === total - 1;
  const c = applyScreen("QUIZ");
  setStyle(c, { justifyContent: "flex-start", padding: "5% 5% 6%" });

  const track = AppHelper.createUIElement("div", "", { width: "100%", height: "14px", backgroundColor: "#EFECEA", borderRadius: "10px", overflow: "hidden", marginBottom: "2%" });
  track.appendChild(AppHelper.createUIElement("div", "", { width: `${((quizIndex + 1) / total) * 100}%`, height: "100%", backgroundColor: theme.primary, borderRadius: "10px", transition: "width 0.35s ease" }));
  c.appendChild(track);

  const mid = AppHelper.createUIElement("div", "", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "6%" });
  const hg = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center" });
  hg.appendChild(AppHelper.createUIElement("div", "", { display: "inline-block", backgroundColor: theme.primary, color: "#FFF", fontSize: "32px", fontWeight: "bold", padding: "9px 28px", borderRadius: "30px", marginBottom: "22px" }, `Q${quizIndex + 1} / ${total}`));
  hg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "50px", color: "#333", fontWeight: "900", whiteSpace: "pre-line", lineHeight: "1.5" }, q.q));
  const ox = AppHelper.createUIElement("div", "", { display: "flex", width: "88%", height: "180px", minHeight: "180px", justifyContent: "space-between" });
  const bO = AppHelper.createUIElement("button", "btnO", { width: "45%", height: "100%", fontSize: "120px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: "#4CAF50", color: "#FFF", border: "none", borderRadius: "36px", boxShadow: "0 10px 20px rgba(76,175,80,0.4)", cursor: "pointer", transition: "all 0.3s" }, "O");
  const bX = AppHelper.createUIElement("button", "btnX", { width: "45%", height: "100%", fontSize: "120px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: "#F44336", color: "#FFF", border: "none", borderRadius: "36px", boxShadow: "0 10px 20px rgba(244,67,54,0.4)", cursor: "pointer", transition: "all 0.3s" }, "X");
  ox.appendChild(bO); ox.appendChild(bX);
  const fb = AppHelper.createUIElement("div", "", { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "16px", opacity: "0", transition: "opacity 0.3s" });
  const mark = AppHelper.createUIElement("div", "", { fontSize: "54px", fontWeight: "900" });
  const expl = AppHelper.createUIElement("div", "", { fontSize: "36px", color: "#555", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5", width: "95%" });
  const nx = AppHelper.createUIElement("button", "nextBtn", { width: "80%", minHeight: "100px", padding: "18px 0", marginTop: "8px", fontSize: "42px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 8px 18px ${hexToRgba(theme.primary, 0.3)}` }, isLast ? textData.lastBtn || textData.nextBtn : textData.nextBtn);
  fb.appendChild(mark); fb.appendChild(expl); fb.appendChild(nx);
  mid.appendChild(hg); mid.appendChild(ox); mid.appendChild(fb);
  c.appendChild(mid);

  const ans = (a: string) => {
    if (quizAnswered) return; quizAnswered = true;
    const ok = a === q.a; if (ok) score++;
    bO.style.opacity = a === "O" ? "1" : "0.3"; bX.style.opacity = a === "X" ? "1" : "0.3";
    (a === "O" ? bO : bX).style.animation = ok ? "pop 0.4s ease" : "shake 0.4s ease";
    mark.textContent = ok ? (textData.correctText || "정답이에요!") : (textData.wrongText || "다시 확인해요");
    mark.style.color = ok ? "#4CAF50" : "#F44336"; mark.style.animation = "popIn 0.4s ease both";
    expl.textContent = q.expl; fb.style.opacity = "1";
    nx.addEventListener("click", () => { quizIndex++; if (quizIndex >= total) showScreen("RESULT"); else showScreen("QUIZ"); });
  };
  bO.addEventListener("click", () => ans("O"));
  bX.addEventListener("click", () => ans("X"));
}

function renderResult(): void {
  const total = textData.quizItems.length;
  const perfect = score === total;
  if (perfect) startCelebration();
  const c = applyScreen("RESULT");
  setStyle(c, { justifyContent: "center", padding: "5% 6%", rowGap: "3%" });

  const h = AppHelper.createUIElement("div", "", { textAlign: "center" });
  h.appendChild(AppHelper.createUIElement("div", "", { fontSize: "60px", color: theme.primary, fontWeight: "900", marginBottom: "14px" }, textData.resultTitle));
  h.appendChild(AppHelper.createUIElement("div", "", { fontSize: "34px", color: "#555", whiteSpace: "pre-line", lineHeight: "1.5" }, perfect ? textData.resultPerfect : textData.resultGood));
  c.appendChild(h);

  const sg = AppHelper.createUIElement("div", "", { display: "flex", flexDirection: "column", alignItems: "center", rowGap: "10px" });
  sg.appendChild(AppHelper.createUIElement("div", "", { fontSize: "34px", color: "#666" }, textData.resultScore));
  sg.appendChild(AppHelper.createUIElement("div", "", { display: "inline-block", fontSize: "64px", color: "#FFF", backgroundColor: perfect ? theme.primary : "#333", padding: "14px 52px", borderRadius: "50px", fontWeight: "bold", letterSpacing: "5px", animation: "popIn 0.5s ease both" }, `${score} / ${total}`));
  c.appendChild(sg);

  const ct = textData.contact;
  const cc = AppHelper.createUIElement("div", "", { width: "88%", backgroundColor: hexToRgba(theme.primary, 0.08), borderRadius: "26px", padding: "22px 30px", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "8px" });
  cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "32px", color: "#333", fontWeight: "900" }, `🏥  ${ct.name}`));
  cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "38px", color: theme.primary, fontWeight: "bold" }, `📞  ${ct.phone}`));
  cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "27px", color: "#777" }, `🕘  ${ct.hours}`));
  if (ct.note) cc.appendChild(AppHelper.createUIElement("div", "", { fontSize: "26px", color: "#888", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.4", marginTop: "4px" }, ct.note));
  c.appendChild(cc);

  c.appendChild(AppHelper.createUIElement("button", "restartBtn", { width: "80%", minHeight: "104px", padding: "18px 0", marginTop: "1%", fontSize: "44px", fontWeight: "bold", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 10px 20px ${hexToRgba(theme.primary, 0.3)}` }, textData.restartBtn, [{ event: "click", handler: () => { quizIndex = 0; score = 0; cardIndex = 0; for (let i = 0; i < checklistStatus.length; i++) checklistStatus[i] = false; showScreen("START"); } }]));
}

// ───────── 캔버스(배경/모티브/축하) ─────────
function startCelebration(): void {
  celebrating = true; confetti = [];
  const cols = [theme.primary, theme.primaryDark, "#4CAF50", "#FFD54F", "#FF69B4", "#80DEEA"];
  for (let i = 0; i < 80; i++) confetti.push({ x: Math.random() * appData.logicalWidth, y: -Math.random() * appData.logicalHeight * 0.4, vx: (Math.random() - 0.5) * 4, vy: 4 + Math.random() * 6, size: 14 + Math.random() * 18, color: cols[Math.floor(Math.random() * cols.length)], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
}
function drawConfetti(): void {
  if (!celebrating) return;
  for (const p of confetti) {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.y > appData.logicalHeight + 40) { p.y = -40; p.x = Math.random() * appData.logicalWidth; }
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6); ctx.restore();
  }
}
function drawBackground(): void {
  const g = ctx.createLinearGradient(0, 0, 0, appCanvas.height);
  g.addColorStop(0, theme.bgTop); g.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const b of BUBBLES) {
    const dy = Math.sin(time * 0.8 + b.phase) * 25;
    if (motif) { ctx.globalAlpha = 0.15; ctx.font = `${b.r * 1.9}px sans-serif`; ctx.fillText(motif, b.x, b.y + dy); }
    else { ctx.globalAlpha = 1; ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.beginPath(); ctx.arc(b.x, b.y + dy, b.r, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
}
function loop(): void {
  time += 0.016;
  ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
  drawBackground(); drawConfetti();
  animationFrameId = requestAnimationFrame(loop);
}

async function initApp(): Promise<void> {
  appData = await AppHelper.loadAppData<IAppData>();
  textData = await AppHelper.loadTextData<ITextData>();
  assetList = await AppHelper.loadAssetList<IAssetList>();
  theme = textData.theme; mascot = textData.mascot || "💧"; motif = textData.motif || ""; layoutId = textData.layout || "softLeft";

  appCanvas = document.getElementById("appCanvas") as HTMLCanvasElement;
  uiLayer = document.getElementById("uiLayer") as HTMLElement;
  appCanvas.width = appData.logicalWidth; appCanvas.height = appData.logicalHeight;
  ctx = appCanvas.getContext("2d") as CanvasRenderingContext2D;

  injectStyles();
  checklistStatus = new Array(textData.checklistItems.length).fill(false);
  showScreen("START");
  loop();
}

export { initApp };
