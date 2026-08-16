# cycle-log

evolve/SKILL.mdの手順に従い、1サイクルごとに以下の形式で追記していく。

```
## YYYY-MM-DD HH:MM
- 実装: (実装した内容)
- レビュー: OK / 指摘N件対応 / スキップ
- lint: ✓ / test: ✓ / build: ✓
- 次回予定: (次のサイクルで着手予定の項目)
- blocked / partial: なし or (内容)
```

---

## 2026-08-16 11:38
- 実装: 「0. プロジェクト基盤(セットアップ)」の最初のサブタスク「静的サイトの土台を作る」。
  `index.html`(進捗トラッカーのプレースホルダー)、`styles/main.css`(kawaii系配色)、
  `assets/main.js`(エントリーポイントの空スタブ)を新規作成。README.mdのディレクトリ構成も更新。
- レビュー: 指摘1件対応(グラデーションテキストの`background-clip: text`非対応ブラウザ向けフォールバック色を追加)
- lint: - / test: - / build: -(package.json未整備のため対象コマンドなし。次サブタスクで整備予定)
- 次回予定: 「0. プロジェクト基盤(セットアップ)」の`package.json`にlint/test/buildコマンドを整備するサブタスク
- blocked / partial: なし

## 2026-08-16 12:19
- 実装: 「0. プロジェクト基盤(セットアップ)」の`package.json`にlint/test/buildコマンドを整備するサブタスク。
  `eslint`(flat config)、`node --test`によるテスト、静的ファイルを`dist/`にまとめる
  `scripts/build.js`を追加。`.gitignore`に`node_modules/`と`dist/`を追加。README.mdに開発コマンドの案内を追加。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(対象テストはまだ0件。progress-logic.js等の実装時に追加予定) / build: ✓
- 次回予定: 「0. プロジェクト基盤(セットアップ)」の`localStorage`アクセス用ヘルパー(`assets/storage-helper.js`)の実装
- blocked / partial: なし

## 2026-08-16 12:33
- 実装: 「0. プロジェクト基盤(セットアップ)」の`localStorage`アクセス用ヘルパー`assets/storage-helper.js`を実装。
  `kfb-`プレフィックスを強制する`toPrefixedKey`/`getItem`/`setItem`/`removeItem`を提供し、
  storageオブジェクトを引数で受け取る形にしてテスト容易性を確保。ユニットテスト5件を追加。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(5件) / build: ✓
- 次回予定: 「0. プロジェクト基盤(セットアップ)」のGitHub Pagesへのデプロイworkflowを用意する
- blocked / partial: なし

## 2026-08-16 13:31
- 実装: 「0. プロジェクト基盤(セットアップ)」のGitHub Pagesへのデプロイworkflow
  `.github/workflows/deploy.yml`を追加(mainへのpushでlint/test/build後に`dist/`を
  デプロイ)。あわせて、テスト時にビルド前提のバグを発見: `scripts/build.js`が
  `assets/*.test.js`もそのまま`dist/`にコピーしてしまい、`node --test`が
  リポジトリ全体を再帰的にスキャンする既定挙動と組み合わさってテストが二重実行
  される不具合があったため、build.jsにテストファイル除外フィルタを追加し、
  `npm test`のスキャン対象を`assets`ディレクトリに限定して修正。
  これでfeature 0「プロジェクト基盤(セットアップ)」の全サブタスクが完了。
- レビュー: OK(指摘なし。ビルド起因の不具合は実装中に発見しその場で修正)
- lint: ✓ / test: ✓(5件) / build: ✓(dist/にテストファイルが含まれないことを確認)
- 次回予定: 「1. 進捗トラッカー(既存チェックリストの移植)」の最初のサブタスク
  (ロードマップデータを`data/roadmap.json`相当の形に移植する)
- blocked / partial: なし

## 2026-08-16 13:34
- 実装: 「1. 進捗トラッカー」の最初のサブタスクは、移植元の実データ(Claude.ai
  アーティファクト版のチェックリスト内容)がリポジトリ内に無く着手できないため
  `blocked`に変更し理由を記載(ユーザーからのデータ提供待ち)。代わりに同じ
  フェーズ1内の「2. 挫折対策の仕組み」の最初のサブタスク「最終操作日を
  localStorageに記録する」に着手。`assets/progress-logic.js`に
  `recordLastActiveDate`/`getLastActiveDate`を実装し、`assets/main.js`から
  ページ読み込み時に記録するよう配線。
- レビュー: 指摘1件対応 — 日付をUTC基準(`toISOString()`)で計算していたため、
  JSTなど朝9時より前の時間帯にローカルの暦日とズレる不具合を発見。ローカル日時
  ベースの計算に修正し、テストもタイムゾーンに依存しないDateコンストラクタに変更
- lint: ✓ / test: ✓(8件) / build: ✓
- 次回予定: 「2. 挫折対策の仕組み」の7日間隔判定・復帰表示切り替えロジック
- blocked / partial: 「1. 進捗トラッカー」のチェックリストデータ移植サブタスク(以降の
  UI・保存・可視化サブタスクも連動)。ユーザーからClaude.aiアーティファクトの
  実データ提供が必要

