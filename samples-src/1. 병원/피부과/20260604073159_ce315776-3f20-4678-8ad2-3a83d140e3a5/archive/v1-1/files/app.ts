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

interface ITextData {
  startTitle: string;
  startSub: string;
  startDesc: string;
  timeInfo: string;
  quizInfo: string;
  startBtn: string;
  checklistTitle: string;
  checklistDesc: string;
  checklistItems: string[];
  checklistNext: string;
  quizTitle: string;
  quizItems: IQuizItem[];
  nextBtn: string;
  resultTitle: string;
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

function clearUI(): void {
  while (uiLayer.firstChild) {
    uiLayer.removeChild(uiLayer.firstChild);
  }
}

function showScreen(state: string): void {
  currentState = state;
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
    left: "5%",
    top: "45%",
    width: "90%",
    height: "45%",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    boxShadow: "0 15px 35px rgba(255, 127, 80, 0.15)",
    pointerEvents: "auto",
    padding: "5%",
    fontFamily: "sans-serif",
  });

  const titleGroup = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "8%" });
  const subTitle = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "40px", color: "#FF7F50", fontWeight: "bold", marginBottom: "15px" },
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
      marginBottom: "8%",
    },
    textData.startDesc,
  );

  const infoGroup = AppHelper.createUIElement("div", "", {
    display: "flex",
    width: "80%",
    justifyContent: "space-between",
    marginBottom: "10%",
    borderTop: "2px solid #EEE",
    paddingTop: "5%",
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
      height: "18%",
      fontSize: "55px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      boxShadow: "0 10px 20px rgba(255, 127, 80, 0.3)",
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
    left: "5%",
    top: "20%",
    width: "90%",
    height: "75%",
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
  });

  const headerGroup = AppHelper.createUIElement("div", "", { textAlign: "center", marginBottom: "5%", width: "100%" });
  const title = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "65px", color: "#FF7F50", fontWeight: "900", marginBottom: "15px" },
    textData.checklistTitle,
  );
  const desc = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "35px", color: "#666", whiteSpace: "pre-line" },
    textData.checklistDesc,
  );
  headerGroup.appendChild(title);
  headerGroup.appendChild(desc);

  const listContainer = AppHelper.createUIElement("div", "", {
    width: "100%",
    height: "65%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  });

  for (let i = 0; i < textData.checklistItems.length; i++) {
    const isChecked = checklistStatus[i];
    const itemText = textData.checklistItems[i];

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
        padding: "0 5%",
        boxSizing: "border-box",
        cursor: "pointer",
        border: isChecked ? "3px solid #FF7F50" : "3px solid transparent",
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

    const checkCircle = AppHelper.createUIElement("div", "", {
      width: "60px",
      height: "60px",
      borderRadius: "30px",
      border: isChecked ? "none" : "4px solid #CCC",
      backgroundColor: isChecked ? "#FF7F50" : "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "5%",
      boxSizing: "border-box",
    });

    if (isChecked) {
      const checkMark = AppHelper.createUIElement(
        "div",
        "",
        { color: "#FFF", fontSize: "40px", fontWeight: "bold" },
        "✓",
      );
      checkCircle.appendChild(checkMark);
    }

    const label = AppHelper.createUIElement(
      "div",
      "",
      { fontSize: "38px", color: isChecked ? "#333" : "#777", fontWeight: isChecked ? "bold" : "normal", flex: "1" },
      itemText,
    );

    item.appendChild(checkCircle);
    item.appendChild(label);
    listContainer.appendChild(item);
  }

  const isAllChecked = checklistStatus.every((s) => s === true);
  const nextBtn = AppHelper.createUIElement(
    "button",
    "checkNextBtn",
    {
      width: "80%",
      height: "12%",
      marginTop: "5%",
      fontSize: "45px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: isAllChecked ? "#FF7F50" : "#DDD",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: isAllChecked ? "pointer" : "not-allowed",
      boxShadow: isAllChecked ? "0 10px 20px rgba(255, 127, 80, 0.3)" : "none",
      transition: "background-color 0.3s",
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
  container.appendChild(listContainer);
  container.appendChild(nextBtn);

  uiLayer.appendChild(container);
}

function renderQuizScreen(): void {
  const qData = textData.quizItems[quizIndex];

  const container = AppHelper.createUIElement("div", "quizContainer", {
    position: "absolute",
    left: "5%",
    top: "20%",
    width: "90%",
    height: "75%",
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
  });

  const headerGroup = AppHelper.createUIElement("div", "", { width: "100%", textAlign: "center", marginBottom: "5%" });
  const badge = AppHelper.createUIElement(
    "div",
    "",
    {
      display: "inline-block",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      fontSize: "35px",
      fontWeight: "bold",
      padding: "10px 30px",
      borderRadius: "30px",
      marginBottom: "25px",
    },
    `Q${quizIndex + 1} / ${textData.quizItems.length}`,
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
    width: "90%",
    height: "25%",
    justifyContent: "space-between",
    marginBottom: "5%",
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
    flex: "1",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    opacity: "0",
    transition: "opacity 0.3s",
  });

  const resultMark = AppHelper.createUIElement("div", "", {
    fontSize: "65px",
    fontWeight: "900",
    marginBottom: "15px",
  });
  const explText = AppHelper.createUIElement("div", "", {
    fontSize: "40px",
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
      height: "30%",
      marginTop: "auto",
      fontSize: "45px",
      fontWeight: "bold",
      fontFamily: "sans-serif",
      backgroundColor: "#FF7F50",
      color: "#FFF",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
    },
    textData.nextBtn,
  );

  feedbackCont.appendChild(resultMark);
  feedbackCont.appendChild(explText);
  feedbackCont.appendChild(nextBtn);

  container.appendChild(headerGroup);
  container.appendChild(oxContainer);
  container.appendChild(feedbackCont);
  uiLayer.appendChild(container);

  const handleAns = (ans: string) => {
    if (quizAnswered) return;
    quizAnswered = true;

    const isCorrect = ans === qData.a;
    if (isCorrect) score++;

    btnO.style.opacity = ans === "O" ? "1" : "0.3";
    btnX.style.opacity = ans === "X" ? "1" : "0.3";

    resultMark.textContent = isCorrect ? "정답입니다!" : "아쉬워요, 오답입니다!";
    resultMark.style.color = isCorrect ? "#4CAF50" : "#F44336";
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
  const container = AppHelper.createUIElement("div", "resContainer", {
    position: "absolute",
    left: "5%",
    top: "25%",
    width: "90%",
    height: "60%",
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
  });

  const header = AppHelper.createUIElement("div", "", { textAlign: "center" });
  const title = AppHelper.createUIElement(
    "div",
    "",
    { fontSize: "70px", color: "#FF7F50", fontWeight: "900", marginBottom: "30px" },
    textData.resultTitle,
  );

  const scoreGroup = AppHelper.createUIElement("div", "", {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
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
      backgroundColor: "#333",
      padding: "20px 60px",
      borderRadius: "50px",
      fontWeight: "bold",
      letterSpacing: "5px",
    },
    `${score} / ${textData.quizItems.length}`,
  );

  scoreGroup.appendChild(scoreLabel);
  scoreGroup.appendChild(scoreBadge);

  header.appendChild(title);
  header.appendChild(scoreGroup);

  const desc = AppHelper.createUIElement(
    "div",
    "",
    {
      fontSize: "42px",
      color: "#555",
      textAlign: "center",
      whiteSpace: "pre-line",
      lineHeight: "1.6",
      padding: "0 5%",
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
      backgroundColor: "#FF7F50",
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

function drawBackground(): void {
  const grad = ctx.createLinearGradient(0, 0, 0, appCanvas.height);
  grad.addColorStop(0, "#FFE4E1");
  grad.addColorStop(1, "#FFF0F5");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, appCanvas.width, appCanvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  ctx.beginPath();
  ctx.arc(200, 300, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(850, 1400, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(900, 250, 40, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 1600, 70, 0, Math.PI * 2);
  ctx.fill();
}

function drawCharacter(t: number, state: string): void {
  const cx = appData.logicalWidth / 2;
  let cy = 0;
  let scale = 1;

  if (state === "START") {
    cy = 400 + Math.sin(t * 3) * 30;
    scale = 1.3;
  } else if (state === "CHECKLIST") {
    cy = 160 + Math.sin(t * 3) * 15;
    scale = 0.8;
  } else if (state === "QUIZ") {
    cy = 160 + Math.sin(t * 3) * 15;
    scale = 0.8;
  } else if (state === "RESULT") {
    cy = 320 + Math.sin(t * 3) * 30;
    scale = 1.4;
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

  ctx.fillStyle = "#424242";
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

  ctx.beginPath();
  if (state === "RESULT" && score === textData.quizItems.length) {
    ctx.arc(0, 65, 15, 0, Math.PI, false);
    ctx.fillStyle = "#FF7043";
    ctx.fill();
  } else {
    ctx.arc(0, 65, 12, 0, Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#424242";
    ctx.stroke();
  }

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

  checklistStatus = new Array(textData.checklistItems.length).fill(false);

  showScreen("START");

  loop();
}

// export section

export { initApp };
