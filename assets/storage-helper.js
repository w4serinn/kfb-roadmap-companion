// localStorageアクセスのヘルパー。キーには必ず kfb- プレフィックスを付け、
// 他のアーティファクト等のキーと混在しないようにする。
// storage(Web Storage互換オブジェクト)を引数で受け取ることで、
// テスト時にwindow.localStorageへ依存せずモックを差し込めるようにする。

export const STORAGE_PREFIX = "kfb-";

export function toPrefixedKey(key) {
  return key.startsWith(STORAGE_PREFIX) ? key : `${STORAGE_PREFIX}${key}`;
}

export function getItem(storage, key) {
  return storage.getItem(toPrefixedKey(key));
}

export function setItem(storage, key, value) {
  storage.setItem(toPrefixedKey(key), value);
}

export function removeItem(storage, key) {
  storage.removeItem(toPrefixedKey(key));
}
