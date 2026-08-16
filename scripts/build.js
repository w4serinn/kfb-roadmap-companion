// 静的サイトをそのまま dist/ にまとめるだけのビルドスクリプト。
// フレームワーク・バンドラは使わず、GitHub Pagesへそのまま配信できる形にする。
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const rootDir = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const distDir = join(rootDir, "dist");
const entries = ["index.html", "styles", "assets", "data"];

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });

for (const entry of entries) {
  const src = join(rootDir, entry);
  if (!existsSync(src)) continue;
  cpSync(src, join(distDir, entry), {
    recursive: true,
    filter: (source) => !source.endsWith(".test.js"),
  });
}

console.log(`build: ${entries.join(", ")} -> dist/`);
