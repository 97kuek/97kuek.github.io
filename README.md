# Keitaro Ueki Portfolio

Keitaro Ueki のポートフォリオサイト。Astro + Markdoc ベースの静的サイト。

**URL**: <https://97kuek.pages.dev>

## 技術スタック

| カテゴリ | 技術 |
| --- | --- |
| フレームワーク | Astro 5（静的出力） |
| コンテンツ形式 | Markdoc（`.mdoc`） / Markdown / YAML |
| スタイル | TailwindCSS 4 + daisyUI 5 |
| コードハイライト | astro-expressive-code（Shiki ベース） |
| 数式 | KaTeX（remark-math + rehype-katex） |
| ホスティング | Cloudflare Pages |
| バックエンド | Cloudflare Pages Functions + D1 |

## セットアップ

```bash
npm install       # 依存関係のインストール
npm run dev       # Pages Functions + ローカルD1（localhost:8788）
npm run dev:astro # UIのみのAstro開発サーバー（localhost:4321）
npm run check     # Astro + Functionsの型チェック
npm run build     # 本番ビルド
npm run audit:ui  # Playwrightによる代表画面のUI監査
```

`npm run dev` はビルドとローカルD1 migrationを行ってから、本番相当のAPIを含む開発サーバーを起動する。

## Cloudflareへのデプロイ

`main` へのpushは、GitHub Actionsの品質チェック通過後にCloudflare Pagesへ自動デプロイされる。
初回のみGitHub Actionsへ `CLOUDFLARE_ACCOUNT_ID` と `CLOUDFLARE_API_TOKEN` を登録し、
Repository variable `CLOUDFLARE_PAGES_DEPLOY_ENABLED=true` を設定する。

```bash
npm run db:migrate:remote
npm run deploy:cloudflare
```

`wrangler.jsonc` がPagesとD1の一次設定。`SPAM_SALT` はCloudflare secretで管理する。
任意の `CONTACT_WEBHOOK_URL` を設定すると、D1保存に加えて問い合わせ内容を通知できる。

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
├── functions/          # Pages Functions（問い合わせ・コメントAPI）
├── migrations/         # D1 migration
├── public/             # 静的ファイル（そのままコピー）
├── docs/               # 開発ドキュメント
│   ├── spec.md         # プロジェクト仕様
│   ├── components.md   # コンポーネント一覧
│   ├── content-guide.md # コンテンツ執筆ガイド
│   └── CONTRIBUTING.md # Git 運用ルール
├── AGENTS.md           # Codex / AI エージェント向けガイド
├── CLAUDE.md           # Claude Code 向け入口
├── markdoc.config.mjs  # Markdoc 設定
├── astro.config.mjs    # Astro 設定
└── wrangler.jsonc      # Cloudflare Pages / D1 設定
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
