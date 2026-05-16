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

### 基本方針

**ASCII アートで図解しない。** 代わりに `DiagramFlow` + `DiagramNode` の Markdoc タグを使う。
HTML+CSS で描画するため、サイトのテーマカラーと一貫したデザインになる。

### DiagramFlow — フロー図のコンテナ

| 属性        | 型                    | 既定値  | 説明                   |
| ----------- | --------------------- | ------- | ---------------------- |
| `direction` | `"row"` / `"col"`     | `"row"` | ノードの並び方向       |
| `title`     | `string`              | —       | 図のキャプション       |

### DiagramNode — 個々のノード（ボックス）

| 属性       | 型       | 既定値 | 説明                         |
| ---------- | -------- | ------ | ---------------------------- |
| `label`    | `string` | 必須   | ノードのメインラベル         |
| `sublabel` | `string` | —      | 補足テキスト（薄字で表示）   |
| `color`    | `string` | —      | カラースキーム（下記参照）   |

`color` に指定できる値: `primary` / `secondary` / `accent` / `success` / `warning` / `error`

### 使用例

#### 水平フロー（デフォルト）

```markdoc
{% DiagramFlow title="認証フロー" %}
  {% DiagramNode label="クライアント" color="primary" %}{% /DiagramNode %}
  {% DiagramNode label="サーバー" sublabel="JWT 検証" color="secondary" %}{% /DiagramNode %}
  {% DiagramNode label="DB" color="accent" %}{% /DiagramNode %}
{% /DiagramFlow %}
```

#### 垂直フロー

```markdoc
{% DiagramFlow direction="col" title="ビルドパイプライン" %}
  {% DiagramNode label="ソースコード" %}{% /DiagramNode %}
  {% DiagramNode label="Astro Build" color="primary" %}{% /DiagramNode %}
  {% DiagramNode label="GitHub Pages" color="success" %}{% /DiagramNode %}
{% /DiagramFlow %}
```

ノード間の矢印（→ / ↓）は CSS で自動挿入されるため、明示的に記述不要。

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

## コンテンツ追加手順

1. `src/content/blog/` に `記事名.mdoc` を作成
2. フロントマターを記述（`title`, `description`, `publishDate` は必須）
3. `npm run build` でエラーがないか確認
4. コミット & プッシュ → GitHub Actions で自動デプロイ

---

## デザイン方針

### カード

`shadow-xl` は使わない。代わりに `border border-base-200 shadow-sm` を基本とし、ホバー時のみ `hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5` を付ける。重さを抑えてミニマルに。

### セクションヘッダー

pill バッジ・グラデーション下線は使わない。各セクションの見出しは以下のパターンに統一する。

```html
<p class="text-xs font-bold tracking-widest text-primary uppercase mb-3">SECTION NAME</p>
<p class="text-base text-base-content/60">サブテキスト（任意）</p>
```

### カード全体のリンク化

一覧ページのカードは `<article>` を `<a class="block group">` で囲んでカード全体をクリック可能にする。個別の「詳細を見る」ボタンは冗長なので置かない。`data-filter-tags` は `<a>` 側に移す（FilterSection の JS は `querySelectorAll('[data-filter-tags]')` で動作するため問題なし）。

---

## 注意事項

- `src/assets/` 以下の画像は Astro の `image()` で最適化される。フロントマターでパスを指定する際は `@assets/...` 形式を使う
- `public/` 以下のファイルはそのままコピーされる（最適化なし）
- `keystatic.config.ts` は Keystatic CMS の設定ファイル。現在は手動編集がメイン
- `backup/` は旧コンテンツのバックアップ。編集不要
- Primary カラー（indigo-700 相当）は `src/styles/global.css` と `src/components/OgPlaceholder.astro` の両方に定義されているため、変更時は両方更新する