## 2026-08-16 13:42
- 実装: ユーザーから提供された`data/roadmap.json`(1年計画・7区間分の月/週/日次
  ステップデータ)を取り込み、「1. 進捗トラッカー」のチェックリストデータ移植
  サブタスクのblockedを解除して完了扱いに変更。データ構造の検証テスト
  (`assets/roadmap-data.test.js`、必須フィールド・id重複なしの2件)を追加。
  あわせて`scripts/build.js`のコピー対象に`data`を追加し、`dist/`に
  `data/roadmap.json`が含まれるよう修正(抜けていた)。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(10件) / build: ✓(dist/にdata/roadmap.jsonが含まれることを確認)
- 次回予定: 「1. 進捗トラッカー」の月カード・週タスク・日次ステップの3階層UI実装
- blocked / partial: なし

## 2026-08-16 14:08
- 実装: 「1. 進捗トラッカー」の3階層UIサブタスクをS/M単位に分割
  (月カード一覧 → 週タスク表示 → 日次ステップ表示)。うち最初の
  「月カードの一覧表示」を実装。`assets/roadmap-view.js`(DOM構築の表示層、
  ロジック層とは分離)を新規作成し、`assets/main.js`から`data/roadmap.json`を
  fetchして描画するよう配線。`index.html`のプレースホルダーを月カード用の
  コンテナに置き換え、`styles/main.css`にカードのスタイルを追加。
  Playwrightでローカルサーバーを立てて実ブラウザ描画を確認(7件の月カードが
  正しく表示され、コンソールエラー無しをスクリーンショットで確認)。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(10件) / build: ✓ / ブラウザ動作確認: ✓(Playwright)
- 次回予定: 「1. 進捗トラッカー」の週タスク表示(月カードをクリックで展開し、
  週タグ・本文・参考リンクを表示)
- blocked / partial: なし

## 2026-08-16 14:12
- 実装: ユーザー報告「ページを開くと『読み込み中…』のまま止まる」に対応。原因は
  `index.html`を`file://`で直接開くとESモジュール(`<script type="module">`)が
  CORS制限で読み込めず`assets/main.js`自体が実行されないこと(fetchの失敗では
  なかった)。Playwrightで`file://`アクセスを再現してconsoleエラーを確認し特定。
  対処として`npm run dev`(`http-server`によるローカルサーバー)を追加し、
  README.mdに`file://`で開いた場合の注意書きを追記。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(10件) / build: ✓ / `npm run dev`の動作確認: ✓
- 次回予定: 「1. 進捗トラッカー」の週タスク表示(月カードをクリックで展開し、
  週タグ・本文・参考リンクを表示)
- blocked / partial: なし

## 2026-08-16 14:35
- 実装: 「1. 進捗トラッカー」の週タスク表示。月カードのヘッダーをクリックすると
  展開し、各週タスクのタグ・本文・参考リンク(あれば新規タブで開く)を一覧表示する
  ように`assets/roadmap-view.js`を拡張。`styles/main.css`に開閉トリガーと
  週タスクのスタイルを追加。Playwrightで実ブラウザ動作を確認(最初のカードだけを
  クリックし、DOM状態を直接検証してそのカードだけが正しく展開/他は非展開の
  ままであることを確認)。
- レビュー: 指摘1件対応 — 開閉ボタンの中に見出し(月名)と説明文(ゴール)を
  両方含めていたため、スクリーンリーダーが長いテキストをボタン名として
  読み上げてしまう問題があり、`aria-label`で簡潔なボタン名を明示するよう修正。
- lint: ✓ / test: ✓(10件) / build: ✓ / ブラウザ動作確認: ✓(Playwright、DOM状態検証込み)
- 次回予定: 「1. 進捗トラッカー」の日次ステップの表示(週タスクをクリックで展開し、
  ステップ一覧を表示)
- blocked / partial: なし

## 2026-08-16 15:05
- 実装: 「1. 進捗トラッカー」の日次ステップの表示。週タスクに`steps`がある場合は
  タグ・本文をボタン化してクリックで開閉し、番号付きのステップ一覧を表示する
  ように`assets/roadmap-view.js`を拡張。`steps`が`null`の週タスク(5〜12ヶ月目の
  一部)は従来通り静的表示のまま(トグルボタンを出さない)。`styles/main.css`に
  対応するスタイルを追加。Playwrightで実ブラウザ動作を確認: ステップを開いた
  タスクのみ表示されること、`steps: null`の月ではトグルボタンが1つも生成されない
  ことをDOM状態で検証、スクリーンショットでも見た目を確認。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(10件) / build: ✓ / ブラウザ動作確認: ✓(Playwright、DOM状態検証込み)
- 次回予定: 「1. 進捗トラッカー」のチェック状態を`localStorage`(`kfb-progress`)に
  保存する機能の実装
- blocked / partial: なし

