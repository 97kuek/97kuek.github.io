# CLAUDE.md

## プロジェクト概要

Keitaro Ueki のポートフォリオサイト。Astro + Markdoc ベースの静的サイトで GitHub Pages にホストされている。

- **URL**: https://97kuek.github.io
- **フレームワーク**: Astro 5（静的出力）
- **コンテンツ形式**: Markdoc (`.mdoc`) / Markdown (`.md`) / YAML
- **スタイル**: TailwindCSS 4 + daisyUI 5
- **コードハイライト**: astro-expressive-code（Shiki ベース）

---

## ディレクトリ構成

```
src/
├── content/          ← コンテンツ（Astro Content Collections）
│   ├── blog/         ← ブログ記事（.mdoc）
│   ├── projects/     ← プロジェクト（.md）
│   ├── work/         ← 職務経歴（.md）
│   ├── education/    ← 経歴（.md）
│   ├── hackathons/   ← ハッカソン（.md）
│   ├── hero/         ← ヒーロー情報（.yaml）
│   ├── about/        ← 自己紹介（.md）
│   ├── general/      ← サイト全体設定（.yaml）
│   └── contact/      ← 連絡先（.md）
├── components/       ← Astro コンポーネント
├── layouts/          ← ページレイアウト
├── pages/            ← ルーティング
├── assets/           ← 画像アセット（Astro の image() で最適化）
└── utils/            ← ユーティリティ
```

---

## よく使うコマンド

```bash
npm run dev      # 開発サーバー起動（localhost:4321）
npm run build    # 本番ビルド
npm run preview  # ビルド結果のプレビュー
```

---

## コンテンツの書き方

### ブログ記事（src/content/blog/*.mdoc）

```mdoc
---
title: "記事タイトル"
description: "説明文（OGP にも使われる）"
publishDate: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
image: "@assets/blog/記事名/thumbnail.png"  # 省略可
---

本文（Markdoc 記法）
```

### コードブロックの注意点

- `astro-expressive-code` を使用しているため、**コードブロックに空の内容は不可**
- サポートされていない言語指定はビルドエラーになる（例: `dataview` → `sql` を使う）
- ````markdown のように Markdoc コードブロック内にさらに ` ``` ` を含める場合は、**外側を 4 バッククォートで囲む**こと

  ````markdown  ← 外側は 4 バッククォート
  内容（内部の ``` はそのまま使える）
  ````

---

## コンテンツ追加手順

1. `src/content/blog/` に `記事名.mdoc` を作成
2. フロントマターを記述（`title`, `description`, `publishDate` は必須）
3. `npm run build` でエラーがないか確認
4. コミット & プッシュ → GitHub Actions で自動デプロイ

---

## 注意事項

- `src/assets/` 以下の画像は Astro の `image()` で最適化される。フロントマターでパスを指定する際は `@assets/...` 形式を使う
- `public/` 以下のファイルはそのままコピーされる（最適化なし）
- `keystatic.config.ts` は Keystatic CMS の設定ファイル。現在は手動編集がメイン
- `backup/` は旧コンテンツのバックアップ。編集不要
