// data/roadmap.json を月カード一覧としてDOMに描画する表示層。
// ロジック(progress-logic.js等)とは分離し、DOM構築のみを担当する。
import { isChecked, setChecked, makeTaskId, makeStepId } from "./progress-logic.js";

function createTaskLink(task) {
  const link = document.createElement("a");
  link.className = "week-task__link";
  link.href = task.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = task.linkText || task.link;
  return link;
}

function createCheckItem(id, labelText, storage, onChange) {
  const label = document.createElement("label");
  label.className = "check-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isChecked(storage, id);
  checkbox.addEventListener("change", () => {
    setChecked(storage, id, checkbox.checked);
    if (onChange) onChange();
  });
  label.appendChild(checkbox);

  const span = document.createElement("span");
  span.textContent = labelText;
  label.appendChild(span);

  return label;
}

function createStepList(steps, taskId, storage, onChange) {
  const stepList = document.createElement("ol");
  stepList.className = "week-task__steps";
  stepList.hidden = true;
  for (const step of steps) {
    const stepItem = document.createElement("li");
    stepItem.appendChild(createCheckItem(makeStepId(taskId, step), step, storage, onChange));
    stepList.appendChild(stepItem);
  }
  return stepList;
}

function createWeekTaskItem(task, taskId, storage, onChange) {
  const item = document.createElement("li");
  item.className = "week-task";

  const tag = document.createElement("span");
  tag.className = "week-task__tag";
  tag.textContent = task.tag;

  const text = document.createElement("p");
  text.className = "week-task__text";
  text.textContent = task.text;

  const hasSteps = Array.isArray(task.steps) && task.steps.length > 0;

  if (hasSteps) {
    const header = document.createElement("button");
    header.type = "button";
    header.className = "week-task__header";
    header.setAttribute("aria-expanded", "false");
    header.setAttribute("aria-label", `${task.tag}のステップを開閉`);
    header.appendChild(tag);
    header.appendChild(text);
    item.appendChild(header);

    if (task.link) {
      item.appendChild(createTaskLink(task));
    }

    const stepList = createStepList(task.steps, taskId, storage, onChange);
    header.addEventListener("click", () => {
      const expanded = header.getAttribute("aria-expanded") === "true";
      header.setAttribute("aria-expanded", String(!expanded));
      stepList.hidden = expanded;
    });
    item.appendChild(stepList);
  } else {
    item.appendChild(tag);
    item.appendChild(text);
    if (task.link) {
      item.appendChild(createTaskLink(task));
    }
    item.appendChild(createCheckItem(taskId, "完了にする", storage, onChange));
  }

  return item;
}

function createMonthCard(month, storage, onChange) {
  const card = document.createElement("article");
  card.className = "month-card";

  const header = document.createElement("button");
  header.type = "button";
  header.className = "month-card__header";
  header.setAttribute("aria-expanded", "false");
  header.setAttribute("aria-label", `${month.name}の週タスクを開閉`);

  const title = document.createElement("h3");
  title.className = "month-card__title";
  title.textContent = month.name;
  header.appendChild(title);

  const goal = document.createElement("p");
  goal.className = "month-card__goal";
  goal.textContent = month.goal;
  header.appendChild(goal);

  const passLine = document.createElement("p");
  passLine.className = "month-card__pass-line";
  passLine.textContent = `合格ライン: ${month.passLine}`;
  header.appendChild(passLine);

  const taskList = document.createElement("ul");
  taskList.className = "month-card__tasks";
  taskList.hidden = true;
  for (const task of month.tasks) {
    const taskId = makeTaskId(month.id, task);
    taskList.appendChild(createWeekTaskItem(task, taskId, storage, onChange));
  }

  header.addEventListener("click", () => {
    const expanded = header.getAttribute("aria-expanded") === "true";
    header.setAttribute("aria-expanded", String(!expanded));
    taskList.hidden = expanded;
  });

  card.appendChild(header);
  card.appendChild(taskList);
  return card;
}

export function renderMonthCards(container, months, storage, onChange) {
  container.replaceChildren();

  for (const month of months) {
    container.appendChild(createMonthCard(month, storage, onChange));
  }
}

export function renderComebackMessage(container, message) {
  container.replaceChildren();

  const card = document.createElement("div");
  card.className = "comeback-card";

  const text = document.createElement("p");
  text.textContent = message;
  card.appendChild(text);

  container.appendChild(card);
}

const SEQUENCER_STEP_COUNT = 16;

export function renderOverallProgress(container, { total, completed, percent }) {
  container.replaceChildren();

  const label = document.createElement("p");
  label.className = "overall-progress__label";
  label.textContent = `全体の進捗: ${completed} / ${total}(${percent}%)`;
  container.appendChild(label);

  const steps = document.createElement("div");
  steps.className = "overall-progress__steps";
  steps.setAttribute("role", "progressbar");
  steps.setAttribute("aria-valuemin", "0");
  steps.setAttribute("aria-valuemax", "100");
  steps.setAttribute("aria-valuenow", String(percent));
  steps.setAttribute("aria-label", "全体の進捗");

  const litCount =
    total === 0 ? 0 : Math.round((completed / total) * SEQUENCER_STEP_COUNT);
  for (let i = 0; i < SEQUENCER_STEP_COUNT; i++) {
    const cell = document.createElement("span");
    cell.className = "overall-progress__cell";
    if (i < litCount) cell.classList.add("is-lit");
    steps.appendChild(cell);
  }
  container.appendChild(steps);
}
