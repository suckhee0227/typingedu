import { AppHelper } from "./appHelper";

// app.ts
var assetList;
var appData;
var textData;
var theme;
var brandIcon = "\u{1F3A7}";
var layoutId = "topbar";
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

var SHAPES = [
  { x: 250, y: 220, s: 150, phase: 0.0, rot: 0.3 },
  { x: 1680, y: 300, s: 230, phase: 1.4, rot: -0.4 },
  { x: 1500, y: 920, s: 170, phase: 2.6, rot: 0.6 },
  { x: 180, y: 880, s: 200, phase: 3.7, rot: -0.2 },
  { x: 960, y: 1020, s: 120, phase: 5.0, rot: 0.5 },
  { x: 60, y: 520, s: 110, phase: 0.8, rot: -0.5 }
];

var STEP_LABELS = ["시작", "학습 카드", "체크리스트", "퀴즈", "완료"];
var STATE_STEP = { START: 0, CARDS: 1, CHECKLIST: 2, QUIZ: 3, RESULT: 4 };

var LAYOUTS = {
  topbar:    { chrome: "topbar",    panel: { l: 6,  t: 15.5, w: 88, h: 80 }, stack: false },
  sidebar:   { chrome: "sidebar",   panel: { l: 31, t: 6,    w: 63, h: 88 }, stack: true  },
  hero:      { chrome: "hero",      panel: { l: 6,  t: 18,   w: 88, h: 78 }, stack: false },
  split:     { chrome: "split",     panel: { l: 37, t: 7,    w: 59, h: 86 }, stack: true  },
  minimal:   { chrome: "minimal",   panel: { l: 13, t: 13,   w: 74, h: 75 }, stack: false },
  bottombar: { chrome: "bottombar", panel: { l: 6,  t: 4,    w: 88, h: 80 }, stack: false }
};
function L() { return LAYOUTS[layoutId] || LAYOUTS.topbar; }

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.substring(0, 2), 16)}, ${parseInt(h.substring(2, 4), 16)}, ${parseInt(h.substring(4, 6), 16)}, ${alpha})`;
}

function el(tag, styles, text, ev) {
  return AppHelper.createUIElement(tag, "", styles || {}, text || "", ev || []);
}
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
@keyframes floatY { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-12px);} }
`;
  document.head.appendChild(s);
}

function clearUI() { while (uiLayer.firstChild) uiLayer.removeChild(uiLayer.firstChild); }

// ── 브랜드 ──
function brandEl(onDark, vertical) {
  const grad = `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`;
  const wrap = el("div", { display: "flex", alignItems: "center", columnGap: "16px", pointerEvents: "none" });
  if (vertical) setStyle(wrap, { flexDirection: "column", rowGap: "12px", columnGap: "0" });
  const chip = el("div", {
    width: "78px", height: "78px", minWidth: "78px", borderRadius: "22px",
    background: onDark ? "rgba(255,255,255,0.2)" : grad,
    border: onDark ? "2px solid rgba(255,255,255,0.55)" : "none",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px",
    boxShadow: onDark ? "none" : `0 10px 24px ${hexToRgba(theme.primary, 0.4)}`,
    animation: "floatY 3.4s ease-in-out infinite"
  }, brandIcon);
  const tx = el("div", { display: "flex", flexDirection: "column", rowGap: "2px", alignItems: vertical ? "center" : "flex-start" });
  tx.appendChild(el("div", { fontSize: "30px", fontWeight: "900", color: onDark ? "#FFF" : theme.ink, textAlign: vertical ? "center" : "left" }, textData.brandLabel || ""));
  tx.appendChild(el("div", { fontSize: "22px", fontWeight: "bold", color: onDark ? "rgba(255,255,255,0.88)" : theme.primary, textAlign: vertical ? "center" : "left" }, textData.startSub || ""));
  wrap.appendChild(chip); wrap.appendChild(tx);
  return wrap;
}

