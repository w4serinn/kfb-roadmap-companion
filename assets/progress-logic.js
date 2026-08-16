// 進捗判定まわりの純粋ロジック。DOMや現在時刻を関数内部で直接参照せず、
// 呼び出し側から storage / now を引数で渡す形にすることでテスト可能にする。
import { getItem, setItem } from "./storage-helper.js";

const LAST_ACTIVE_DATE_KEY = "last-active-date";

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function recordLastActiveDate(storage, now = new Date()) {
  const isoDate = toIsoDate(now);
  setItem(storage, LAST_ACTIVE_DATE_KEY, isoDate);
  return isoDate;
}

export function getLastActiveDate(storage) {
  return getItem(storage, LAST_ACTIVE_DATE_KEY);
}

const PROGRESS_KEY = "progress";

export function getProgress(storage) {
  const raw = getItem(storage, PROGRESS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function isChecked(storage, id) {
  return Boolean(getProgress(storage)[id]);
}

export function setChecked(storage, id, checked) {
  const progress = getProgress(storage);
  if (checked) {
    progress[id] = true;
  } else {
    delete progress[id];
  }
  setItem(storage, PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

// チェック項目のidを内容(タグ・本文)から決定論的に作る。配列のindexを使うと
// data/roadmap.jsonへの途中挿入で既存のチェック状態が別項目にズレてしまうため、
// 内容ベースのハッシュにして挿入・並べ替えに強くする。
export function hashText(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

// 週タスク/日次ステップのid生成。表示層(roadmap-view.js)と集計層
// (calculateProgress)の両方から呼び、id計算がズレないようにする。
export function makeTaskId(monthId, task) {
  return `${monthId}:${hashText(`${task.tag}|${task.text}`)}`;
}

export function makeStepId(taskId, step) {
  return `${taskId}:${hashText(step)}`;
}

// 全体の完了率を計算する。1〜4ヶ月目相当(steps有り)は日次ステップ単位、
// 5ヶ月目以降相当(steps無し)は週タスク単位でカウントする。
export function calculateProgress(storage, months) {
  let total = 0;
  let completed = 0;

  for (const month of months) {
    for (const task of month.tasks) {
      const taskId = makeTaskId(month.id, task);
      const hasSteps = Array.isArray(task.steps) && task.steps.length > 0;

      if (hasSteps) {
        for (const step of task.steps) {
          total += 1;
          if (isChecked(storage, makeStepId(taskId, step))) completed += 1;
        }
      } else {
        total += 1;
        if (isChecked(storage, taskId)) completed += 1;
      }
    }
  }

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}
