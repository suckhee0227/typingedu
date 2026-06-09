// import section

import { AppHelper } from "./appHelper";

// declaration section

// Interface for asset list data
interface IAssetList {
  images: any[];
  sounds: any[];
}

// Interface declarations
interface IAppData {
  logicalWidth: number;
  logicalHeight: number;
}

interface IQuizItem {
  q: string;
  a: string;
  expl: string;
}

interface IChecklistItem {
  icon: string;
  label: string;
}

interface ITextData {
  startTitle: string;
  startSub: string;
  startDesc: string;
  timeInfo: string;
  quizInfo: string;
  startBtn: string;
  checklistTitle: string;
  checklistDesc: string;
  checklistItems: IChecklistItem[];
  checklistProgress: string;
  checklistHint: string;
  checklistNext: string;
  quizTitle: string;
  quizItems: IQuizItem[];
  nextBtn: string;
  lastBtn: string;
  correctText: string;
  wrongText: string;
  resultTitle: string;
  resultPerfect: string;
  resultGood: string;
  resultScore: string;
  resultDesc: string;
  restartBtn: string;
}

// Variable for storing asset list
let assetList: IAssetList;

// Variable declarations
let appData: IAppData;

let textData: ITextData;

let appCanvas: HTMLCanvasElement;

let ctx: CanvasRenderingContext2D;

let uiLayer: HTMLElement;

let currentState: string = "START";

let quizIndex: number = 0;

let score: number = 0;

let checklistStatus: boolean[] = [];

let quizAnswered: boolean = false;

let time: number = 0;

let animationFrameId: number = 0;

// 결과 화면 축하 파티클 (만점일 때만 활성화)
interface IConfetti {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot: number;
  vr: number;
}
let confetti: IConfetti[] = [];
let celebrating: boolean = false;

// 배경에서 천천히 떠다니는 물방울 (고정 위상 — 결정적 애니메이션)
// 16:9 가로형(1920x1080) 기준 좌표
const BUBBLES = [
  { x: 230, y: 240, r: 50, phase: 0 },
  { x: 1750, y: 880, r: 90, phase: 1.2 },
  { x: 1620, y: 170, r: 40, phase: 2.4 },
  { x: 160, y: 860, r: 70, phase: 3.6 },
  { x: 780, y: 990, r: 30, phase: 4.8 },
  { x: 90, y: 520, r: 35, phase: 0.6 },
];

const PRIMARY = "#FF7F50";

/** 화면 전환·강조에 쓰는 keyframe 애니메이션을 1회만 주입한다. */
function injectStyles(): void {
  if (document.getElementById("appAnims")) return;
  const style = document.createElement("style");
  style.id = "appAnims";
  style.textContent = `
@keyframes fadeInUp { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pop { 0% { transform: scale(0.6); } 60% { transform: scale(1.18); } 100% { transform: scale(1); } }
@keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.2); } 100% { transform: scale(1); opacity: 1; } }
@keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-14px); } 40% { transform: translateX(14px); } 60% { transform: translateX(-9px); } 80% { transform: translateX(9px); } }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.04); } }
@keyframes fillBar { from { width: var(--from); } to { width: var(--to); } }
`;
  document.head.appendChild(style);
}

function clearUI(): void {
  while (uiLayer.firstChild) {
    uiLayer.removeChild(uiLayer.firstChild);
  }
}

function showScreen(state: string): void {
  currentState = state;
  celebrating = false;
  confetti = [];
  clearUI();

  if (state === "START") {
    renderStartScreen();
  } else if (state === "CHECKLIST") {
    renderChecklistScreen();
  } else if (state === "QUIZ") {
    quizAnswered = false;
    renderQuizScreen();
  } else if (state === "RESULT") {
    renderResultScreen();
  }
}