// ── 스텝 인디케이터 ──
function stepperEl(cur, onDark, vertical) {
  const wrap = el("div", {
    display: "flex", alignItems: vertical ? "stretch" : "center",
    flexDirection: vertical ? "column" : "row",
    rowGap: vertical ? "12px" : "0", columnGap: vertical ? "0" : "10px", pointerEvents: "none"
  });
  for (let i = 0; i < STEP_LABELS.length; i++) {
    const on = i === cur, done = i < cur;
    const showLabel = on || vertical;
    const seg = el("div", {
      display: "flex", alignItems: "center", columnGap: "10px",
      backgroundColor: on ? (onDark ? "rgba(255,255,255,0.95)" : theme.primary) : (onDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.8)"),
      border: on ? "none" : `2px solid ${onDark ? "rgba(255,255,255,0.4)" : hexToRgba(theme.primary, done ? 0.5 : 0.18)}`,
      borderRadius: "30px", padding: showLabel ? "9px 22px 9px 12px" : "9px 14px", transition: "all .25s"
    });
    seg.appendChild(el("div", {
      width: "30px", height: "30px", minWidth: "30px", borderRadius: "50%",
      backgroundColor: on ? theme.primary : (done ? (onDark ? "rgba(255,255,255,0.9)" : theme.primary) : (onDark ? "rgba(255,255,255,0.25)" : hexToRgba(theme.primary, 0.16))),
      color: on ? "#FFF" : (done ? (onDark ? theme.primary : "#FFF") : (onDark ? "#FFF" : theme.primary)),
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", fontWeight: "900"
    }, done ? "✓" : String(i + 1)));
    if (showLabel) seg.appendChild(el("div", { fontSize: "22px", fontWeight: "900", color: on ? (onDark ? theme.primary : "#FFF") : (onDark ? "#FFF" : theme.primary) }, STEP_LABELS[i]));
    wrap.appendChild(seg);
  }
  return wrap;
}

