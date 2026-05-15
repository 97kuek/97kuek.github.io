# Git 運用ルール

## ブランチ戦略

### ブランチ構成

```
main          ← 本番（GitHub Pages にデプロイされる）
└── feat/*    ← 新機能・記事追加
└── fix/*     ← バグ修正・誤字修正
└── perf/*    ← パフォーマンス改善・画像最適化
└── refactor/* ← リファクタリング・構造変更
└── docs/*    ← ドキュメント更新
```

### ブランチ運用ルール

- `main` へは直接プッシュしない（小規模な修正は例外として許容）
- 機能開発・記事追加は必ずブランチを切る
- ブランチ名は `タイプ/説明` の形式（例: `feat/add-new-blog-post`）
- 作業完了後は PR を作成して `main` にマージ

### ブランチ命名例

| 作業内容 | ブランチ名 |
| --- | --- |
| 新しいブログ記事を追加 | `feat/add-blog-obsidian-claude` |
| ビルドエラーを修正 | `fix/fix-empty-codeblock-error` |
| 画像サイズを最適化 | `perf/optimize-thumbnail-images` |
| コンポーネントを整理 | `refactor/reorganize-components` |
| README を更新 | `docs/update-readme` |

---

## コミットメッセージ規約

[Conventional Commits](https://www.conventionalcommits.org/) に準拠する。

### 形式

```
<タイプ>: <概要>

[本文（省略可）]
```

### タイプ一覧

| タイプ | 用途 |
| --- | --- |
| `feat` | 新機能・新しいブログ記事・新しいプロジェクト追加 |
| `fix` | バグ修正・誤字修正・コンテンツの修正 |
| `perf` | パフォーマンス改善（画像最適化・ビルド高速化） |
| `refactor` | 機能変更を伴わないコードの整理・構造変更 |
| `style` | CSS・見た目のみの変更（ロジック変更なし） |
| `docs` | ドキュメント（README、CLAUDE.md 等）の更新 |
| `chore` | 依存関係の更新・設定変更・その他雑務 |
| `ci` | GitHub Actions 等 CI/CD の変更 |

### 概要の書き方

- 日本語で書く
- 命令形・体言止めで簡潔に（例: `〜を追加`、`〜を修正`）
- 50 文字以内を目安に
- 末尾に句点を付けない

### コミットメッセージ例

```
feat: obsidianとclaudeを連携させるブログ記事を追加
fix: obsidian-claude記事のビルドエラーを修正
perf: ブログサムネイルの画像サイズを最適化
refactor: BlogCardコンポーネントをリファクタリング
style: ナビゲーションバーのスタイルを調整
docs: READMEにセットアップ手順を追記
chore: astroを5.15.2にアップデート
ci: GitHub ActionsのNode.jsバージョンを更新
```

### 本文の書き方（省略可）

変更の「理由」や「背景」を書く。「何をしたか」はタイトルで分かるので書かない。

```
fix: obsidian-claude記事のビルドエラーを修正

expressive-codeは空のコードブロックをエラーとして扱う。
markdownコードブロック内にネストした```が含まれていたため、
外側を4バッククォートに変更して回避した。
また、dataview言語識別子はshikiに未登録のためsqlに変更。
```

---

## PR の作り方

1. `main` から作業ブランチを作成
2. 作業・コミット
3. `npm run build` でビルドエラーがないことを確認
4. GitHub で PR を作成（タイトルはコミットメッセージと同じ形式）
5. セルフレビューして `main` にマージ

---

## タグ運用

マイルストーンとなるバージョンにタグを打つ（任意）。

```
v1.0.0  ← 初回公開
v1.1.0  ← 機能追加（記事追加なども含む）
v1.x.x  ← バグ修正・細かい改善
```
