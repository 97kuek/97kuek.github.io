# CLAUDE.md

## プロジェクト概要

Keitaro Ueki のポートフォリオサイト。Astro + Markdoc ベースの静的サイトで GitHub Pages にホストされている。

| 項目             | 詳細                                           |
| ---------------- | ---------------------------------------------- |
| URL              | <https://97kuek.github.io>                     |
| フレームワーク   | Astro 5（静的出力）                            |
| コンテンツ形式   | Markdoc (`.mdoc`) / Markdown (`.md`) / YAML    |
| スタイル         | TailwindCSS 4 + daisyUI 5                      |
| コードハイライト | astro-expressive-code（Shiki ベース）          |

---

## ディレクトリ構成

```text
src/
├── content/          ← コンテンツ（Astro Content Collections）
│   ├── blog/         ← ブログ記事（.mdoc）
│   ├── projects/     ← プロジェクト（.md）
│   ├── work/         ← 職務経歴（.md）
│   ├── education/    ← 学歴（.md）
│   ├── hackathons/   ← ハッカソン（.md）
│   ├── hero/         ← ヒーロー情報（.yaml）
│   ├── about/        ← 自己紹介（.md）
│   ├── general/      ← サイト全体設定（.yaml）
│   └── contact/      ← 連絡先（.md）
├── components/       ← Astro コンポーネント（後述）
├── layouts/          ← ページレイアウト
│   ├── Layout.astro      ← 全ページ共通（head/OGP/Navbar）
│   ├── BlogLayout.astro  ← ブログ記事ページ
│   └── ProjectLayout.astro ← プロジェクト詳細ページ
├── pages/            ← ルーティング
│   ├── index.astro       ← トップページ
│   ├── blog/             ← /blog 一覧・記事詳細
│   ├── projects/         ← /projects 一覧・詳細
│   └── og/               ← OGP 画像生成エンドポイント（静的 PNG）
│       ├── blog/[slug].png.ts
│       └── projects/[slug].png.ts
├── utils/
│   ├── formatDate.ts ← 共通日付フォーマット（formatDate / formatPeriod）
│   └── iconMapper.ts ← アイコン名→コンポーネントのマッピング
├── assets/           ← 画像アセット（Astro の image() で最適化）
└── styles/global.css ← TailwindCSS + daisyUI テーマ設定
```

---

## よく使うコマンド

```bash
npm run dev      # 開発サーバー起動（localhost:4321）
npm run build    # 本番ビルド
npm run preview  # ビルド結果のプレビュー
```

---

## コンポーネント一覧

| コンポーネント | 役割 |
| --- | --- |
| `Hero.astro` | トップページのヒーローセクション |
| `About.astro` | 自己紹介セクション |
| `Projects.astro` | トップページのプロジェクト一覧（featured のみ） |
| `Blog.astro` | トップページのブログ一覧（最新3件） |
| `Timeline.astro` | 職務経歴・学歴タイムライン |
| `Hackathons.astro` | ハッカソン一覧 |
| `Contact.astro` | フッターの連絡先 |
| `Navbar.astro` | 固定ヘッダー（スクロールで shadow 強化） |
| `BlogCard.astro` | ブログ記事カード（カード全体がリンク） |
| `ProjectCard.astro` | プロジェクトカード（stretched-link） |
| `OgPlaceholder.astro` | 画像なし記事の SVG プレースホルダー |
| `TableOfContents.astro` | 目次（mobile: 折りたたみ / desktop: サイドバー） |
| `ReadingProgress.astro` | 記事読了プログレスバー（固定、primary カラー） |
| `PrevNextNav.astro` | 前後記事ナビゲーション |
| `RelatedContent.astro` | 関連コンテンツ（タグ一致） |
| `FilterSection.astro` | タグフィルター（AND 絞り込み、URL 同期） |
| `Giscus.astro` | GitHub Discussions コメント欄 |
| `BackToTop.astro` | トップへ戻るボタン |
| `FabFlower.astro` | デスクトップ用フローティングメニュー |
| `Dock.astro` | モバイル用ドック型ナビ |
| `ImageLightbox.astro` | 画像クリックで拡大表示 |
| `DiagramFlow.astro` | フロー図コンテナ（Markdoc タグ） |
| `DiagramNode.astro` | フロー図ノード（Markdoc タグ） |
| `SkillBadge.astro` | スキル・タグのバッジ |

---

## デザイン方針

### カード

shadow は使わない。フラットカードが基本スタイル:

```html
class="card bg-base-100 border border-base-200 hover:border-primary/20 transition-colors duration-200"
```

### セクションヘッダー

pill バッジ・グラデーション下線は使わない。統一パターン:

```html
<p class="text-xs font-bold tracking-widest text-primary uppercase mb-3">SECTION NAME</p>
<p class="text-base text-base-content/60">サブテキスト（任意）</p>
```

