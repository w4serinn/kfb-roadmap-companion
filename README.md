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
│   └── main.js                      # エントリーポイント(今後ロジックを追加)
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

## 未整備な部分(手動で用意が必要)

- `package.json`(lint/test/buildコマンド)はまだ無い。フェーズ1の
  「0. プロジェクト基盤(セットアップ)」タスクの中でClaude Codeに
  用意させる想定
- GitHub Pagesへのデプロイworkflowも同様に未整備
