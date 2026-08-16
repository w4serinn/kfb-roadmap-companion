import { test } from "node:test";
import assert from "node:assert/strict";
import { STORAGE_PREFIX, toPrefixedKey, getItem, setItem, removeItem } from "./storage-helper.js";

function createFakeStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    _store: store,
  };
}

test("toPrefixedKey: プレフィックスが無ければ付与する", () => {
  assert.equal(toPrefixedKey("progress"), `${STORAGE_PREFIX}progress`);
});

test("toPrefixedKey: 既にプレフィックスがあれば二重に付けない", () => {
  assert.equal(toPrefixedKey(`${STORAGE_PREFIX}progress`), `${STORAGE_PREFIX}progress`);
});

test("setItem/getItem: プレフィックス付きキーで保存・取得できる", () => {
  const storage = createFakeStorage();
  setItem(storage, "progress", "42");
  assert.equal(storage._store.get(`${STORAGE_PREFIX}progress`), "42");
  assert.equal(getItem(storage, "progress"), "42");
});

test("getItem: 未保存のキーはnullを返す", () => {
  const storage = createFakeStorage();
  assert.equal(getItem(storage, "unknown"), null);
});

test("removeItem: プレフィックス付きキーを削除する", () => {
  const storage = createFakeStorage();
  setItem(storage, "progress", "42");
  removeItem(storage, "progress");
  assert.equal(getItem(storage, "progress"), null);
});
