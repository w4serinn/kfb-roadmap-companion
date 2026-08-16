import { test } from "node:test";
import assert from "node:assert/strict";
import {
  recordLastActiveDate,
  getLastActiveDate,
  getProgress,
  isChecked,
  setChecked,
  hashText,
} from "./progress-logic.js";

function createFakeStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
}

// タイムゾーンに依存させないため、UTC表記("...Z")ではなく
// ローカル日時を直接指定するDateコンストラクタ(年, 月[0始まり], 日, ...)を使う。

test("recordLastActiveDate: 渡した日時をYYYY-MM-DD形式で保存する", () => {
  const storage = createFakeStorage();
  const result = recordLastActiveDate(storage, new Date(2026, 7, 16, 3, 0, 0));
  assert.equal(result, "2026-08-16");
  assert.equal(getLastActiveDate(storage), "2026-08-16");
});

test("getLastActiveDate: 未記録の場合はnullを返す", () => {
  const storage = createFakeStorage();
  assert.equal(getLastActiveDate(storage), null);
});

test("recordLastActiveDate: 呼ぶたびに最新の日時で上書きする", () => {
  const storage = createFakeStorage();
  recordLastActiveDate(storage, new Date(2026, 7, 1, 0, 0, 0));
  recordLastActiveDate(storage, new Date(2026, 7, 16, 0, 0, 0));
  assert.equal(getLastActiveDate(storage), "2026-08-16");
});

test("getProgress: 未保存の場合は空オブジェクトを返す", () => {
  const storage = createFakeStorage();
  assert.deepEqual(getProgress(storage), {});
});

test("getProgress: 壊れたJSONが保存されていても空オブジェクトを返す", () => {
  const storage = createFakeStorage();
  storage.setItem("kfb-progress", "{invalid json");
  assert.deepEqual(getProgress(storage), {});
});

test("setChecked/isChecked: チェックすると記録され、他のidには影響しない", () => {
  const storage = createFakeStorage();
  setChecked(storage, "m1:t0:s0", true);
  assert.equal(isChecked(storage, "m1:t0:s0"), true);
  assert.equal(isChecked(storage, "m1:t0:s1"), false);
});

test("setChecked: falseにすると記録から削除される", () => {
  const storage = createFakeStorage();
  setChecked(storage, "m1:t0:s0", true);
  setChecked(storage, "m1:t0:s0", false);
  assert.equal(isChecked(storage, "m1:t0:s0"), false);
  assert.deepEqual(getProgress(storage), {});
});

test("hashText: 同じ文字列には常に同じ値を返す", () => {
  assert.equal(hashText("Week1のステップ"), hashText("Week1のステップ"));
});

test("hashText: 異なる文字列には異なる値を返す", () => {
  assert.notEqual(hashText("Week1"), hashText("Week2"));
});
