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