function renderStartScreen(): void {
  const container = AppHelper.createUIElement("div", "startContainer", {
    position: "absolute",
    left: "37%",
    top: "13%",
    width: "58%",
    height: "74%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "7% 7%",
    rowGap: "6%",
    fontFamily: "sans-serif",
    animation: "fadeInUp 0.5s ease both",
  });

  const titleGroup = AppHelper.createUIElement("div", "", { textAlign: "center" });
  const subTitle = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "40px", color: PRIMARY, fontWeight: "bold", marginBottom: "18px" },
    textData.startSub,
  );
  const mainTitle = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "80px", color: "#333", fontWeight: "900" },
    textData.startTitle,
  );
  titleGroup.appendChild(subTitle);
  titleGroup.appendChild(mainTitle);

  const descText = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "45px",
      color: "#666",
      textAlign: "center",
      whiteSpace: "pre-line",
      lineHeight: "1.5",
    },
    textData.startDesc,
  );

  const infoGroup = AppHelper.createUIElement("div", "", {
    display: "flex",
    width: "82%",
    justifyContent: "space-between",
    borderTop: "2px solid #EEE",
    paddingTop: "6%",
  });
  const timeInfo = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "35px", color: "#888", fontWeight: "bold" },
    textData.timeInfo,
  );
  const quizInfo = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "35px", color: "#888", fontWeight: "bold" },
    textData.quizInfo,
  );
  infoGroup.appendChild(timeInfo);
  infoGroup.appendChild(quizInfo);

  const startBtn = AppHelper.createUIElement(
    "button",
    "startBtn",
    {
      width: "80%",
      minHeight: "128px",
      padding: "24px 0",
      marginTop: "2%",
      fontSize: "55px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: PRIMARY,
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 10px 24px rgba(255, 127, 80, 0.35)",
      animation: "pulse 2s ease-in-out infinite",
    },
    textData.startBtn,
    [{ event: "click", handler: () => showScreen("CHECKLIST") }],
  );

  container.appendChild(titleGroup);
  container.appendChild(descText);
  container.appendChild(infoGroup);
  container.appendChild(startBtn);

  uiLayer.appendChild(container);
}