### カード全体のリンク化

一覧ページのカードは2通り:

- **`<a>` ラップ**: `<a class="block group" data-filter-tags="..."><article ...>`
  → フィルターは `data-filter-tags` を `<a>` に移す
- **stretched-link**: タイトル `<a>` に `after:absolute after:inset-0 after:content-['']`、article に `relative`、Demo/Source ボタンに `relative z-10`
  → カード内に複数のリンク先がある場合（ProjectCard）に使う

### prose の strong

`.prose strong` は `color: var(--color-primary)` のみ。背景ハイライトは使わない（`global.css` で定義済み）。

### OGP 画像

- ブログ記事: `/og/blog/[slug].png` で自動生成（800×450px）
- プロジェクト: `/og/projects/[slug].png` で自動生成（800×450px）
- 生成ロジック: SVG → `@resvg/resvg-js` で PNG に変換
- CI では `fonts-noto-cjk` をインストール済み（日本語フォント対応）
- BlogLayout と ProjectLayout は `ogImageWidth={800} ogImageHeight={450}` を Layout に渡す

---

## コンテンツの書き方

### ブログ記事（src/content/blog/*.mdoc）

フロントマターの必須フィールドは `title`、`description`、`publishDate` の 3 つ。

```yaml
---
title: "記事タイトル"
description: "説明文（OGP にも使われる）"
publishDate: "YYYY-MM-DD"
tags: ["tag1", "tag2"]
image: "@assets/blog/記事名/thumbnail.png"  # 省略可
---
```

### コードブロックの注意点

- `astro-expressive-code` を使用しているため、**コードブロックに空の内容は不可**
- サポートされていない言語指定はビルドエラーになる（例: `dataview` → `sql` を使う）
- Markdoc コードブロック内にさらに ` ``` ` を含める場合は、**外側を 4 バッククォートで囲む**

  ````markdown
  内容（内部の ``` はそのまま使える）
  ````

---

## 図解の書き方

**ASCII アートで図解しない。** 代わりに `DiagramFlow` + `DiagramNode` の Markdoc タグを使う。

### DiagramFlow

| 属性        | 型                | 既定値  | 説明             |
| ----------- | ----------------- | ------- | ---------------- |
| `direction` | `"row"` / `"col"` | `"row"` | ノードの並び方向 |
| `title`     | `string`          | —       | 図のキャプション |

### DiagramNode

| 属性 | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `label` | `string` | 必須 | ノードのメインラベル |
| `sublabel` | `string` | — | 補足テキスト（薄字） |
| `color` | `string` | — | `primary` / `secondary` / `accent` / `success` / `warning` / `error` |

```markdoc
{% DiagramFlow title="認証フロー" %}
  {% DiagramNode label="クライアント" color="primary" %}{% /DiagramNode %}
  {% DiagramNode label="サーバー" sublabel="JWT 検証" color="secondary" %}{% /DiagramNode %}
  {% DiagramNode label="DB" color="accent" %}{% /DiagramNode %}
{% /DiagramFlow %}
```

---

## Markdoc カスタムタグ一覧

| タグ | 用途 |
| --- | --- |
| `{% Box color="..." title="..." %}` | 情報・警告・成功・エラーの強調ボックス |
| `{% DiagramFlow %}` | フロー図コンテナ |
| `{% DiagramNode label="..." %}` | フロー図のノード |
| `{% LinkCard url="..." %}` | ブログ内リンクカード |
| `{% Math %}` | TeX 数式（ブロック） |
| `{% InlineMath %}` | TeX 数式（インライン） |
| `{% YouTube id="..." %}` | YouTube 埋め込み |
| `{% Spotify url="..." %}` | Spotify 埋め込み |
| `{% Twitter url="..." %}` | ツイート埋め込み |

---

## ユーティリティ

### formatDate / formatPeriod

```typescript
import { formatDate, formatPeriod } from "../utils/formatDate";

formatDate(new Date())          // "2025年5月16日"
formatPeriod(start, end)        // "2024年4月 - 2025年3月"
formatPeriod(start)             // "2024年4月 - 現在"
```

新たに日付フォーマットが必要になった場合は **このファイルに追加する**。各コンポーネントに独自定義しない。

> **例外**: `Hackathons.astro` は日付まで含む独自フォーマット（短期イベント向け）を持つ。これは意図的な例外。

### iconMapper

```typescript
import { getIcon } from "../utils/iconMapper";

const Icon = getIcon("GitHub"); // 存在しないアイコン名はLink（デフォルト）にフォールバック
// as any キャストは不要。getIcon は string を受け付ける
```

アイコン名は `src/utils/iconMapper.ts` の `IconName` 型を参照。

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
- Primary カラー（slate 系ニュートラル、#4a5568 相当）は `src/styles/global.css` と `src/components/OgPlaceholder.astro` の両方に定義されているため、変更時は両方更新する
