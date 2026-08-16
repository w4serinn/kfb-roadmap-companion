// エントリーポイント。進捗トラッカーの描画ロジックは今後のサイクルで追加していく。
import { recordLastActiveDate } from "./progress-logic.js";
import { renderMonthCards } from "./roadmap-view.js";

recordLastActiveDate(window.localStorage);

const monthListContainer = document.getElementById("month-list");

fetch("data/roadmap.json")
  .then((response) => response.json())
  .then((months) => renderMonthCards(monthListContainer, months))
  .catch(() => {
    monthListContainer.textContent = "ロードマップデータの読み込みに失敗しました。";
  });
