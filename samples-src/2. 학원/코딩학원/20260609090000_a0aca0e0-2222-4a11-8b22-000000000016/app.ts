import { AppHelper } from "./appHelper";

// app.ts
var assetList;
var appData;
var textData;
var theme;
var brandIcon = "\u{1F4D0}";
var appCanvas;
var ctx;
var uiLayer;
var currentState = "START";
var cardIndex = 0;
var quizIndex = 0;
var score = 0;
var points = 0;
var checklistStatus = [];
var quizAnswered = false;
var time = 0;
var animationFrameId = 0;
var confetti = [];
var celebrating = false;
var POINT_PER_Q = 10;

var DOODLES = [
  { x: 240, y: 250, s: 120, ch: "✏️", phase: 0.0 },
  { x: 1680, y: 240, s: 150, ch: "\u{1F4D0}", phase: 1.3 },
  { x: 1560, y: 880, s: 130, ch: "\u{1F4DA}", phase: 2.5 },
  { x: 200, y: 860, s: 130, ch: "\u{1F522}", phase: 3.6 },
  { x: 960, y: 1010, s: 100, ch: "➗", phase: 4.7 },
  { x: 70, y: 540, s: 90, ch: "\u{1F4CF}", phase: 0.7 }
];

var STEP_LABELS = ["시작", "학습 카드", "점검", "퀴즈", "완료"];
var STATE_STEP = { START: 0, CARDS: 1, CHECKLIST: 2, QUIZ: 3, RESULT: 4 };
var MARGIN = "#E8857F"; // 노트 빨간 마진선

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${alpha})`;
}
function el(tag, styles, text, ev) { return AppHelper.createUIElement(tag, "", styles || {}, text || "", ev || []); }
function setStyle(node, s) { Object.assign(node.style, s); }

function injectStyles() {
  if (document.getElementById("appAnims")) return;
  const s = document.createElement("style");
  s.id = "appAnims";
  s.textContent = `
