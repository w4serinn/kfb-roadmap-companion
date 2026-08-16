# kfb-roadmap-companion

Kawaii Future Bass作曲学習ロードマップ(1年計画)を実際に走り切るための支援サイト。
詳細な目的・非ゴール・5レイヤー構成は [`DESIGN.md`](./DESIGN.md) を参照。

## 起動手順(このZIPを展開したあと)

1. 空のGitHubリポジトリを作り、このフォルダの中身をpushする

   ```bash
   cd kfb-roadmap-companion
   git init
   git add .
   git commit -m "chore: initial scaffold from design doc"
   git branch -M main
   git remote add origin <あなたのリポジトリURL>
   git push -u origin main
   ```

2. Claude Codeでこのリポジトリを開く

3. 最初のセットアップとして、`docs/ROADMAP.md`の「0. プロジェクト基盤(セットアップ)」
   から着手させる。具体的には以下のように指示するとよい:

   ```
   evolve skillの手順に従って、docs/ROADMAP.mdの
   「0. プロジェクト基盤(セットアップ)」から1サイクル進めて。
   ```

4. 以降は同じ指示(または「evolveを実行して」)を繰り返すことで、
   `docs/ROADMAP.md`の優先順に沿って自動的に開発が進む

## ディレクトリ構成

```
kfb-roadmap-companion/
├── DESIGN.md                        # 設計書(目的・非ゴール・5レイヤー構成)
├── README.md                        # 本書
├── index.html                       # レイヤー1(進捗トラッカー)の土台
├── styles/
│   └── main.css                     # 全体スタイル
├── assets/
│   ├── main.js                      # エントリーポイント
│   ├── storage-helper.js            # localStorageヘルパー(kfb-プレフィックス強制)
│   ├── progress-logic.js            # 進捗判定ロジック(最終操作日の記録等)
│   └── roadmap-view.js              # 月カード等の表示層(DOM構築)
├── data/
│   └── roadmap.json                 # 1年計画のロードマップデータ(月・週・日次ステップ)
├── .github/workflows/
│   └── deploy.yml                   # mainへのpushでGitHub Pagesにデプロイ
├── .claude/skills/
│   ├── evolve/SKILL.md              # 1サイクルの自動開発手順
│   └── local-review/SKILL.md        # commit前の客観レビュー手順
└── docs/
    ├── ROADMAP.md                   # 開発バックログ(フェーズ・機能一覧)
    ├── roadmap-done.md              # 完了サブタスクの退避先
    ├── cycle-log.md                 # サイクル履歴(自動追記される)
    ├── MESSAGES.md                  # 励まし文言の承認リスト
    ├── SOUND_PRESETS.md             # 音源プリセットの承認リスト
    └── FEATURE_PROPOSALS.md         # 新機能追加の提案リスト
```

## 開発コマンド

```bash
npm install
npm run lint   # eslintによる静的解析
npm test       # node --testによるユニットテスト
npm run build  # index.html / styles/ / assets/ / data/ を dist/ にまとめる
npm run dev    # ローカルサーバーで確認(http://localhost:8080)
```

`index.html`をブラウザで直接開く(`file://`で開く)と、ESモジュール
(`<script type="module">`)がCORS制限で読み込めず、画面が「読み込み中…」の
まま止まって見える。ローカルで確認する際は必ず`npm run dev`を使うこと。

## GitHub Pagesの有効化(手動で1回だけ必要)

`.github/workflows/deploy.yml`はmainへのpushで自動デプロイするが、リポジトリの
Settings → Pages → Source を「GitHub Actions」に切り替える設定は人間が1回だけ
手動で行う必要がある。
