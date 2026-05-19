# プロジェクト仕様書

## 概要

Keitaro Ueki のポートフォリオサイト。Astro 5 ベースの静的サイトで、GitHub Pages にホストされる。

- **本番 URL**: <https://97kuek.github.io>
- **リポジトリ**: <https://github.com/97kuek/97kuek.github.io>

---

## アーキテクチャ

### 出力形式

`output: "static"` — すべてのページをビルド時に静的 HTML として生成する。

### コンテンツ管理

Astro Content Collections を使用。各コレクションは `src/content/` 以下のディレクトリに対応し、`src/content.config.ts` でスキーマを定義する。

| コレクション | パス | 形式 | 主なフィールド |
| --- | --- | --- | --- |
| `blog` | `src/content/blog/` | `.mdoc` | title, description, publishDate, tags |
| `projects` | `src/content/projects/` | `.md` | title, description, startDate, skills, featured |
| `work` | `src/content/work/` | `.md` | title, subtitle, startDate, endDate, logo |
| `education` | `src/content/education/` | `.md` | title, subtitle, startDate, endDate, logo |
| `hackathons` | `src/content/hackathons/` | `.md` | title, location, description, startDate, skills |
| `hero` | `src/content/hero/` | `.yaml` | name, title, description, avatar, socialLinks |
| `about` | `src/content/about/` | `.md` | title, photo |
| `general` | `src/content/general/` | `.yaml` | セクション表示フラグ、extraLinks |
| `contact` | `src/content/contact/` | `.md` | icon, linkUrl, footerText |

### ルーティング

| URL | ファイル |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/blog/` | `src/pages/blog/index.astro` |
| `/blog/[slug]/` | `src/pages/blog/[...slug].astro` |
| `/projects/` | `src/pages/projects/index.astro` |
| `/projects/[slug]/` | `src/pages/projects/[...slug].astro` |
| `/search/` | `src/pages/search.astro` |
| `/rss.xml` | `src/pages/rss.xml.ts` |
| `/sitemap-index.xml` | ビルド時に自動生成（`@astrojs/sitemap`） |
| `/og/blog/[slug].png` | `src/pages/og/blog/[slug].png.ts` |
| `/og/projects/[slug].png` | `src/pages/og/projects/[slug].png.ts` |
| `/404` | `src/pages/404.astro` |
| `/500` | `src/pages/500.astro` |

---

## コンテンツ仕様

### ブログ記事（.mdoc）

Markdoc 形式で記述する。フロントマタースキーマ：

```typescript
{
  title: string;          // 必須
  description: string;    // 必須（OGP description・検索スニペットにも使用）
  publishDate: Date;      // 必須（YYYY-MM-DD）
  updatedDate?: Date;     // 省略可
  image?: ImageMetadata;  // サムネイル（省略可）
  tags?: string[];        // タグ（省略可）
}
```

### プロジェクト（.md）

```typescript
{
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;         // 省略すると「進行中」と表示
  updatedDate?: Date;
  skills: string[];
  featured?: boolean;     // true のときトップページに表示
  image?: ImageMetadata;
  demoLink?: string;
  sourceLink?: string;
}
```

---

## ユーティリティ

### formatDate / formatPeriod（`src/utils/formatDate.ts`）

```typescript
import { formatDate, formatPeriod } from "../utils/formatDate";

formatDate(new Date())        // "2025年5月16日"
formatPeriod(start, end)      // "2024年4月 - 2025年3月"
formatPeriod(start)           // "2024年4月 - 現在"
```

新たに日付フォーマットが必要になった場合はこのファイルに追加する。各コンポーネントに独自定義しない。

> **例外**: `Hackathons.astro` は日付まで含む独自フォーマット（短期イベント向け）を持つ。これは意図的。

### iconMapper（`src/utils/iconMapper.ts`）

```typescript
import { getIcon } from "../utils/iconMapper";

const Icon = getIcon("GitHub"); // 存在しないアイコン名は Link にフォールバック
```

アイコン名は `src/utils/iconMapper.ts` の `IconName` 型を参照。`as any` キャストは不要。

---

## SEO

### サイトマップ

`@astrojs/sitemap` がビルド時に `dist/sitemap-index.xml` を自動生成する。`robots.txt` にサイトマップの URL を記載済み。

### JSON-LD 構造化データ

| ページ | スキーマ | 場所 |
| --- | --- | --- |
| トップページ | `Person` | `src/pages/index.astro` |
| ブログ記事 | `BlogPosting` | `src/layouts/BlogLayout.astro` |
| プロジェクト | `CreativeWork` | `src/layouts/ProjectLayout.astro` |

### 検索インデックス登録

Google Search Console にサイトを登録済み（所有権確認済み）。サイトマップ送信済み。

---

## CI/CD

### GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）

`main` ブランチへのプッシュをトリガーに以下が実行される：

1. `sudo apt-get install fonts-noto-cjk`（OGP 画像の日本語フォント）
2. `npm ci` で依存関係インストール
3. `npm run build`（= `astro build && pagefind --site dist`）
4. `dist/` を GitHub Pages にデプロイ

ビルドが失敗するとデプロイされない。

### ローカルでのビルド確認

コミット・プッシュ前に必ずローカルでビルドを確認すること：

```bash
npm run build
```

---

## 画像の扱い

- `src/assets/` 以下の画像は Astro の `image()` で WebP に最適化される
- フロントマターでの参照: `image: '@assets/blog/記事名/image.png'`
- `public/` 以下はそのままコピーされる（最適化なし）

### OGP 画像

- ブログ記事・プロジェクトともに `800×450px` の PNG を静的生成
- 生成ロジック: SVG テンプレート → `@resvg/resvg-js` で PNG 変換
- サムネイルがある場合はそちらを OGP 画像として使用する

---

## 既知の制約

- `daisyUI` の `@property --radialprogress` に関する CSS 警告はビルド時に表示されるが、機能上の問題はない
- Keystatic CMS は現在ローカル編集のサポートのみ。管理画面: `localhost:4321/keystatic`
- Pagefind 検索は本番ビルド後にのみ動作する（`npm run dev` では使用不可）