@keyframes fadeInUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(46px); } to { opacity:1; transform:translateX(0); } }
@keyframes pop { 0%{transform:scale(0.6);} 60%{transform:scale(1.16);} 100%{transform:scale(1);} }
@keyframes popIn { 0%{transform:scale(0);opacity:0;} 70%{transform:scale(1.18);} 100%{transform:scale(1);opacity:1;} }
@keyframes shake { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-13px);} 40%{transform:translateX(13px);} 60%{transform:translateX(-8px);} 80%{transform:translateX(8px);} }
@keyframes pulseShadow { 0%,100%{ box-shadow:0 12px 26px var(--ps); } 50%{ box-shadow:0 18px 40px var(--ps); } }
@keyframes wobble { 0%,100%{transform:rotate(-11deg) scale(1);} 50%{transform:rotate(-8deg) scale(1.04);} }
@keyframes stampIn { 0%{transform:rotate(20deg) scale(2.4);opacity:0;} 60%{transform:rotate(-14deg) scale(0.9);opacity:1;} 100%{transform:rotate(-11deg) scale(1);opacity:1;} }
`;
  document.head.appendChild(s);
}
function clearUI() { while (uiLayer.firstChild) uiLayer.removeChild(uiLayer.firstChild); }

// ── 과목 탭(공책 인덱스 탭) ──
function subjectTab() {
  const grad = `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`;
  const tab = el("div", {
    position: "absolute", left: "6%", top: "0", zIndex: "2", pointerEvents: "none",
    display: "flex", alignItems: "center", columnGap: "16px",
    background: grad, padding: "26px 40px 18px", borderRadius: "0 0 28px 28px",
    boxShadow: `0 10px 24px ${hexToRgba(theme.primary, 0.32)}`
  });
  tab.appendChild(el("div", {
    width: "66px", height: "66px", minWidth: "66px", borderRadius: "18px", backgroundColor: "rgba(255,255,255,0.22)",
    border: "2px solid rgba(255,255,255,0.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px"
  }, brandIcon));
  const tx = el("div", { display: "flex", flexDirection: "column", rowGap: "2px" });
  tx.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: "#FFF" }, textData.brandLabel || ""));
  tx.appendChild(el("div", { fontSize: "21px", fontWeight: "bold", color: "rgba(255,255,255,0.9)" }, textData.startSub || ""));
  tab.appendChild(tx);
  return tab;
}

// ── 진도 표시(자/ruler + 연필 마커) ──
function rulerProgress(cur) {
  const wrap = el("div", { position: "absolute", right: "6%", top: "3%", zIndex: "2", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "flex-end", rowGap: "8px" });
  wrap.appendChild(el("div", { fontSize: "20px", fontWeight: "900", color: theme.primary, letterSpacing: "1px" }, `학습 진도  ${cur + 1} / ${STEP_LABELS.length}`));
  const row = el("div", { display: "flex", alignItems: "center", columnGap: "10px", backgroundColor: "rgba(255,255,255,0.85)", border: `2px solid ${hexToRgba(theme.primary, 0.18)}`, borderRadius: "30px", padding: "8px 16px" });
  for (let i = 0; i < STEP_LABELS.length; i++) {
    const on = i === cur, done = i < cur;
    const seg = el("div", { display: "flex", alignItems: "center", columnGap: "8px" });
    seg.appendChild(el("div", {
      width: "30px", height: "30px", minWidth: "30px", borderRadius: "9px",
      backgroundColor: on ? theme.primary : done ? hexToRgba(theme.primary, 0.5) : hexToRgba(theme.primary, 0.13),
      color: on || done ? "#FFF" : theme.primary, display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "16px", fontWeight: "900"
    }, done ? "✓" : on ? "✏️" : String(i + 1)));
    if (on) seg.appendChild(el("div", { fontSize: "21px", fontWeight: "900", color: theme.primary }, STEP_LABELS[i]));
    row.appendChild(seg);
  }
  wrap.appendChild(row);
  return wrap;
}

function addChrome(state) {
  uiLayer.appendChild(subjectTab());
  uiLayer.appendChild(rulerProgress(STATE_STEP[state] || 0));
}

// ── 노트 페이지 패널 ──
function applyScreen(state) {
  clearUI();
  addChrome(state);
  const rule = hexToRgba(theme.primary, 0.06);
  const card = el("div", {
    position: "absolute", left: "6%", top: "15.5%", width: "88%", height: "80%",
    backgroundColor: "#FFFFFF",
    backgroundImage: `repeating-linear-gradient(0deg, transparent 0, transparent 47px, ${rule} 47px, ${rule} 48px), linear-gradient(90deg, transparent 0, transparent 70px, ${hexToRgba(MARGIN, 0.55)} 70px, ${hexToRgba(MARGIN, 0.55)} 73px, transparent 73px)`,
    borderRadius: "22px", display: "flex", flexDirection: "column", boxSizing: "border-box",
    boxShadow: `0 24px 56px ${hexToRgba(theme.primary, 0.2)}`, pointerEvents: "auto",
    fontFamily: "sans-serif", zIndex: "1", animation: "fadeInUp 0.5s ease both", overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.04)"
  });
  // 좌상단 펀치홀 2개(공책 느낌)
  for (const ty of ["26%", "70%"]) {
    card.appendChild(el("div", { position: "absolute", left: "32px", top: ty, width: "18px", height: "18px", borderRadius: "50%", backgroundColor: hexToRgba(theme.primary, 0.12) }));
  }
  uiLayer.appendChild(card);
  return card;
}

function showScreen(state) {
  currentState = state;
  celebrating = false; confetti = [];
  if (state === "START") renderStart();
  else if (state === "CARDS") renderCards();
  else if (state === "CHECKLIST") renderChecklist();
  else if (state === "QUIZ") { quizAnswered = false; renderQuiz(); }
  else if (state === "RESULT") renderResult();
}

function pillBtn(text, big, ev) {
  return el("button", {
    minHeight: big ? "104px" : "88px", padding: big ? "18px 0" : "14px 0",
    fontSize: big ? "44px" : "34px", fontWeight: "900", fontFamily: "sans-serif",
    backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "22px", cursor: "pointer",
    boxShadow: `0 12px 26px ${hexToRgba(theme.primary, 0.38)}`
  }, text, ev);
}

function targetRow() {
  const ind = el("div", { display: "flex", flexDirection: "column", rowGap: "12px" });
  ind.appendChild(el("div", { fontSize: "22px", fontWeight: "900", color: "#9AA0B5" }, textData.industriesTitle || ""));
  const chips = el("div", { display: "flex", flexWrap: "wrap", gap: "11px" });
  for (const g of (textData.industries || [])) {
    const ch = el("div", { display: "flex", alignItems: "center", columnGap: "8px", backgroundColor: hexToRgba(theme.accent, 0.12), border: `2px solid ${hexToRgba(theme.accent, 0.3)}`, borderRadius: "14px", padding: "9px 18px" });
    ch.appendChild(el("div", { fontSize: "24px" }, g.icon));
    ch.appendChild(el("div", { fontSize: "23px", fontWeight: "bold", color: "#54607A" }, g.label));
    chips.appendChild(ch);
  }
  ind.appendChild(chips);
  return ind;
}

function goalPanel() {
  const right = el("div", {
    flex: "1", display: "flex", flexDirection: "column", rowGap: "3%",
    background: `linear-gradient(160deg, ${hexToRgba(theme.primary, 0.09)}, ${hexToRgba(theme.accent, 0.10)})`,
    borderRadius: "18px", padding: "4%", boxSizing: "border-box", border: `2px dashed ${hexToRgba(theme.primary, 0.25)}`
  });
  const learn = el("div", { display: "flex", flexDirection: "column", rowGap: "14px" });
  learn.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, `\u{1F3AF}  ${textData.learnTitle || ""}`));
  for (const t of (textData.learnList || [])) {
    const row = el("div", { display: "flex", alignItems: "center", columnGap: "12px" });
    row.appendChild(el("div", { width: "32px", height: "32px", minWidth: "32px", borderRadius: "9px", backgroundColor: theme.primary, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", fontWeight: "900" }, "✓"));
    row.appendChild(el("div", { fontSize: "25px", color: "#3C4258", fontWeight: "bold" }, t));
    learn.appendChild(row);
  }
  right.appendChild(learn);
  const usage = el("div", { display: "flex", flexDirection: "column", rowGap: "9px", borderTop: `2px solid ${hexToRgba(theme.primary, 0.18)}`, paddingTop: "4%" });
  usage.appendChild(el("div", { fontSize: "24px", fontWeight: "900", color: "#7E74AE" }, `\u{1F4D6}  ${textData.usageTitle || ""}`));
  for (const t of (textData.usageList || [])) usage.appendChild(el("div", { fontSize: "22px", color: "#6A708A", lineHeight: "1.35" }, `· ${t}`));
  right.appendChild(usage);
  return right;
}

// ───────── START ─────────
function renderStart() {
  const c = applyScreen("START");
  setStyle(c, { flexDirection: "row", padding: "3.6% 3.6% 3.6% 7%", columnGap: "3.2%" });
  const left = el("div", { flex: "1.12", display: "flex", flexDirection: "column", justifyContent: "space-between" });
  const lt = el("div", { display: "flex", flexDirection: "column", rowGap: "18px" });
  lt.appendChild(el("div", { alignSelf: "flex-start", backgroundColor: hexToRgba(theme.primary, 0.12), color: theme.primary, fontSize: "26px", fontWeight: "900", padding: "9px 24px", borderRadius: "14px" }, textData.startSub));
  lt.appendChild(el("div", { fontSize: "60px", fontWeight: "900", color: theme.ink, lineHeight: "1.2", whiteSpace: "pre-line" }, textData.startTitle));
  lt.appendChild(el("div", { fontSize: "30px", color: "#5B6175", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.startDesc));
  left.appendChild(lt);
  left.appendChild(targetRow());
  const sb = pillBtn(textData.startBtn, true, [{ event: "click", handler: () => { cardIndex = 0; showScreen("CARDS"); } }]);
  setStyle(sb, { width: "78%", marginTop: "6px" });
  sb.style.setProperty("--ps", hexToRgba(theme.primary, 0.4));
  sb.style.animation = "pulseShadow 2.2s ease-in-out infinite";
  left.appendChild(sb);
  c.appendChild(left);
  c.appendChild(goalPanel());
}

// ───────── CARDS (플래시카드) ─────────
function renderCards() {
  const total = textData.cards.length;
  const card = textData.cards[cardIndex];
  const isLast = cardIndex === total - 1;
  const c = applyScreen("CARDS");
  setStyle(c, { padding: "3.2% 4.5% 3.6% 7%", rowGap: "1.5%" });

  const header = el("div", { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" });
  header.appendChild(el("div", { fontSize: "34px", fontWeight: "900", color: theme.ink }, `\u{1F4DA}  ${textData.cardsTitle}`));
  header.appendChild(el("div", { fontSize: "28px", fontWeight: "900", color: theme.primary, backgroundColor: hexToRgba(theme.primary, 0.1), padding: "8px 22px", borderRadius: "14px" }, `${cardIndex + 1} / ${total}`));
  c.appendChild(header);

  const middle = el("div", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "3%" });
  const flash = el("div", {
    width: "84%", backgroundColor: "#FFFFFF", borderRadius: "22px", border: `3px solid ${hexToRgba(theme.primary, 0.18)}`,
    boxShadow: `0 14px 32px ${hexToRgba(theme.primary, 0.18)}`, overflow: "hidden", animation: "slideIn 0.3s ease both",
    display: "flex", flexDirection: "column"
  });
  // 카드 상단 탭
  flash.appendChild(el("div", { background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, color: "#FFF", fontSize: "24px", fontWeight: "900", padding: "12px 28px", display: "flex", alignItems: "center", columnGap: "12px" }, `${card.icon}  개념 ${cardIndex + 1}`));
  const body = el("div", { display: "flex", alignItems: "center", columnGap: "5%", padding: "4% 5%" });
  body.appendChild(el("div", { width: "150px", height: "150px", minWidth: "150px", borderRadius: "24px", backgroundColor: hexToRgba(theme.primary, 0.08), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "84px" }, card.icon));
  const txt = el("div", { display: "flex", flexDirection: "column", rowGap: "16px", flex: "1" });
  txt.appendChild(el("div", { fontSize: "46px", fontWeight: "900", color: theme.ink, whiteSpace: "pre-line", lineHeight: "1.25" }, card.title));
  txt.appendChild(el("div", { fontSize: "32px", color: "#5B6175", whiteSpace: "pre-line", lineHeight: "1.5" }, card.desc));
  body.appendChild(txt);
  flash.appendChild(body);
  middle.appendChild(flash);

  const dots = el("div", { display: "flex", columnGap: "12px", justifyContent: "center" });
  for (let i = 0; i < total; i++) dots.appendChild(el("div", { width: i === cardIndex ? "44px" : "16px", height: "16px", borderRadius: "8px", backgroundColor: i === cardIndex ? theme.primary : hexToRgba(theme.primary, 0.22), transition: "all 0.25s" }));
  middle.appendChild(dots);
  c.appendChild(middle);

  const nav = el("div", { width: "100%", display: "flex", justifyContent: "space-between", columnGap: "4%" });
  nav.appendChild(el("button", { width: "26%", minHeight: "90px", padding: "16px 0", fontSize: "34px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: cardIndex === 0 ? "#EFEFF4" : "#FFF", color: cardIndex === 0 ? "#BBB" : theme.primary, border: `3px solid ${cardIndex === 0 ? "#EFEFF4" : hexToRgba(theme.primary, 0.35)}`, borderRadius: "20px", cursor: cardIndex === 0 ? "default" : "pointer" }, textData.cardPrev, [{ event: "click", handler: () => { if (cardIndex > 0) { cardIndex--; renderCards(); } } }]));
  nav.appendChild(el("button", { flex: "1", minHeight: "90px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "20px", cursor: "pointer", boxShadow: `0 10px 22px ${hexToRgba(theme.primary, 0.32)}` }, isLast ? textData.cardDone : textData.cardNext, [{ event: "click", handler: () => { if (isLast) { showScreen("CHECKLIST"); } else { cardIndex++; renderCards(); } } }]));
  c.appendChild(nav);
}

// ───────── CHECKLIST ─────────
function renderChecklist() {
  const c = applyScreen("CHECKLIST");
  setStyle(c, { flexDirection: "row", padding: "3.2% 3.6% 3.2% 7%", columnGap: "3%" });
  const total = textData.checklistItems.length;
  const done = checklistStatus.filter(Boolean).length;
  const all = checklistStatus.every(Boolean);

  const left = el("div", { flex: "1.55", display: "flex", flexDirection: "column" });
  const hg = el("div", { marginBottom: "2%" });
  hg.appendChild(el("div", { fontSize: "38px", fontWeight: "900", color: theme.ink, marginBottom: "6px" }, `✅  ${textData.checklistTitle}`));
  hg.appendChild(el("div", { fontSize: "25px", color: "#6A708A", whiteSpace: "pre-line" }, textData.checklistDesc));
  left.appendChild(hg);

  const pw = el("div", { display: "flex", alignItems: "center", columnGap: "18px", marginBottom: "2%" });
  const track = el("div", { flex: "1", height: "16px", backgroundColor: hexToRgba(theme.primary, 0.12), borderRadius: "10px", overflow: "hidden" });
  track.appendChild(el("div", { width: `${(done / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: "10px", transition: "width 0.35s ease" }));
  pw.appendChild(track);
  pw.appendChild(el("div", { fontSize: "25px", fontWeight: "900", color: theme.primary, whiteSpace: "nowrap" }, (textData.checklistProgress || "{done}/{total}").replace("{done}", String(done)).replace("{total}", String(total))));
  left.appendChild(pw);

  const list = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "12px" });
  for (let i = 0; i < total; i++) {
    const on = checklistStatus[i];
    const it = textData.checklistItems[i];
    const row = el("div", { flex: "1", minHeight: "0", display: "flex", alignItems: "center", borderRadius: "16px", padding: "0 3%", boxSizing: "border-box", cursor: "pointer", transition: "all 0.2s", backgroundColor: on ? hexToRgba(theme.primary, 0.09) : "rgba(247,247,251,0.85)", border: on ? `3px solid ${theme.primary}` : "3px solid transparent" }, "", [{ event: "click", handler: () => { checklistStatus[i] = !checklistStatus[i]; renderChecklist(); } }]);
    row.appendChild(el("div", { width: "58px", height: "58px", minWidth: "58px", borderRadius: "14px", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginRight: "3%", boxShadow: on ? `0 6px 14px ${hexToRgba(theme.primary, 0.25)}` : "0 2px 8px rgba(0,0,0,0.05)" }, it.icon));
    row.appendChild(el("div", { fontSize: "28px", color: on ? theme.ink : "#7B8197", fontWeight: on ? "900" : "bold", flex: "1", lineHeight: "1.3" }, it.label));
    const ck = el("div", { width: "48px", height: "48px", minWidth: "48px", borderRadius: "12px", border: on ? "none" : "4px solid #CFCFE0", backgroundColor: on ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" });
    if (on) { ck.style.animation = "pop 0.3s ease"; ck.appendChild(el("div", { color: "#FFF", fontSize: "28px", fontWeight: "900" }, "✓")); }
    row.appendChild(ck);
    list.appendChild(row);
  }
  left.appendChild(list);
  c.appendChild(left);

  const right = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "3%" });
  const tip = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "16px", background: `linear-gradient(160deg, ${hexToRgba(theme.accent, 0.14)}, ${hexToRgba(theme.primary, 0.12)})`, borderRadius: "18px", padding: "8% 7%", boxSizing: "border-box", border: `2px dashed ${hexToRgba(theme.accent, 0.4)}` });
  tip.appendChild(el("div", { alignSelf: "flex-start", backgroundColor: theme.accent, color: "#FFF", fontSize: "25px", fontWeight: "900", padding: "8px 22px", borderRadius: "14px" }, `\u{1F4A1} ${textData.tipTitle || "TIP"}`));
  tip.appendChild(el("div", { fontSize: "30px", color: theme.ink, fontWeight: "bold", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.tipDesc || ""));
  right.appendChild(tip);

  right.appendChild(el("div", { fontSize: "23px", color: "#AAB", textAlign: "center", opacity: all ? "0" : "1", transition: "opacity 0.3s" }, textData.checklistHint || ""));
  const nb = el("button", { width: "100%", minHeight: "98px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: all ? theme.primary : "#D7D7E2", color: "#FFF", border: "none", borderRadius: "20px", cursor: all ? "pointer" : "not-allowed", boxShadow: all ? `0 12px 24px ${hexToRgba(theme.primary, 0.32)}` : "none", transition: "background-color 0.3s", animation: all ? "pop 0.3s ease" : "none" }, textData.checklistNext, [{ event: "click", handler: () => { if (all) { quizIndex = 0; showScreen("QUIZ"); } } }]);
  right.appendChild(nb);
  c.appendChild(right);
}

// ───────── QUIZ ─────────
function renderQuiz() {
  const q = textData.quizItems[quizIndex];
  const total = textData.quizItems.length;
  const isLast = quizIndex === total - 1;
  const c = applyScreen("QUIZ");
  setStyle(c, { padding: "3.2% 5% 4% 7%", rowGap: "1%" });

  const top = el("div", { width: "100%", display: "flex", alignItems: "center", columnGap: "20px" });
  const track = el("div", { flex: "1", height: "16px", backgroundColor: hexToRgba(theme.primary, 0.12), borderRadius: "10px", overflow: "hidden" });
  track.appendChild(el("div", { width: `${((quizIndex + 1) / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: "10px", transition: "width 0.35s ease" }));
  top.appendChild(track);
  top.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.primary, whiteSpace: "nowrap" }, `⭐ ${points}점`));
  c.appendChild(top);

  const mid = el("div", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "4%" });
  const hg = el("div", { width: "100%", textAlign: "center" });
  hg.appendChild(el("div", { display: "inline-block", backgroundColor: theme.primary, color: "#FFF", fontSize: "30px", fontWeight: "900", padding: "9px 28px", borderRadius: "16px", marginBottom: "22px" }, `Q${quizIndex + 1} / ${total}`));
  hg.appendChild(el("div", { fontSize: "48px", fontWeight: "900", color: theme.ink, whiteSpace: "pre-line", lineHeight: "1.45" }, q.q));
  const ox = el("div", { display: "flex", width: "84%", height: "180px", minHeight: "180px", justifyContent: "space-between" });
  const bO = el("button", { width: "46%", height: "100%", fontSize: "112px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#21B07A", color: "#FFF", border: "none", borderRadius: "24px", boxShadow: "0 12px 24px rgba(33,176,122,0.4)", cursor: "pointer", transition: "all 0.3s" }, "O");
  const bX = el("button", { width: "46%", height: "100%", fontSize: "112px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#E0504F", color: "#FFF", border: "none", borderRadius: "24px", boxShadow: "0 12px 24px rgba(224,80,79,0.4)", cursor: "pointer", transition: "all 0.3s" }, "X");
  ox.appendChild(bO); ox.appendChild(bX);
  const fb = el("div", { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "14px", opacity: "0", transition: "opacity 0.3s" });
  const mark = el("div", { fontSize: "48px", fontWeight: "900" });
  const expl = el("div", { fontSize: "31px", color: "#5B6175", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5", width: "92%" });
  const nx = el("button", { width: "78%", minHeight: "96px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "20px", cursor: "pointer", boxShadow: `0 10px 22px ${hexToRgba(theme.primary, 0.32)}` }, isLast ? (textData.lastBtn || textData.nextBtn) : textData.nextBtn);
  fb.appendChild(mark); fb.appendChild(expl); fb.appendChild(nx);
  mid.appendChild(hg); mid.appendChild(ox); mid.appendChild(fb);
  c.appendChild(mid);

  const ans = (a) => {
    if (quizAnswered) return; quizAnswered = true;
    const ok = a === q.a;
    if (ok) { score++; points += POINT_PER_Q; }
    bO.style.opacity = a === "O" ? "1" : "0.3"; bX.style.opacity = a === "X" ? "1" : "0.3";
    (a === "O" ? bO : bX).style.animation = ok ? "pop 0.4s ease" : "shake 0.4s ease";
    mark.textContent = ok ? `${textData.correctText || "정답이에요!"}  ${textData.quizPointLabel || "+10"}` : (textData.wrongText || "다시 확인해요");
    mark.style.color = ok ? "#21B07A" : "#E0504F"; mark.style.animation = "popIn 0.4s ease both";
    expl.textContent = q.expl; fb.style.opacity = "1";
    nx.addEventListener("click", () => { quizIndex++; if (quizIndex >= total) showScreen("RESULT"); else showScreen("QUIZ"); });
  };
  bO.addEventListener("click", () => ans("O"));
  bX.addEventListener("click", () => ans("X"));
}

// ───────── RESULT (도장) ─────────
function renderResult() {
  const total = textData.quizItems.length;
  const perfect = score === total;
  if (perfect) startCelebration();
  const c = applyScreen("RESULT");
  setStyle(c, { flexDirection: "row", padding: "3.4% 3.6% 3.4% 7%", columnGap: "3.2%" });

  const left = el("div", { flex: "1.05", display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "4%" });
  const h = el("div", { display: "flex", alignItems: "center", columnGap: "26px" });
  const htx = el("div", {});
  htx.appendChild(el("div", { fontSize: "54px", fontWeight: "900", color: theme.primary, marginBottom: "10px" }, textData.resultTitle));
  htx.appendChild(el("div", { fontSize: "30px", color: "#5B6175", whiteSpace: "pre-line", lineHeight: "1.5" }, perfect ? textData.resultPerfect : textData.resultGood));
  h.appendChild(htx);
  // 도장 스탬프
  const stamp = el("div", { width: "150px", height: "150px", minWidth: "150px", borderRadius: "50%", border: `5px solid ${MARGIN}`, color: MARGIN, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", fontWeight: "900", animation: "stampIn 0.6s ease both, wobble 3s ease-in-out 0.6s infinite", boxShadow: `inset 0 0 0 3px ${hexToRgba(MARGIN, 0.3)}` });
  stamp.appendChild(el("div", { fontSize: "30px", lineHeight: "1.1" }, "참 잘\n했어요"));
  stamp.appendChild(el("div", { fontSize: "40px", marginTop: "4px" }, "💯"));
  h.appendChild(stamp);
  left.appendChild(h);

  const sg = el("div", { display: "flex", alignItems: "center", columnGap: "22px" });
  const badge = el("div", { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(150deg, ${theme.primary}, ${theme.primaryDark})`, borderRadius: "20px", padding: "20px 38px", color: "#FFF", animation: "popIn 0.5s ease both", boxShadow: `0 14px 30px ${hexToRgba(theme.primary, 0.35)}` });
  badge.appendChild(el("div", { fontSize: "25px", fontWeight: "bold", opacity: "0.9" }, textData.resultScore));
  badge.appendChild(el("div", { fontSize: "56px", fontWeight: "900", letterSpacing: "3px" }, `${points}점`));
  sg.appendChild(badge);
  const sr = el("div", { display: "flex", flexDirection: "column", rowGap: "6px" });
  sr.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, `정답 ${score} / ${total}`));
  sr.appendChild(el("div", { fontSize: "23px", color: "#8B91A6" }, `문항당 +${POINT_PER_Q}점`));
  sg.appendChild(sr);
  left.appendChild(sg);

  const eff = el("div", { display: "flex", flexDirection: "column", rowGap: "12px" });
  eff.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#9AA0B5" }, textData.effectsTitle || ""));
  const echips = el("div", { display: "flex", flexWrap: "wrap", gap: "11px" });
  for (const e of (textData.effects || [])) {
    const ec = el("div", { display: "flex", alignItems: "center", columnGap: "8px", backgroundColor: hexToRgba(theme.accent, 0.13), border: `2px solid ${hexToRgba(theme.accent, 0.3)}`, borderRadius: "14px", padding: "9px 18px" });
    ec.appendChild(el("div", { fontSize: "24px" }, e.icon));
    ec.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#2C7A6E" }, e.label));
    echips.appendChild(ec);
  }
  eff.appendChild(echips);
  left.appendChild(eff);

  const right = el("div", { flex: "1", display: "flex", flexDirection: "column", rowGap: "3%" });
  const ct = textData.contact || {};
  const cc = el("div", { display: "flex", flexDirection: "column", rowGap: "10px", background: `linear-gradient(160deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`, borderRadius: "18px", padding: "4% 5%", boxSizing: "border-box", border: `2px dashed ${hexToRgba(theme.primary, 0.25)}` });
  cc.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.ink }, `\u{1F3EB} ${textData.contactTitle || "학원 안내"}`));
  cc.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, ct.name || ""));
  if (ct.phone) cc.appendChild(el("div", { fontSize: "33px", fontWeight: "900", color: theme.primary }, `\u{1F4F1}  ${ct.phone}`));
  const sub = el("div", { display: "flex", flexWrap: "wrap", columnGap: "20px", rowGap: "6px" });
  if (ct.kakao) sub.appendChild(el("div", { fontSize: "23px", color: "#6A708A", fontWeight: "bold" }, `\u{1F4AC} ${ct.kakao}`));
  if (ct.instagram) sub.appendChild(el("div", { fontSize: "23px", color: "#6A708A", fontWeight: "bold" }, `\u{1F4F8} ${ct.instagram}`));
  cc.appendChild(sub);
  if (ct.note) cc.appendChild(el("div", { fontSize: "22px", color: "#8B91A6", whiteSpace: "pre-line", lineHeight: "1.4" }, ct.note));
  right.appendChild(cc);

  const acts = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", rowGap: "13px" });
  acts.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#9AA0B5" }, textData.actionsTitle || ""));
  const secBtn = (label, handler) => el("button", { width: "100%", minHeight: "82px", padding: "13px 0", fontSize: "30px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#FFF", color: theme.primary, border: `3px solid ${hexToRgba(theme.primary, 0.3)}`, borderRadius: "18px", cursor: "pointer" }, label, [{ event: "click", handler }]);
  acts.appendChild(secBtn(textData.reviewCardsBtn || "개념 카드 다시 보기", () => { cardIndex = 0; showScreen("CARDS"); }));
  acts.appendChild(secBtn(textData.reviewChecklistBtn || "학습 점검 다시 보기", () => { showScreen("CHECKLIST"); }));
  const restart = pillBtn(`\u{1F501}  ${textData.restartBtn || "처음으로"}`, false, [{ event: "click", handler: () => { quizIndex = 0; score = 0; points = 0; cardIndex = 0; for (let i = 0; i < checklistStatus.length; i++) checklistStatus[i] = false; showScreen("START"); } }]);
  setStyle(restart, { width: "100%" });
  acts.appendChild(restart);
  right.appendChild(acts);

  c.appendChild(left);
  c.appendChild(right);
}