function renderChecklistScreen(): void {
  clearUI();

  const container = AppHelper.createUIElement("div", "checkContainer", {
    position: "absolute",
    left: "35%",
    top: "5%",
    width: "62%",
    height: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif",
    animation: "fadeInUp 0.45s ease both",
  });

  const headerGroup = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "4%", width: "100%" });
  const title = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "60px", color: PRIMARY, fontWeight: "900", marginBottom: "12px" },
    textData.checklistTitle,
  );
  const desc = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "34px", color: "#666", whiteSpace: "pre-line" },
    textData.checklistDesc,
  );
  headerGroup.appendChild(title);
  headerGroup.appendChild(desc);

  // 진행도 표시 (N / total 확인 완료)
  const doneCount = checklistStatus.filter((s) => s === true).length;
  const total = textData.checklistItems.length;
  const progressText = (textData.checklistProgress || "{done} / {total}")
    .replace("{done}", String(doneCount))
    .replace("{total}", String(total));

  const progressWrap = AppHelper.createUIElement("div", "", {
    width: "100%",
    marginBottom: "4%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  });
  const progressLabel = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "30px", color: PRIMARY, fontWeight: "bold", marginBottom: "10px" },
    progressText,
  );
  const barTrack = AppHelper.createUIElement("div", "", {
    width: "85%",
    height: "16px",
    backgroundColor: "#F0EAE6",
    borderRadius: "10px",
    overflow: "hidden",
  });
  const barFill = AppHelper.createUIElement("div", "", {
    width: `${(doneCount / total) * 100}%`,
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: "10px",
    transition: "width 0.35s ease",
  });
  barTrack.appendChild(barFill);
  progressWrap.appendChild(progressLabel);
  progressWrap.appendChild(barTrack);

  const listContainer = AppHelper.createUIElement("div", "", {
    width: "100%",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  });

  for (let i = 0; i < textData.checklistItems.length; i++) {
    const isChecked = checklistStatus[i];
    const itemData = textData.checklistItems[i];

    const item = AppHelper.createUIElement(
      "div",
      "",
      {
        width: "100%",
        height: "16%",
        display: "flex",
        alignItems: "center",
        backgroundColor: isChecked ? "#FFF5F0" : "#F9F9F9",
        borderRadius: "20px",
        padding: "0 4%",
        boxSizing: "border-box",
        cursor: "pointer",
        border: isChecked ? `3px solid ${PRIMARY}` : "3px solid transparent",
        transition: "all 0.2s",
      },
      "",
      [
        {
          event: "click",
          handler: () => {
            checklistStatus[i] = !checklistStatus[i];
            renderChecklistScreen();
          },
        },
      ],
    );

    // 항목별 아이콘
    const iconBox = AppHelper.createUIElement(
      "div",
      "",
      {
        width: "84px",
        height: "84px",
        minWidth: "84px",
        borderRadius: "22px",
        backgroundColor: isChecked ? "#FFFFFF" : "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        marginRight: "4%",
        boxShadow: isChecked ? "0 4px 12px rgba(255,127,80,0.25)" : "0 2px 8px rgba(0,0,0,0.06)",
      },
      itemData.icon,
    );

    const label = AppHelper.createUIElement(
      "div",
      "",
      {
        fontSize: "36px",
        color: isChecked ? "#333" : "#777",
        fontWeight: isChecked ? "bold" : "normal",
        flex: "1",
        lineHeight: "1.3",
      },
      itemData.label,
    );

    const checkCircle = AppHelper.createUIElement("div", "", {
      width: "60px",
      height: "60px",
      minWidth: "60px",
      borderRadius: "30px",
      border: isChecked ? "none" : "4px solid #CCC",
      backgroundColor: isChecked ? PRIMARY : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "3%",
      boxSizing: "border-box",
    });

    if (isChecked) {
      checkCircle.style.animation = "pop 0.3s ease";
      const checkMark = AppHelper.createUIElement(
        "div",
        "",
        { color: "#FFF", fontSize: "40px", fontWeight: "bold" },
        "✓",
      );
      checkCircle.appendChild(checkMark);
    }

    item.appendChild(iconBox);
    item.appendChild(label);
    item.appendChild(checkCircle);
    listContainer.appendChild(item);
  }

  const isAllChecked = checklistStatus.every((s) => s === true);

  const hint = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "28px",
      color: "#AAA",
      marginTop: "3%",
      marginBottom: "1%",
      textAlign: "center",
      opacity: isAllChecked ? "0" : "1",
      transition: "opacity 0.3s",
    },
    textData.checklistHint || "",
  );

  const nextBtn = AppHelper.createUIElement(
    "button",
    "checkNextBtn",
    {
      width: "80%",
      height: "12%",
      marginTop: "2%",
      fontSize: "45px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: isAllChecked ? PRIMARY : "#DDD",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: isAllChecked ? "pointer" : "not-allowed",
      boxShadow: isAllChecked ? "0 10px 20px rgba(255, 127, 80, 0.3)" : "none",
      transition: "background-color 0.3s",
      animation: isAllChecked ? "pop 0.3s ease" : "none",
    },
    textData.checklistNext,
    [
      {
        event: "click",
        handler: () => {
          if (isAllChecked) showScreen("QUIZ");
        },
      },
    ],
  );

  container.appendChild(headerGroup);
  container.appendChild(progressWrap);
  container.appendChild(listContainer);
  container.appendChild(hint);
  container.appendChild(nextBtn);

  uiLayer.appendChild(container);
}

