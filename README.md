# my-portfolio — 97kuek.github.io

Keitaro Ueki のポートフォリオサイト。Astro + Markdoc ベースの静的サイト。

**URL**: <https://97kuek.github.io>

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | Astro 5（静的出力） |
| コンテンツ形式 | Markdoc（`.mdoc`） / Markdown / YAML |
| スタイル | TailwindCSS 4 + daisyUI 5 |
| コードハイライト | astro-expressive-code（Shiki ベース） |
| 数式 | KaTeX（remark-math + rehype-katex） |
| ホスティング | GitHub Pages / GitHub Actions |

## セットアップ

```bash
npm install       # 依存関係のインストール
npm run dev       # 開発サーバー起動（localhost:4321）
npm run build     # 本番ビルド
npm run preview   # ビルド結果のプレビュー
npm run audit:ui  # Playwright による代表画面のUI監査
```

## デプロイ

`main` ブランチへのプッシュで GitHub Actions が自動ビルド & GitHub Pages にデプロイされる。

## ディレクトリ構成

```text
.
├── src/
│   ├── content/        # コンテンツ（Astro Content Collections）
│   │   ├── blog/       # ブログ記事（.mdoc）
│   │   ├── projects/   # プロジェクト（.mdoc）
│   │   ├── work/       # 職務経歴（.md）
│   │   ├── education/  # 経歴（.md）
│   │   └── hero/       # ヒーロー情報（.yaml）
│   ├── layouts/        # ページレイアウト
│   ├── components/     # UI コンポーネント
│   ├── pages/          # ルーティング（.astro）
│   └── assets/         # 最適化対象の画像
├── public/             # 静的ファイル（そのままコピー）
├── docs/               # 開発ドキュメント
│   ├── spec.md         # プロジェクト仕様
│   ├── components.md   # コンポーネント一覧
│   ├── content-guide.md # コンテンツ執筆ガイド
│   └── CONTRIBUTING.md # Git 運用ルール
├── AGENTS.md           # Codex / AI エージェント向けガイド
├── CLAUDE.md           # Claude Code 向け入口
├── markdoc.config.mjs  # Markdoc 設定
└── astro.config.mjs    # Astro 設定
```

## コンテンツの追加

### ブログ記事

`src/content/blog/記事名.mdoc` を作成：

```yaml
---
title: "記事タイトル"
description: "説明文"
publishDate: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
---
```

詳細は [docs/spec.md](docs/spec.md)、コンテンツ執筆は [docs/content-guide.md](docs/content-guide.md)、Git 運用は [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) を参照。