// ───────── 캔버스 배경(모눈) / 축하 ─────────
function startCelebration() {
  celebrating = true; confetti = [];
  const cols = [theme.primary, theme.primaryDark, theme.accent, "#FFD54F", "#FF8FB1", "#7CC4FF"];
  for (let i = 0; i < 90; i++) confetti.push({ x: Math.random() * appData.logicalWidth, y: -Math.random() * appData.logicalHeight * 0.4, vx: (Math.random() - 0.5) * 4, vy: 4 + Math.random() * 6, size: 14 + Math.random() * 18, color: cols[Math.floor(Math.random() * cols.length)], rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3 });
}
function drawConfetti() {
  if (!celebrating) return;
  for (const p of confetti) {
    p.x += p.vx; p.y += p.vy; p.rot += p.vr;
    if (p.y > appData.logicalHeight + 40) { p.y = -40; p.x = Math.random() * appData.logicalWidth; }
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62); ctx.restore();
  }
}
function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, appCanvas.width, appCanvas.height);
  g.addColorStop(0, theme.bgTop); g.addColorStop(1, theme.bgBottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);
  // 모눈종이 그리드
  ctx.save();
  ctx.strokeStyle = hexToRgba(theme.primary, 0.06); ctx.lineWidth = 1;
  for (let x = 0; x <= appCanvas.width; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, appCanvas.height); ctx.stroke(); }
  for (let y = 0; y <= appCanvas.height; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(appCanvas.width, y); ctx.stroke(); }
  ctx.strokeStyle = hexToRgba(theme.primary, 0.1); ctx.lineWidth = 1.5;
  for (let x = 0; x <= appCanvas.width; x += 300) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, appCanvas.height); ctx.stroke(); }
  for (let y = 0; y <= appCanvas.height; y += 300) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(appCanvas.width, y); ctx.stroke(); }
  ctx.restore();
  // 떠다니는 학습 도구 도들
  ctx.save(); ctx.textAlign = "center"; ctx.textBaseline = "middle";
  for (const d of DOODLES) {
    const dy = Math.sin(time * 0.7 + d.phase) * 16;
    ctx.globalAlpha = 0.08; ctx.font = `${d.s}px sans-serif`;
    ctx.fillText(d.ch, d.x, d.y + dy);
  }
  ctx.restore();
}
function loop() {
  time += 0.016;
  ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);
  drawBackground(); drawConfetti();
  animationFrameId = requestAnimationFrame(loop);
}

async function initApp() {
  appData = await AppHelper.loadAppData();
  textData = await AppHelper.loadTextData();
  assetList = await AppHelper.loadAssetList();
  theme = textData.theme;
  brandIcon = textData.brandIcon || "\u{1F4D0}";
  appCanvas = document.getElementById("appCanvas");
  uiLayer = document.getElementById("uiLayer");
  appCanvas.width = appData.logicalWidth;
  appCanvas.height = appData.logicalHeight;
  ctx = appCanvas.getContext("2d");
  injectStyles();
  checklistStatus = new Array(textData.checklistItems.length).fill(false);
  showScreen("START");
  loop();
}

export { initApp };