function renderQuizScreen(): void {
  const qData = textData.quizItems[quizIndex];
  const total = textData.quizItems.length;
  const isLast = quizIndex === total - 1;

  const container = AppHelper.createUIElement("div", "quizContainer", {
    position: "absolute",
    left: "35%",
    top: "10%",
    width: "62%",
    height: "80%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5% 5% 6%",
    fontFamily: "sans-serif",
    animation: "fadeInUp 0.4s ease both",
  });

  // 상단 진행 바
  const barTrack = AppHelper.createUIElement("div", "", {
    width: "100%",
    height: "16px",
    backgroundColor: "#F0EAE6",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "2%",
  });
  const barFill = AppHelper.createUIElement("div", "", {
    width: `${((quizIndex + 1) / total) * 100}%`,
    height: "100%",
    backgroundColor: PRIMARY,
    borderRadius: "10px",
    transition: "width 0.35s ease",
  });
  barTrack.appendChild(barFill);

  // 질문 + O/X + 피드백을 하나의 그룹으로 묶어 카드 중앙에 균형 배치
  const middle = AppHelper.createUIElement("div", "", {
    width: "100%",
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "6%",
  });

  const headerGroup = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center" });
  const badge = AppHelper.createUIElement(
    "div",
    "",
    {
      display: "inline-block",
      backgroundColor: PRIMARY,
      color: "#FFF",
      fontSize: "35px",
      fontWeight: "bold",
      padding: "10px 30px",
      borderRadius: "30px",
      marginBottom: "25px",
    },
    `Q${quizIndex + 1} / ${total}`,
  );
  const questionText = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "55px",
      color: "#333",
      fontWeight: "900",
      whiteSpace: "pre-line",
      lineHeight: "1.5",
    },
    qData.q,
  );

  headerGroup.appendChild(badge);
  headerGroup.appendChild(questionText);

  const oxContainer = AppHelper.createUIElement("div", "", {
    display: "flex",
    width: "88%",
    height: "190px",
    minHeight: "190px",
    justifyContent: "space-between",
  });

  const btnO = AppHelper.createUIElement(
    "button",
    "btnO",
    {
      width: "45%",
      height: "100%",
      fontSize: "140px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#4CAF50",
      color: "#FFF",
      border: "none",
      borderRadius: "40px",
      boxShadow: "0 10px 20px rgba(76, 175, 80, 0.4)",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    "O",
  );

  const btnX = AppHelper.createUIElement(
    "button",
    "btnX",
    {
      width: "45%",
      height: "100%",
      fontSize: "140px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#F44336",
      color: "#FFF",
      border: "none",
      borderRadius: "40px",
      boxShadow: "0 10px 20px rgba(244, 67, 54, 0.4)",
      cursor: "pointer",
      transition: "all 0.3s",
    },
    "X",
  );

  oxContainer.appendChild(btnO);
  oxContainer.appendChild(btnX);

  const feedbackCont = AppHelper.createUIElement("div", "", {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    rowGap: "18px",
    opacity: "0",
    transition: "opacity 0.3s",
  });

  const resultMark = AppHelper.createUIElement("div", "", {
    fontSize: "58px",
    fontWeight: "900",
  });
  const explText = AppHelper.createUIElement("div", "", {
    fontSize: "38px",
    color: "#555",
    textAlign: "center",
    whiteSpace: "pre-line",
    lineHeight: "1.5",
    width: "95%",
  });

  const nextBtn = AppHelper.createUIElement(
    "button",
    "nextBtn",
    {
      width: "80%",
      minHeight: "104px",
      padding: "20px 0",
      marginTop: "10px",
      fontSize: "45px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: PRIMARY,
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(255, 127, 80, 0.3)",
    },
    isLast ? textData.lastBtn || textData.nextBtn : textData.nextBtn,
  );

  feedbackCont.appendChild(resultMark);
  feedbackCont.appendChild(explText);
  feedbackCont.appendChild(nextBtn);

  middle.appendChild(headerGroup);
  middle.appendChild(oxContainer);
  middle.appendChild(feedbackCont);

  container.appendChild(barTrack);
  container.appendChild(middle);
  uiLayer.appendChild(container);

  const handleAns = (ans: string) => {
    if (quizAnswered) return;
    quizAnswered = true;

    const isCorrect = ans === qData.a;
    if (isCorrect) score++;

    btnO.style.opacity = ans === "O" ? "1" : "0.3";
    btnX.style.opacity = ans === "X" ? "1" : "0.3";

    // 선택한 버튼에 즉각적인 피드백 애니메이션
    const chosen = ans === "O" ? btnO : btnX;
    chosen.style.animation = isCorrect ? "pop 0.4s ease" : "shake 0.4s ease";

    resultMark.textContent = isCorrect
      ? textData.correctText || "정답이에요!"
      : textData.wrongText || "다시 확인해요";
    resultMark.style.color = isCorrect ? "#4CAF50" : "#F44336";
    resultMark.style.animation = "popIn 0.4s ease both";
    explText.textContent = qData.expl;

    feedbackCont.style.opacity = "1";

    nextBtn.addEventListener("click", () => {
      quizIndex++;
      if (quizIndex >= textData.quizItems.length) showScreen("RESULT");
      else showScreen("QUIZ");
    });
  };

  btnO.addEventListener("click", () => handleAns("O"));
  btnX.addEventListener("click", () => handleAns("X"));
}

