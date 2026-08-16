// エントリーポイント。進捗トラッカーの描画ロジックは今後のサイクルで追加していく。
import { recordLastActiveDate, calculateProgress } from "./progress-logic.js";
import { renderMonthCards, renderOverallProgress } from "./roadmap-view.js";

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
    renderMonthCards(monthListContainer, months, window.localStorage, refreshOverallProgress);
  })
  .catch(() => {
    monthListContainer.textContent = "ロードマップデータの読み込みに失敗しました。";
  });