## 2026-08-16 15:46
- 実装: 「1. 進捗トラッカー」のチェック状態を`localStorage`(`kfb-progress`)に
  保存する機能。`assets/progress-logic.js`に`getProgress`/`isChecked`/`setChecked`
  を追加(id→trueのマップをJSON保存、falseは削除)。`assets/roadmap-view.js`で
  日次ステップ(steps有り)には各ステップにチェックボックス、週タスク(steps無し、
  5ヶ月目以降相当)には「完了にする」チェックボックスを追加し、`main.js`から
  `window.localStorage`を渡すよう配線。Playwrightでチェック→リロード後も状態が
  保持されることを確認。
- レビュー: 指摘1件対応(自己発見・その場で修正) — チェック項目のidを配列index
  (`t0`/`s0`)から生成していたため、`data/roadmap.json`に途中挿入があると既存の
  チェック状態が別項目にズレる問題があった。タグ・本文からの決定論的ハッシュ
  (`hashText`)ベースのidに変更し、挿入・並べ替えに強くした。
- lint: ✓ / test: ✓(16件) / build: ✓ / ブラウザ動作確認: ✓(Playwright、リロード後の永続化確認込み)
- 次回予定: 「1. 進捗トラッカー」の全体進捗を可視化する表示の実装
- blocked / partial: なし

## 2026-08-16 16:12
- 実装: 「1. 進捗トラッカー」の全体進捗を可視化する表示。`assets/progress-logic.js`に
  `calculateProgress`(全チェック項目に対する完了数・完了率を算出)を追加し、
  id生成を`makeTaskId`/`makeStepId`として共通化(チェックボックス側の表示と
  集計側でid計算がズレないようにするため)。`assets/roadmap-view.js`に
  `renderOverallProgress`を追加し、16マスのシーケンサー風メーター(FL Studioの
  チャンネルラックを意識したデザイン)で表示。チェックボックスのonChange
  コールバックを`main.js`まで通し、チェックのたびにメーターがリアルタイムで
  更新されるよう配線。Playwrightでチェック前後のラベル・aria-valuenow・
  点灯マス数の変化を確認(0/71(0%) → 1/71(1%))。
  これで「1. 進捗トラッカー」の全サブタスクが完了。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(19件) / build: ✓ / ブラウザ動作確認: ✓(Playwright、リアルタイム更新確認込み)
- 次回予定: 「2. 挫折対策の仕組み」の7日間隔判定・復帰表示切り替えロジック
- blocked / partial: なし

## 2026-08-16 16:36
- 実装: 「2. 挫折対策の仕組み」の7日間隔判定・復帰表示切り替えロジック。
  `assets/progress-logic.js`に`shouldShowComebackMode(lastActiveDateIso, now, thresholdDays)`
  を追加(暦日ベースで7日以上経過を判定、テスト可能な設計)。復帰用の文言
  「今日はページを開いて既存プロジェクトを再生するだけでOK」は`docs/ROADMAP.md`/
  `DESIGN.md`本文からの転記のため`docs/MESSAGES.md`の「承認済み」に直接追加。
  `main.js`では「前回の最終操作日を読み出す→復帰判定→今日の日付で上書き記録」の
  順序を厳守(先に上書きすると常に0日経過になり判定が機能しなくなるため)。
  復帰モード時は月カード一覧の代わりに`renderComebackMessage`のメッセージを表示し、
  全体進捗メーターはそのまま表示を継続する設計とした。Playwrightで通常時/8日
  経過後の両方の表示、および復帰モード表示後に最終操作日が更新されることを確認。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(24件) / build: ✓ / ブラウザ動作確認: ✓(Playwright、通常/復帰両パターン確認)
- 次回予定: 「2. 挫折対策の仕組み」の各週タスクへの「合格ライン」表示UI要素の追加
- blocked / partial: なし

## 2026-08-16 17:09
- 実装: 「2. 挫折対策の仕組み」の「合格ライン」表示UI要素。実データ(`data/roadmap.json`の
  `passLine`)が週単位ではなく月単位だったため、月カードのヘッダー部に
  「合格ライン: {passLine}」のバッジを追加する形で実装(ROADMAP.mdの元記述は
  「各週タスクに」だが、実データの粒度に合わせて月カード単位に調整)。文言は
  `passLine`の実データそのままで、新規のUI文言は追加していないためMESSAGES.md
  への追記は不要と判断。あわせて、追加した要素と既存の開閉インジケーター
  (▼週タスクを見る)が同じ行に並んでしまうレイアウトの不具合を発見・修正
  (`display: inline-block` → `block`)。Playwrightで7件のバッジ表示と
  レイアウト崩れが無いことを確認。
- レビュー: OK(指摘なし)
- lint: ✓ / test: ✓(24件) / build: ✓ / ブラウザ動作確認: ✓(Playwright)
- 次回予定: 「2. 挫折対策の仕組み」の制作系タスクへの「バージョン1」「バージョン2」入力欄の実装
- blocked / partial: なし
