// data/roadmap.json を月カード一覧としてDOMに描画する表示層。
// ロジック(progress-logic.js等)とは分離し、DOM構築のみを担当する。

function createTaskLink(task) {
  const link = document.createElement("a");
  link.className = "week-task__link";
  link.href = task.link;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = task.linkText || task.link;
  return link;
}

function createStepList(steps) {
  const stepList = document.createElement("ol");
  stepList.className = "week-task__steps";
  stepList.hidden = true;
  for (const step of steps) {
    const stepItem = document.createElement("li");
    stepItem.textContent = step;
    stepList.appendChild(stepItem);
  }
  return stepList;
}

function createWeekTaskItem(task) {
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

    const stepList = createStepList(task.steps);
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
  }

  return item;
}

function createMonthCard(month) {
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

  const taskList = document.createElement("ul");
  taskList.className = "month-card__tasks";
  taskList.hidden = true;
  for (const task of month.tasks) {
    taskList.appendChild(createWeekTaskItem(task));
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

export function renderMonthCards(container, months) {
  container.replaceChildren();

  for (const month of months) {
    container.appendChild(createMonthCard(month));
  }
}