function renderResultScreen(): void {
  const total = textData.quizItems.length;
  const isPerfect = score === total;

  // 만점이면 캔버스 축하 파티클 시작
  if (isPerfect) {
    startCelebration();
  }

  const container = AppHelper.createUIElement("div", "resContainer", {
    position: "absolute",
    left: "37%",
    top: "11%",
    width: "58%",
    height: "78%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif",
    animation: "fadeInUp 0.5s ease both",
  });

  const header = AppHelper.createUIElement("div", "", { textAlign: "center" });
  const title = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "70px", color: PRIMARY, fontWeight: "900", marginBottom: "20px" },
    textData.resultTitle,
  );
  const subMsg = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "38px", color: "#555", whiteSpace: "pre-line", lineHeight: "1.5", marginBottom: "20px" },
    isPerfect ? textData.resultPerfect || "" : textData.resultGood || "",
  );

  const scoreGroup = AppHelper.createUIElement("div", "", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "10px",
  });
  const scoreLabel = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "40px", color: "#666", marginBottom: "15px" },
    textData.resultScore,
  );
  const scoreBadge = AppHelper.createUIElement(
    "div",
    "",
    {
      display: "inline-block",
      fontSize: "75px",
      color: "#FFF",
      backgroundColor: isPerfect ? PRIMARY : "#333",
      padding: "20px 60px",
      borderRadius: "50px",
      fontWeight: "bold",
      letterSpacing: "5px",
      animation: "popIn 0.5s ease both",
    },
    `${score} / ${total}`,
  );

  scoreGroup.appendChild(scoreLabel);
  scoreGroup.appendChild(scoreBadge);

  header.appendChild(title);
  header.appendChild(subMsg);
  header.appendChild(scoreGroup);

  const desc = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "36px",
      color: "#555",
      textAlign: "center",
      whiteSpace: "pre-line",
      lineHeight: "1.5",
      padding: "0 3%",
    },
    textData.resultDesc,
  );

  const restartBtn = AppHelper.createUIElement(
    "button",
    "restartBtn",
    {
      width: "80%",
      height: "15%",
      fontSize: "50px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: PRIMARY,
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(255, 127, 80, 0.3)",
    },
    textData.restartBtn,
    [
      {
        event: "click",
        handler: () => {
          quizIndex = 0;
          score = 0;
          for (let i = 0; i < checklistStatus.length; i++) {
            checklistStatus[i] = false;
          }
          showScreen("START");
        },
      },
    ],
  );

  container.appendChild(header);
  container.appendChild(desc);
  container.appendChild(restartBtn);
  uiLayer.appendChild(container);
}

/** 만점 축하 파티클 생성 */
function startCelebration(): void {
  celebrating = true;
  confetti = [];
  const colors = ["#FF7F50", "#FFB6A3", "#4CAF50", "#FFD54F", "#FF69B4", "#80DEEA"];
  for (let i = 0; i < 80; i++) {
    confetti.push({
      x: Math.random() * appData.logicalWidth,
      y: -Math.random() * appData.logicalHeight * 0.4,
      vx: (Math.random() - 0.5) * 4,
      vy: 4 + Math.random() * 6,
      size: 14 + Math.random() * 18,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
    });
  }
}

