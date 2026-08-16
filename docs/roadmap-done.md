# roadmap-done

`docs/ROADMAP.md`の各機能について、完了したサブタスク([x]にしたもの)をここに
退避していく。ROADMAP.md本体を軽量に保つための運用。

## 0. プロジェクト基盤(セットアップ)

- [x] 静的サイトの土台を作る(`index.html` / `styles/` / `assets/`)
- [x] `package.json`にlint/test/buildコマンドを整備する
- [x] `localStorage`アクセス用のヘルパー(`kfb-`プレフィックス強制)を
      `assets/storage-helper.js`に実装する
- [x] GitHub Pagesへのデプロイworkflowを用意する

## 1. 進捗トラッカー(既存チェックリストの移植)

- [x] Claude.aiアーティファクト版で作成済みのチェックリストデータ(ロードマップ
      全期間の週・日次ステップ)を`data/roadmap.json`相当の形に移植する
      (ユーザーが`data/roadmap.json`として提供)
- [x] 月カードの一覧表示(月名・ゴールのみのシンプルなカード一覧)

## 2. 挫折対策の仕組み

- [x] 最終操作日を`localStorage`(`kfb-last-active-date`)に記録する
