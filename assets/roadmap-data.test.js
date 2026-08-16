import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const dataPath = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "roadmap.json");

test("roadmap.json: 各月データが必須フィールドを持つ", () => {
  const months = JSON.parse(readFileSync(dataPath, "utf-8"));

  assert.ok(Array.isArray(months) && months.length > 0);

  for (const month of months) {
    assert.equal(typeof month.id, "string");
    assert.equal(typeof month.name, "string");
    assert.equal(typeof month.goal, "string");
    assert.equal(typeof month.passLine, "string");
    assert.ok(Array.isArray(month.tasks) && month.tasks.length > 0);

    for (const task of month.tasks) {
      assert.equal(typeof task.tag, "string");
      assert.equal(typeof task.text, "string");
      assert.ok(task.steps === null || Array.isArray(task.steps));
    }
  }
});

test("roadmap.json: idが重複していない", () => {
  const months = JSON.parse(readFileSync(dataPath, "utf-8"));
  const ids = months.map((month) => month.id);
  assert.equal(new Set(ids).size, ids.length);
});
