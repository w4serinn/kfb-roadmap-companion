import { test } from "node:test";
import assert from "node:assert/strict";
import {
  recordLastActiveDate,
  getLastActiveDate,
  getProgress,
  isChecked,
  setChecked,
  hashText,
  makeTaskId,
  makeStepId,
  calculateProgress,
  shouldShowComebackMode,
  getVersions,
  getVersionNote,
  setVersionNote,
  exportProgressData,
  importProgressData,
  resetProgress,
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

const sampleMonths = [
  {
    id: "m1",
    tasks: [
      { tag: "Week1", text: "steps付きタスクA", steps: ["step1", "step2"] },
      { tag: "Week2", text: "steps付きタスクB", steps: ["step1"] },
    ],
  },
  {
    id: "m56",
    tasks: [
      { tag: "5ヶ月目", text: "stepsなしタスクA", steps: null },
      { tag: "5ヶ月目", text: "stepsなしタスクB", steps: null },
    ],
  },
];

test("calculateProgress: 何もチェックしていない場合は0%", () => {
  const storage = createFakeStorage();
  const result = calculateProgress(storage, sampleMonths);
  // m1: 2+1=3ステップ、m56: タスク単位で2件 => 合計5件
  assert.deepEqual(result, { total: 5, completed: 0, percent: 0 });
});

test("calculateProgress: steps単位・タスク単位それぞれのチェックを反映する", () => {
  const storage = createFakeStorage();
  const taskId1 = makeTaskId("m1", sampleMonths[0].tasks[0]);
  setChecked(storage, makeStepId(taskId1, "step1"), true);

  const taskIdM56 = makeTaskId("m56", sampleMonths[1].tasks[0]);
  setChecked(storage, taskIdM56, true);

  const result = calculateProgress(storage, sampleMonths);
  assert.deepEqual(result, { total: 5, completed: 2, percent: 40 });
});

test("calculateProgress: 対象タスクが無い場合は0%(0除算しない)", () => {
  const storage = createFakeStorage();
  const result = calculateProgress(storage, []);
  assert.deepEqual(result, { total: 0, completed: 0, percent: 0 });
});

test("shouldShowComebackMode: 初回訪問(記録なし)はfalse", () => {
  assert.equal(shouldShowComebackMode(null, new Date(2026, 7, 16)), false);
});

test("shouldShowComebackMode: 6日経過はfalse", () => {
  const lastActive = "2026-08-10";
  const now = new Date(2026, 7, 16); // 6日後
  assert.equal(shouldShowComebackMode(lastActive, now), false);
});

test("shouldShowComebackMode: ちょうど7日経過はtrue", () => {
  const lastActive = "2026-08-09";
  const now = new Date(2026, 7, 16); // 7日後
  assert.equal(shouldShowComebackMode(lastActive, now), true);
});

test("shouldShowComebackMode: 7日以上経過していればtrue", () => {
  const lastActive = "2026-07-01";
  const now = new Date(2026, 7, 16);
  assert.equal(shouldShowComebackMode(lastActive, now), true);
});

test("shouldShowComebackMode: 時刻に関わらず暦日ベースで判定する", () => {
  const lastActive = "2026-08-09";
  const now = new Date(2026, 7, 16, 23, 59); // 同じ日の遅い時刻でも7日経過扱い
  assert.equal(shouldShowComebackMode(lastActive, now), true);
});

test("getVersionNote: 未記録の場合は空文字を返す", () => {
  const storage = createFakeStorage();
  assert.equal(getVersionNote(storage, "m56:abc"), "");
});

test("setVersionNote/getVersionNote: 記録した内容を取得できる", () => {
  const storage = createFakeStorage();
  setVersionNote(storage, "m56:abc", "バージョン1");
  assert.equal(getVersionNote(storage, "m56:abc"), "バージョン1");
});

test("setVersionNote: 前後の空白はtrimして保存する", () => {
  const storage = createFakeStorage();
  setVersionNote(storage, "m56:abc", "  バージョン2  ");
  assert.equal(getVersionNote(storage, "m56:abc"), "バージョン2");
});

test("setVersionNote: 空文字にすると記録から削除される", () => {
  const storage = createFakeStorage();
  setVersionNote(storage, "m56:abc", "バージョン1");
  setVersionNote(storage, "m56:abc", "");
  assert.equal(getVersionNote(storage, "m56:abc"), "");
  assert.deepEqual(getVersions(storage), {});
});

test("setVersionNote: 他のidには影響しない", () => {
  const storage = createFakeStorage();
  setVersionNote(storage, "m56:abc", "バージョン1");
  setVersionNote(storage, "m56:def", "バージョン3");
  assert.equal(getVersionNote(storage, "m56:abc"), "バージョン1");
  assert.equal(getVersionNote(storage, "m56:def"), "バージョン3");
});

test("exportProgressData: 何も記録が無い場合も空の状態でエクスポートできる", () => {
  const storage = createFakeStorage();
  const result = exportProgressData(storage, new Date(2026, 7, 16, 12, 0, 0));
  assert.equal(result.schemaVersion, 1);
  assert.equal(result.exportedAt, new Date(2026, 7, 16, 12, 0, 0).toISOString());
  assert.deepEqual(result.progress, {});
  assert.deepEqual(result.versions, {});
  assert.equal(result.lastActiveDate, null);
});

test("exportProgressData: 記録済みの内容をまとめて出力する", () => {
  const storage = createFakeStorage();
  setChecked(storage, "m1:t0:s0", true);
  setVersionNote(storage, "m56:abc", "バージョン1");
  recordLastActiveDate(storage, new Date(2026, 7, 16));

  const result = exportProgressData(storage, new Date(2026, 7, 16, 12, 0, 0));
  assert.deepEqual(result.progress, { "m1:t0:s0": true });
  assert.deepEqual(result.versions, { "m56:abc": "バージョン1" });
  assert.equal(result.lastActiveDate, "2026-08-16");
});

test("importProgressData/exportProgressData: エクスポート→インポートで元の状態に復元できる", () => {
  const source = createFakeStorage();
  setChecked(source, "m1:t0:s0", true);
  setVersionNote(source, "m56:abc", "バージョン1");
  recordLastActiveDate(source, new Date(2026, 7, 16));
  const exported = exportProgressData(source, new Date(2026, 7, 16, 12, 0, 0));

  const target = createFakeStorage();
  const result = importProgressData(target, exported);

  assert.deepEqual(result, { ok: true });
  assert.equal(isChecked(target, "m1:t0:s0"), true);
  assert.equal(getVersionNote(target, "m56:abc"), "バージョン1");
  assert.equal(getLastActiveDate(target), "2026-08-16");
});

test("importProgressData: 既存データを上書きする", () => {
  const storage = createFakeStorage();
  setChecked(storage, "old:id", true);
  const result = importProgressData(storage, {
    schemaVersion: 1,
    progress: { "new:id": true },
    versions: {},
    lastActiveDate: null,
  });
  assert.deepEqual(result, { ok: true });
  assert.equal(isChecked(storage, "old:id"), false);
  assert.equal(isChecked(storage, "new:id"), true);
});

test("importProgressData: nullや配列など不正な形式はエラーを返し何も書き込まない", () => {
  const storage = createFakeStorage();
  assert.deepEqual(importProgressData(storage, null), { ok: false, error: "invalid-format" });
  assert.deepEqual(importProgressData(storage, []), { ok: false, error: "invalid-format" });
  assert.deepEqual(importProgressData(storage, "not json"), { ok: false, error: "invalid-format" });
  assert.deepEqual(getProgress(storage), {});
});

test("importProgressData: schemaVersionが無い/一致しない場合はエラーを返す", () => {
  const storage = createFakeStorage();
  const result = importProgressData(storage, { progress: {}, versions: {} });
  assert.deepEqual(result, { ok: false, error: "unsupported-version" });
});

test("importProgressData: progress/versionsが欠けている場合はエラーを返す", () => {
  const storage = createFakeStorage();
  const result = importProgressData(storage, { schemaVersion: 1, versions: {} });
  assert.deepEqual(result, { ok: false, error: "invalid-format" });
});

test("resetProgress: チェック状態とバージョンメモを消去する", () => {
  const storage = createFakeStorage();
  setChecked(storage, "m1:t0:s0", true);
  setVersionNote(storage, "m56:abc", "バージョン1");

  resetProgress(storage);

  assert.deepEqual(getProgress(storage), {});
  assert.deepEqual(getVersions(storage), {});
});

test("resetProgress: 最終操作日は消去しない", () => {
  const storage = createFakeStorage();
  recordLastActiveDate(storage, new Date(2026, 7, 16));

  resetProgress(storage);

  assert.equal(getLastActiveDate(storage), "2026-08-16");
});