function drawConfetti(): void {
  if (!celebrating) return;
  for (const p of confetti) {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > appData.logicalHeight + 40) {
      p.y = -40;
      p.x = Math.random() * appData.logicalWidth;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  }
}

function drawBackground(): void {
  const grad = ctx.createLinearGradient(0, 0, 0, appCanvas.height);
  grad.addColorStop(0, "#FFE4E1");
  grad.addColorStop(1, "#FFF0F5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);

  // 천천히 떠다니는 물방울
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  for (const b of BUBBLES) {
    const dy = Math.sin(time * 0.8 + b.phase) * 25;
    ctx.beginPath();
    ctx.arc(b.x, b.y + dy, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCharacter(t: number, state: string): void {
  // 16:9 가로형 — 캐릭터는 화면 좌측에 배치
  const cx = 470;
  let cy = 0;
  let scale = 1;

  if (state === "START") {
    cy = 540 + Math.sin(t * 3) * 28;
    scale = 1.9;
  } else if (state === "CHECKLIST") {
    cy = 470 + Math.sin(t * 3) * 18;
    scale = 1.4;
  } else if (state === "QUIZ") {
    cy = 470 + Math.sin(t * 3) * 18;
    scale = 1.4;
  } else if (state === "RESULT") {
    cy = 520 + Math.sin(t * 3) * 28;
    scale = 2.0;
  }

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(255, 127, 80, 0.1)";
  ctx.beginPath();
  ctx.ellipse(0, 90, 60, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -90);
  ctx.bezierCurveTo(50, -30, 90, 30, 90, 60);
  ctx.arc(0, 60, 90, 0, Math.PI, false);
  ctx.bezierCurveTo(-90, 30, -50, -30, 0, -90);
  ctx.closePath();

  const charGrad = ctx.createLinearGradient(0, -90, 0, 150);
  charGrad.addColorStop(0, "#E0F7FA");
  charGrad.addColorStop(1, "#80DEEA");
  ctx.fillStyle = charGrad;
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = "rgba(255,255,255,0.8)";
  ctx.stroke();

  const isHappy = state === "RESULT" && score === textData.quizItems.length;

  // 눈 — 만점이면 반달 웃는 눈
  ctx.strokeStyle = "#424242";
  ctx.fillStyle = "#424242";
  if (isHappy) {
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(-30, 52, 12, Math.PI, Math.PI * 2, false);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(30, 52, 12, Math.PI, Math.PI * 2, false);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(-30, 50, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(30, 50, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFF";
    ctx.beginPath();
    ctx.arc(-33, 47, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(27, 47, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 입
  ctx.beginPath();
  if (isHappy) {
    ctx.arc(0, 65, 15, 0, Math.PI, false);
    ctx.fillStyle = "#FF7043";
    ctx.fill();
  } else {
    ctx.arc(0, 65, 12, 0, Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#424242";
    ctx.stroke();
  }

  // 볼 터치
  ctx.fillStyle = "rgba(255, 105, 180, 0.4)";
  ctx.beginPath();
  ctx.arc(-55, 65, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(55, 65, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function loop(): void {
  time += 0.016;
  ctx.clearRect(0, 0, appCanvas.width, appCanvas.height);

  drawBackground();
  drawCharacter(time, currentState);
  drawConfetti();

  animationFrameId = requestAnimationFrame(loop);
}

// Initialize the app and load data
async function initApp(): Promise<void> {
  appData = await AppHelper.loadAppData<IAppData>();
  textData = await AppHelper.loadTextData<ITextData>();
  assetList = await AppHelper.loadAssetList<IAssetList>();

  appCanvas = document.getElementById("appCanvas") as HTMLCanvasElement;
  uiLayer = document.getElementById("uiLayer") as HTMLElement;

  appCanvas.width = appData.logicalWidth;
  appCanvas.height = appData.logicalHeight;
  ctx = appCanvas.getContext("2d") as CanvasRenderingContext2D;

  injectStyles();

  checklistStatus = new Array(textData.checklistItems.length).fill(false);

  showScreen("START");

  loop();
}

// export section

export { initApp };
