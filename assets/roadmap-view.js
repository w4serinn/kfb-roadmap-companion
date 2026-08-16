// data/roadmap.json を月カード一覧としてDOMに描画する表示層。
// ロジック(progress-logic.js等)とは分離し、DOM構築のみを担当する。

export function renderMonthCards(container, months) {
  container.replaceChildren();

  for (const month of months) {
    const card = document.createElement("article");
    card.className = "month-card";

    const title = document.createElement("h3");
    title.className = "month-card__title";
    title.textContent = month.name;

    const goal = document.createElement("p");
    goal.className = "month-card__goal";
    goal.textContent = month.goal;

    card.appendChild(title);
    card.appendChild(goal);
    container.appendChild(card);
  }
}