// ── 레이아웃별 크롬 ──
function addChrome(state) {
  const cur = STATE_STEP[state] || 0;
  const lay = L();
  const grad = `linear-gradient(135deg, ${theme.primary}, ${theme.primaryDark})`;
  if (lay.chrome === "topbar") {
    const b = brandEl(false, false); setStyle(b, { position: "absolute", left: "6%", top: "4.2%", zIndex: "2" }); uiLayer.appendChild(b);
    const s = stepperEl(cur, false, false); setStyle(s, { position: "absolute", right: "6%", top: "5%", zIndex: "2" }); uiLayer.appendChild(s);
  } else if (lay.chrome === "sidebar") {
    const rail = el("div", { position: "absolute", left: "0", top: "0", width: "26%", height: "100%", background: grad, borderRadius: "0 48px 48px 0", zIndex: "2", pointerEvents: "none", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", rowGap: "9%", padding: "7% 3%", boxSizing: "border-box" });
    rail.appendChild(brandEl(true, true));
    rail.appendChild(stepperEl(cur, true, true));
    uiLayer.appendChild(rail);
  } else if (lay.chrome === "hero") {
    uiLayer.appendChild(el("div", { position: "absolute", left: "0", top: "0", width: "100%", height: "21%", background: grad, borderRadius: "0 0 46px 46px", zIndex: "0", pointerEvents: "none" }));
    const b = brandEl(true, false); setStyle(b, { position: "absolute", left: "6%", top: "5%", zIndex: "2" }); uiLayer.appendChild(b);
    const s = stepperEl(cur, true, false); setStyle(s, { position: "absolute", right: "6%", top: "6.5%", zIndex: "2" }); uiLayer.appendChild(s);
  } else if (lay.chrome === "split") {
    const col = el("div", { position: "absolute", left: "0", top: "0", width: "33%", height: "100%", background: grad, zIndex: "2", pointerEvents: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", padding: "8% 4%", boxSizing: "border-box" });
    col.appendChild(brandEl(true, true));
    col.appendChild(stepperEl(cur, true, true));
    uiLayer.appendChild(col);
  } else if (lay.chrome === "minimal") {
    const b = brandEl(false, false); setStyle(b, { position: "absolute", left: "6%", top: "4%", zIndex: "2" }); uiLayer.appendChild(b);
    const s = stepperEl(cur, false, false); setStyle(s, { position: "absolute", left: "50%", top: "4.5%", transform: "translateX(-50%)", zIndex: "2" }); uiLayer.appendChild(s);
  } else if (lay.chrome === "bottombar") {
    const bar = el("div", { position: "absolute", left: "0", bottom: "0", width: "100%", height: "12%", background: grad, borderRadius: "46px 46px 0 0", zIndex: "2", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 5%", boxSizing: "border-box" });
    bar.appendChild(brandEl(true, false));
    bar.appendChild(stepperEl(cur, true, false));
    uiLayer.appendChild(bar);
  }
}

function applyScreen(state) {
  clearUI();
  addChrome(state);
  const p = L().panel;
  const card = el("div", {
    position: "absolute", left: p.l + "%", top: p.t + "%", width: p.w + "%", height: p.h + "%",
    backgroundColor: "rgba(255,255,255,0.98)", borderRadius: "32px",
    display: "flex", flexDirection: "column", boxSizing: "border-box",
    boxShadow: `0 26px 60px ${hexToRgba(theme.primary, 0.2)}`, pointerEvents: "auto",
    fontFamily: "sans-serif", zIndex: "1", animation: "fadeInUp 0.5s ease both", overflow: "hidden"
  });
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
    backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer",
    boxShadow: `0 12px 26px ${hexToRgba(theme.primary, 0.38)}`
  }, text, ev);
}

function industriesRow() {
  const ind = el("div", { display: "flex", flexDirection: "column", rowGap: "12px" });
  ind.appendChild(el("div", { fontSize: "22px", fontWeight: "900", color: "#9098AD" }, textData.industriesTitle || ""));
  const chips = el("div", { display: "flex", flexWrap: "wrap", gap: "11px" });
  for (const g of (textData.industries || [])) {
    const ch = el("div", { display: "flex", alignItems: "center", columnGap: "8px", backgroundColor: hexToRgba(theme.primary, 0.07), border: `2px solid ${hexToRgba(theme.primary, 0.14)}`, borderRadius: "26px", padding: "9px 18px" });
    ch.appendChild(el("div", { fontSize: "24px" }, g.icon));
    ch.appendChild(el("div", { fontSize: "23px", fontWeight: "bold", color: "#525870" }, g.label));
    chips.appendChild(ch);
  }
  ind.appendChild(chips);
  return ind;
}

function learnPanel(grid) {
  const right = el("div", {
    display: "flex", flexDirection: "column", rowGap: grid ? "16px" : "3%",
    background: `linear-gradient(160deg, ${hexToRgba(theme.primary, 0.10)}, ${hexToRgba(theme.accent, 0.10)})`,
    borderRadius: "24px", padding: "4% 4%", boxSizing: "border-box"
  });
  const learn = el("div", { display: "flex", flexDirection: "column", rowGap: "14px" });
  learn.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, `\u{1F4DA}  ${textData.learnTitle || ""}`));
  const listWrap = el("div", grid
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "20px", rowGap: "12px" }
    : { display: "flex", flexDirection: "column", rowGap: "13px" });
  for (const t of (textData.learnList || [])) {
    const row = el("div", { display: "flex", alignItems: "center", columnGap: "12px" });
    row.appendChild(el("div", { width: "32px", height: "32px", minWidth: "32px", borderRadius: "10px", backgroundColor: theme.primary, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "19px", fontWeight: "900" }, "✓"));
    row.appendChild(el("div", { fontSize: "25px", color: "#3C4258", fontWeight: "bold" }, t));
    listWrap.appendChild(row);
  }
  learn.appendChild(listWrap);
  right.appendChild(learn);
  if (!grid) {
    const usage = el("div", { display: "flex", flexDirection: "column", rowGap: "9px", borderTop: `2px dashed ${hexToRgba(theme.primary, 0.2)}`, paddingTop: "4%" });
    usage.appendChild(el("div", { fontSize: "24px", fontWeight: "900", color: "#7A6FB0" }, `\u{1F4D6}  ${textData.usageTitle || ""}`));
    for (const t of (textData.usageList || [])) usage.appendChild(el("div", { fontSize: "22px", color: "#6A708A", lineHeight: "1.35" }, `· ${t}`));
    right.appendChild(usage);
  }
  return right;
}

// ───────── START ─────────
function renderStart() {
  const c = applyScreen("START");
  const stack = L().stack;

  if (!stack) {
    setStyle(c, { flexDirection: "row", padding: "3.4% 3.6%", columnGap: "3.2%" });
    const left = el("div", { flex: "1.12", display: "flex", flexDirection: "column", justifyContent: "space-between" });
    const lt = el("div", { display: "flex", flexDirection: "column", rowGap: "20px" });
    lt.appendChild(el("div", { alignSelf: "flex-start", backgroundColor: hexToRgba(theme.primary, 0.12), color: theme.primary, fontSize: "26px", fontWeight: "900", padding: "10px 26px", borderRadius: "30px" }, textData.startSub));
    lt.appendChild(el("div", { fontSize: "60px", fontWeight: "900", color: theme.ink, lineHeight: "1.2", whiteSpace: "pre-line" }, textData.startTitle));
    lt.appendChild(el("div", { fontSize: "30px", color: "#5B6175", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.startDesc));
    left.appendChild(lt);
    left.appendChild(industriesRow());
    const startBtn = pillBtn(textData.startBtn, true, [{ event: "click", handler: () => { cardIndex = 0; showScreen("CARDS"); } }]);
    setStyle(startBtn, { width: "78%", marginTop: "6px" });
    startBtn.style.setProperty("--ps", hexToRgba(theme.primary, 0.4));
    startBtn.style.animation = "pulseShadow 2.2s ease-in-out infinite";
    left.appendChild(startBtn);
    c.appendChild(left);
    c.appendChild(learnPanel(false));
  } else {
    setStyle(c, { padding: "4% 4.5%", rowGap: "2.6%", justifyContent: "center" });
    c.appendChild(el("div", { fontSize: "52px", fontWeight: "900", color: theme.ink, lineHeight: "1.2", whiteSpace: "pre-line" }, textData.startTitle));
    c.appendChild(el("div", { fontSize: "28px", color: "#5B6175", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.startDesc));
    c.appendChild(learnPanel(true));
    c.appendChild(industriesRow());
    const startBtn = pillBtn(textData.startBtn, true, [{ event: "click", handler: () => { cardIndex = 0; showScreen("CARDS"); } }]);
    setStyle(startBtn, { width: "100%", marginTop: "4px" });
    startBtn.style.setProperty("--ps", hexToRgba(theme.primary, 0.4));
    startBtn.style.animation = "pulseShadow 2.2s ease-in-out infinite";
    c.appendChild(startBtn);
  }
}

// ───────── CARDS ─────────
function renderCards() {
  const total = textData.cards.length;
  const card = textData.cards[cardIndex];
  const isLast = cardIndex === total - 1;
  const c = applyScreen("CARDS");
  setStyle(c, { padding: "3.2% 4.5% 3.6%", rowGap: "1.5%" });

  const header = el("div", { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" });
  header.appendChild(el("div", { fontSize: "34px", fontWeight: "900", color: theme.ink }, `\u{1F4D1}  ${textData.cardsTitle}`));
  header.appendChild(el("div", { fontSize: "28px", fontWeight: "900", color: theme.primary, backgroundColor: hexToRgba(theme.primary, 0.1), padding: "8px 22px", borderRadius: "26px" }, `${cardIndex + 1} / ${total}`));
  c.appendChild(header);

  const middle = el("div", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "3.5%" });
  const box = el("div", {
    width: "86%", display: "flex", alignItems: "center", columnGap: "5%",
    background: `linear-gradient(150deg, ${hexToRgba(theme.primary, 0.08)}, ${hexToRgba(theme.accent, 0.08)})`,
    border: `3px solid ${hexToRgba(theme.primary, 0.18)}`, borderRadius: "32px", padding: "4.5% 5%",
    boxSizing: "border-box", animation: "slideIn 0.3s ease both"
  });
  box.appendChild(el("div", {
    width: "170px", height: "170px", minWidth: "170px", borderRadius: "32px", backgroundColor: "#FFF",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "88px",
    boxShadow: `0 12px 28px ${hexToRgba(theme.primary, 0.22)}`
  }, card.icon));
  const txt = el("div", { display: "flex", flexDirection: "column", rowGap: "16px", flex: "1" });
  txt.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.primary }, `${cardIndex + 1}. 핵심 포인트`));
  txt.appendChild(el("div", { fontSize: "44px", fontWeight: "900", color: theme.ink, whiteSpace: "pre-line", lineHeight: "1.25" }, card.title));
  txt.appendChild(el("div", { fontSize: "31px", color: "#5B6175", whiteSpace: "pre-line", lineHeight: "1.5" }, card.desc));
  box.appendChild(txt);
  middle.appendChild(box);

  const dots = el("div", { display: "flex", columnGap: "13px", justifyContent: "center" });
  for (let i = 0; i < total; i++) dots.appendChild(el("div", { width: i === cardIndex ? "44px" : "16px", height: "16px", borderRadius: "8px", backgroundColor: i === cardIndex ? theme.primary : hexToRgba(theme.primary, 0.22), transition: "all 0.25s" }));
  middle.appendChild(dots);
  c.appendChild(middle);

  const nav = el("div", { width: "100%", display: "flex", justifyContent: "space-between", columnGap: "4%" });
  nav.appendChild(el("button", {
    width: "26%", minHeight: "92px", padding: "16px 0", fontSize: "34px", fontWeight: "900", fontFamily: "sans-serif",
    backgroundColor: cardIndex === 0 ? "#EFEFF4" : "#FFF", color: cardIndex === 0 ? "#BBB" : theme.primary,
    border: `3px solid ${cardIndex === 0 ? "#EFEFF4" : hexToRgba(theme.primary, 0.35)}`, borderRadius: "50px",
    cursor: cardIndex === 0 ? "default" : "pointer"
  }, textData.cardPrev, [{ event: "click", handler: () => { if (cardIndex > 0) { cardIndex--; renderCards(); } } }]));
  nav.appendChild(el("button", {
    flex: "1", minHeight: "92px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif",
    backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer",
    boxShadow: `0 10px 22px ${hexToRgba(theme.primary, 0.32)}`
  }, isLast ? textData.cardDone : textData.cardNext, [{ event: "click", handler: () => { if (isLast) { showScreen("CHECKLIST"); } else { cardIndex++; renderCards(); } } }]));
  c.appendChild(nav);
}

// ───────── CHECKLIST ─────────
function renderChecklist() {
  const c = applyScreen("CHECKLIST");
  setStyle(c, { flexDirection: "row", padding: "3.2% 3.6%", columnGap: "3%" });
  const total = textData.checklistItems.length;
  const done = checklistStatus.filter(Boolean).length;
  const all = checklistStatus.every(Boolean);

  const left = el("div", { flex: "1.55", display: "flex", flexDirection: "column" });
  const hg = el("div", { marginBottom: "2%" });
  hg.appendChild(el("div", { fontSize: "38px", fontWeight: "900", color: theme.ink, marginBottom: "6px" }, `✅  ${textData.checklistTitle}`));
  hg.appendChild(el("div", { fontSize: "25px", color: "#6A708A", whiteSpace: "pre-line" }, textData.checklistDesc));
  left.appendChild(hg);

  const pw = el("div", { display: "flex", alignItems: "center", columnGap: "18px", marginBottom: "2%" });
  const track = el("div", { flex: "1", height: "16px", backgroundColor: "#ECEAF6", borderRadius: "10px", overflow: "hidden" });
  track.appendChild(el("div", { width: `${(done / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: "10px", transition: "width 0.35s ease" }));
  pw.appendChild(track);
  pw.appendChild(el("div", { fontSize: "25px", fontWeight: "900", color: theme.primary, whiteSpace: "nowrap" }, (textData.checklistProgress || "{done}/{total}").replace("{done}", String(done)).replace("{total}", String(total))));
  left.appendChild(pw);

  const list = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "12px" });
  for (let i = 0; i < total; i++) {
    const on = checklistStatus[i];
    const it = textData.checklistItems[i];
    const row = el("div", {
      flex: "1", minHeight: "0", display: "flex", alignItems: "center", borderRadius: "20px", padding: "0 3%",
      boxSizing: "border-box", cursor: "pointer", transition: "all 0.2s",
      backgroundColor: on ? hexToRgba(theme.primary, 0.09) : "#F7F7FB",
      border: on ? `3px solid ${theme.primary}` : "3px solid transparent"
    }, "", [{ event: "click", handler: () => { checklistStatus[i] = !checklistStatus[i]; renderChecklist(); } }]);
    row.appendChild(el("div", { width: "58px", height: "58px", minWidth: "58px", borderRadius: "16px", backgroundColor: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", marginRight: "3%", boxShadow: on ? `0 6px 14px ${hexToRgba(theme.primary, 0.25)}` : "0 2px 8px rgba(0,0,0,0.05)" }, it.icon));
    row.appendChild(el("div", { fontSize: "28px", color: on ? theme.ink : "#7B8197", fontWeight: on ? "900" : "bold", flex: "1", lineHeight: "1.3" }, it.label));
    const ck = el("div", { width: "48px", height: "48px", minWidth: "48px", borderRadius: "24px", border: on ? "none" : "4px solid #CFCFE0", backgroundColor: on ? theme.primary : "transparent", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" });
    if (on) { ck.style.animation = "pop 0.3s ease"; ck.appendChild(el("div", { color: "#FFF", fontSize: "28px", fontWeight: "900" }, "✓")); }
    row.appendChild(ck);
    list.appendChild(row);
  }
  left.appendChild(list);
  c.appendChild(left);

  const right = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: "3%" });
  const tip = el("div", {
    flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "16px",
    background: `linear-gradient(160deg, ${hexToRgba(theme.accent, 0.14)}, ${hexToRgba(theme.primary, 0.12)})`,
    borderRadius: "26px", padding: "8% 7%", boxSizing: "border-box"
  });
  tip.appendChild(el("div", { alignSelf: "flex-start", backgroundColor: theme.accent, color: "#FFF", fontSize: "25px", fontWeight: "900", padding: "8px 24px", borderRadius: "24px" }, `\u{1F4A1} ${textData.tipTitle || "TIP"}`));
  tip.appendChild(el("div", { fontSize: "30px", color: theme.ink, fontWeight: "bold", lineHeight: "1.5", whiteSpace: "pre-line" }, textData.tipDesc || ""));
  right.appendChild(tip);

  right.appendChild(el("div", { fontSize: "23px", color: "#AAB", textAlign: "center", opacity: all ? "0" : "1", transition: "opacity 0.3s" }, textData.checklistHint || ""));
  const nb = el("button", {
    width: "100%", minHeight: "98px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif",
    backgroundColor: all ? theme.primary : "#D7D7E2", color: "#FFF", border: "none", borderRadius: "50px",
    cursor: all ? "pointer" : "not-allowed", boxShadow: all ? `0 12px 24px ${hexToRgba(theme.primary, 0.32)}` : "none",
    transition: "background-color 0.3s", animation: all ? "pop 0.3s ease" : "none"
  }, textData.checklistNext, [{ event: "click", handler: () => { if (all) { quizIndex = 0; showScreen("QUIZ"); } } }]);
  right.appendChild(nb);
  c.appendChild(right);
}

// ───────── QUIZ ─────────
function renderQuiz() {
  const q = textData.quizItems[quizIndex];
  const total = textData.quizItems.length;
  const isLast = quizIndex === total - 1;
  const c = applyScreen("QUIZ");
  setStyle(c, { padding: "3.2% 5% 4%", rowGap: "1%" });

  const top = el("div", { width: "100%", display: "flex", alignItems: "center", columnGap: "20px" });
  const track = el("div", { flex: "1", height: "16px", backgroundColor: "#ECEAF6", borderRadius: "10px", overflow: "hidden" });
  track.appendChild(el("div", { width: `${((quizIndex + 1) / total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`, borderRadius: "10px", transition: "width 0.35s ease" }));
  top.appendChild(track);
  top.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.primary, whiteSpace: "nowrap" }, `⭐ ${points}점`));
  c.appendChild(top);

  const mid = el("div", { width: "100%", flex: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", rowGap: "4%" });
  const hg = el("div", { width: "100%", textAlign: "center" });
  hg.appendChild(el("div", { display: "inline-block", backgroundColor: theme.primary, color: "#FFF", fontSize: "30px", fontWeight: "900", padding: "9px 28px", borderRadius: "30px", marginBottom: "22px" }, `Q${quizIndex + 1} / ${total}`));
  hg.appendChild(el("div", { fontSize: "48px", fontWeight: "900", color: theme.ink, whiteSpace: "pre-line", lineHeight: "1.45" }, q.q));
  const ox = el("div", { display: "flex", width: "84%", height: "180px", minHeight: "180px", justifyContent: "space-between" });
  const bO = el("button", { width: "46%", height: "100%", fontSize: "112px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#21B07A", color: "#FFF", border: "none", borderRadius: "36px", boxShadow: "0 12px 24px rgba(33,176,122,0.4)", cursor: "pointer", transition: "all 0.3s" }, "O");
  const bX = el("button", { width: "46%", height: "100%", fontSize: "112px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: "#E0504F", color: "#FFF", border: "none", borderRadius: "36px", boxShadow: "0 12px 24px rgba(224,80,79,0.4)", cursor: "pointer", transition: "all 0.3s" }, "X");
  ox.appendChild(bO); ox.appendChild(bX);
  const fb = el("div", { width: "100%", display: "flex", flexDirection: "column", alignItems: "center", rowGap: "14px", opacity: "0", transition: "opacity 0.3s" });
  const mark = el("div", { fontSize: "48px", fontWeight: "900" });
  const expl = el("div", { fontSize: "31px", color: "#5B6175", textAlign: "center", whiteSpace: "pre-line", lineHeight: "1.5", width: "92%" });
  const nx = el("button", { width: "78%", minHeight: "96px", padding: "16px 0", fontSize: "38px", fontWeight: "900", fontFamily: "sans-serif", backgroundColor: theme.primary, color: "#FFF", border: "none", borderRadius: "50px", cursor: "pointer", boxShadow: `0 10px 22px ${hexToRgba(theme.primary, 0.32)}` }, isLast ? (textData.lastBtn || textData.nextBtn) : textData.nextBtn);
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

// ───────── RESULT ─────────
function renderResult() {
  const total = textData.quizItems.length;
  const perfect = score === total;
  if (perfect) startCelebration();
  const c = applyScreen("RESULT");
  setStyle(c, { flexDirection: "row", padding: "3.4% 3.6%", columnGap: "3.2%" });

  const left = el("div", { flex: "1.05", display: "flex", flexDirection: "column", justifyContent: "center", rowGap: "4%" });
  const h = el("div", {});
  h.appendChild(el("div", { fontSize: "54px", fontWeight: "900", color: theme.primary, marginBottom: "12px" }, `\u{1F389} ${textData.resultTitle}`));
  h.appendChild(el("div", { fontSize: "30px", color: "#5B6175", whiteSpace: "pre-line", lineHeight: "1.5" }, perfect ? textData.resultPerfect : textData.resultGood));
  left.appendChild(h);

  const sg = el("div", { display: "flex", alignItems: "center", columnGap: "22px" });
  const badge = el("div", {
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    background: `linear-gradient(150deg, ${theme.primary}, ${theme.primaryDark})`, borderRadius: "28px",
    padding: "20px 38px", color: "#FFF", animation: "popIn 0.5s ease both", boxShadow: `0 14px 30px ${hexToRgba(theme.primary, 0.35)}`
  });
  badge.appendChild(el("div", { fontSize: "25px", fontWeight: "bold", opacity: "0.9" }, textData.resultScore));
  badge.appendChild(el("div", { fontSize: "56px", fontWeight: "900", letterSpacing: "3px" }, `${points}점`));
  sg.appendChild(badge);
  const sr = el("div", { display: "flex", flexDirection: "column", rowGap: "6px" });
  sr.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, `정답 ${score} / ${total}`));
  sr.appendChild(el("div", { fontSize: "23px", color: "#8B91A6" }, `문항당 +${POINT_PER_Q}점`));
  sg.appendChild(sr);
  left.appendChild(sg);

  const eff = el("div", { display: "flex", flexDirection: "column", rowGap: "12px" });
  eff.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#9098AD" }, textData.effectsTitle || ""));
  const echips = el("div", { display: "flex", flexWrap: "wrap", gap: "11px" });
  for (const e of (textData.effects || [])) {
    const ec = el("div", { display: "flex", alignItems: "center", columnGap: "8px", backgroundColor: hexToRgba(theme.accent, 0.13), border: `2px solid ${hexToRgba(theme.accent, 0.3)}`, borderRadius: "24px", padding: "9px 18px" });
    ec.appendChild(el("div", { fontSize: "24px" }, e.icon));
    ec.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#2C7A6E" }, e.label));
    echips.appendChild(ec);
  }
  eff.appendChild(echips);
  left.appendChild(eff);

  const right = el("div", { flex: "1", display: "flex", flexDirection: "column", rowGap: "3%" });
  const ct = textData.contact || {};
  const cc = el("div", {
    display: "flex", flexDirection: "column", rowGap: "10px",
    background: `linear-gradient(160deg, ${hexToRgba(theme.primary, 0.1)}, ${hexToRgba(theme.accent, 0.1)})`,
    borderRadius: "26px", padding: "4% 5%", boxSizing: "border-box"
  });
  cc.appendChild(el("div", { fontSize: "26px", fontWeight: "900", color: theme.ink }, `\u{1F4DE} ${textData.contactTitle || "문의 및 안내"}`));
  cc.appendChild(el("div", { fontSize: "29px", fontWeight: "900", color: theme.ink }, ct.name || ""));
  if (ct.phone) cc.appendChild(el("div", { fontSize: "33px", fontWeight: "900", color: theme.primary }, `\u{1F4F1}  ${ct.phone}`));
  const sub = el("div", { display: "flex", flexWrap: "wrap", columnGap: "20px", rowGap: "6px" });
  if (ct.kakao) sub.appendChild(el("div", { fontSize: "23px", color: "#6A708A", fontWeight: "bold" }, `\u{1F4AC} ${ct.kakao}`));
  if (ct.instagram) sub.appendChild(el("div", { fontSize: "23px", color: "#6A708A", fontWeight: "bold" }, `\u{1F4F8} ${ct.instagram}`));
  cc.appendChild(sub);
  if (ct.note) cc.appendChild(el("div", { fontSize: "22px", color: "#8B91A6", whiteSpace: "pre-line", lineHeight: "1.4" }, ct.note));
  right.appendChild(cc);

  const acts = el("div", { flex: "1", display: "flex", flexDirection: "column", justifyContent: "flex-end", rowGap: "13px" });
  acts.appendChild(el("div", { fontSize: "23px", fontWeight: "900", color: "#9098AD" }, textData.actionsTitle || ""));
  const secBtn = (label, handler) => el("button", {
    width: "100%", minHeight: "82px", padding: "13px 0", fontSize: "30px", fontWeight: "900", fontFamily: "sans-serif",
    backgroundColor: "#FFF", color: theme.primary, border: `3px solid ${hexToRgba(theme.primary, 0.3)}`,
    borderRadius: "44px", cursor: "pointer"
  }, label, [{ event: "click", handler }]);
  acts.appendChild(secBtn(textData.reviewCardsBtn || "핵심 카드 다시 보기", () => { cardIndex = 0; showScreen("CARDS"); }));
  acts.appendChild(secBtn(textData.reviewChecklistBtn || "체크리스트 다시 보기", () => { showScreen("CHECKLIST"); }));
  const restart = pillBtn(`\u{1F501}  ${textData.restartBtn || "처음으로"}`, false, [{ event: "click", handler: () => { quizIndex = 0; score = 0; points = 0; cardIndex = 0; for (let i = 0; i < checklistStatus.length; i++) checklistStatus[i] = false; showScreen("START"); } }]);
  setStyle(restart, { width: "100%" });
  acts.appendChild(restart);
  right.appendChild(acts);

  c.appendChild(left);
  c.appendChild(right);
}

// ───────── 캔버스 배경 / 축하 ─────────
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
  ctx.save();
  ctx.fillStyle = hexToRgba(theme.primary, 0.05);
  for (let x = 80; x < appCanvas.width; x += 110) {
    for (let y = 80; y < appCanvas.height; y += 110) { ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.restore();
  ctx.save();
  for (const sh of SHAPES) {
    const dy = Math.sin(time * 0.7 + sh.phase) * 22;
    const dx = Math.cos(time * 0.5 + sh.phase) * 14;
    ctx.save();
    ctx.translate(sh.x + dx, sh.y + dy);
    ctx.rotate(sh.rot + Math.sin(time * 0.3 + sh.phase) * 0.08);
    ctx.fillStyle = hexToRgba(theme.primary, 0.06);
    roundRect(ctx, -sh.s / 2, -sh.s / 2, sh.s, sh.s, sh.s * 0.28);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
function roundRect(c2, x, y, w, h, r) {
  c2.beginPath();
  c2.moveTo(x + r, y);
  c2.arcTo(x + w, y, x + w, y + h, r);
  c2.arcTo(x + w, y + h, x, y + h, r);
  c2.arcTo(x, y + h, x, y, r);
  c2.arcTo(x, y, x + w, y, r);
  c2.closePath();
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
  brandIcon = textData.brandIcon || "\u{1F3A7}";
  layoutId = textData.layout || "topbar";
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
