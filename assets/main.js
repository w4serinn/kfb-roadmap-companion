// エントリーポイント。進捗トラッカーの描画ロジックは今後のサイクルで追加していく。
import {
  recordLastActiveDate,
  getLastActiveDate,
  calculateProgress,
  shouldShowComebackMode,
  exportProgressData,
} from "./progress-logic.js";
import { renderMonthCards, renderOverallProgress, renderComebackMessage } from "./roadmap-view.js";

const COMEBACK_MESSAGE = "今日はページを開いて既存プロジェクトを再生するだけでOK";

// 「前回の最終操作日から何日経過したか」を判定する必要があるため、
// 今日の日付で上書き記録する前に、直近の最終操作日を先に読み出しておく。
const previousLastActiveDate = getLastActiveDate(window.localStorage);
const isComeback = shouldShowComebackMode(previousLastActiveDate, new Date());
recordLastActiveDate(window.localStorage);

const monthListContainer = document.getElementById("month-list");
const overallProgressContainer = document.getElementById("overall-progress");

fetch("data/roadmap.json")
  .then((response) => response.json())
  .then((months) => {
    const refreshOverallProgress = () => {
      renderOverallProgress(
        overallProgressContainer,
        calculateProgress(window.localStorage, months)
      );
    };

    refreshOverallProgress();

    if (isComeback) {
      renderComebackMessage(monthListContainer, COMEBACK_MESSAGE);
    } else {
      renderMonthCards(monthListContainer, months, window.localStorage, refreshOverallProgress);
    }
  })
  .catch(() => {
    monthListContainer.textContent = "ロードマップデータの読み込みに失敗しました。";
  });

const exportButton = document.getElementById("export-progress-button");
exportButton.addEventListener("click", () => {
  const data = exportProgressData(window.localStorage);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `kfb-progress-${data.exportedAt.slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
});
