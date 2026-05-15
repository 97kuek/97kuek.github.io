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
| CMS | Keystatic（管理画面: `localhost:4321/keystatic`） |
| ホスティング | GitHub Pages / GitHub Actions |

## セットアップ

```bash
npm install       # 依存関係のインストール
npm run dev       # 開発サーバー起動（localhost:4321）
npm run build     # 本番ビルド
npm run preview   # ビルド結果のプレビュー
```

## デプロイ

`main` ブランチへのプッシュで GitHub Actions が自動ビルド & GitHub Pages にデプロイされる。

## ディレクトリ構成

```text
.
├── src/
│   ├── content/        # コンテンツ（Astro Content Collections）
│   │   ├── blog/       # ブログ記事（.mdoc）
│   │   ├── projects/   # プロジェクト（.md）
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
│   └── git-conventions.md # Git 運用ルール
├── CLAUDE.md           # AI アシスタント向けガイド
├── keystatic.config.ts # Keystatic 設定
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

詳細は [docs/spec.md](docs/spec.md)、Git 運用は [docs/git-conventions.md](docs/git-conventions.md) を参照。
