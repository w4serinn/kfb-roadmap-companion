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
- [x] 週タスクの表示(月カードをクリックで展開し、週タグ・本文・参考リンクを表示)
- [x] 日次ステップの表示(週タスクをクリックで展開し、ステップ一覧を表示。
      チェック機能は次のサブタスク「チェック状態をlocalStorageに保存する」で実装)
- [x] チェック状態を`localStorage`(`kfb-progress`)に保存する

## 2. 挫折対策の仕組み

- [x] 最終操作日を`localStorage`(`kfb-last-active-date`)に記録する
