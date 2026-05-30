# プロジェクト仕様書

## 概要

Keitaro Ueki のポートフォリオサイト。Astro 5 ベースの静的サイトで、GitHub Pages にホストされる。

- **本番 URL**: <https://97kuek.github.io>
- **リポジトリ**: <https://github.com/97kuek/97kuek.github.io>

---

## アーキテクチャ

### 出力形式

`output: "static"` — すべてのページをビルド時に静的 HTML として生成する。

### 多言語（i18n）

Astro の `i18n` 機能を使用。`prefix-except-default` 戦略。

- `/` → 日本語（デフォルト、プレフィックスなし）
- `/en/` → 英語

UI 文字列は `src/i18n/ui.ts` に集約。コンポーネント内で `Astro.currentLocale` を参照してロケールを判定する。

### コンテンツ管理

Astro Content Collections を使用。各コレクションは `src/content/` 以下のディレクトリに対応し、`src/content.config.ts` でスキーマを定義する。

| コレクション | パス | 形式 | 主なフィールド |
| --- | --- | --- | --- |
| `blog` | `src/content/blog/` | `.mdoc` | title, description, publishDate, tags |
| `projects` | `src/content/projects/` | `.mdoc` | title, title_en, description, description_en, startDate, skills, featured |
| `work` | `src/content/work/` | `.md` | title, subtitle, startDate, endDate, logo, link, skills |
| `education` | `src/content/education/` | `.md` | title, subtitle, startDate, endDate, logo, link |
| `hackathons` | `src/content/hackathons/` | `.md` | title, location, description, startDate, skills |
| `hero` | `src/content/hero/` | `.yaml` | name, title, description, avatar, socialLinks |
| `about` | `src/content/about/` | `.md` | title, photo, link |
| `general` | `src/content/general/` | `.yaml` | セクション表示フラグ、extraLinks |
| `contact` | `src/content/contact/` | `.md` | icon, linkUrl, linkText, footerText |

#### 多言語コンテンツのファイル命名

- **シングルトン**（hero, about, contact）: `index.yaml`/`index.md`（日本語）、`en.yaml`/`en.md`（英語）
- **コレクション**（work, education）: `neoai.md`（日本語）、`neoai-en.md`（英語、`-en` サフィックス）
- **projects**: 単一ファイルに `title_en` / `description_en` フィールドを追加（ロケール切り替えはコンポーネント側）

### ルーティング

| URL | ファイル |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/en/` | `src/pages/en/index.astro` |
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

```typescript
{
  title: string;
  description: string;
  publishDate: Date;
  updatedDate?: Date;
  image?: ImageMetadata;
  tags?: string[];
}
```

### プロジェクト（.mdoc）

```typescript
{
  title: string;
  title_en?: string;        // 英語タイトル（省略可）
  description: string;
  description_en?: string;  // 英語説明文（省略可）
  startDate: Date;
  endDate?: Date;
  updatedDate?: Date;
  skills: string[];
  featured?: boolean;       // true のときトップページに表示
  image?: ImageMetadata;
  demoLink?: string;
  sourceLink?: string;
}
```

---

## ユーティリティ

### formatDate / formatPeriod / calculateDuration（`src/utils/formatDate.ts`）

```typescript
import { formatDate, formatPeriod, calculateDuration } from "../utils/formatDate";

formatDate(new Date())
// → "2025年5月16日"

formatPeriod(start, end)
// → "2024年4月 – 2025年3月"（日本語デフォルト）

formatPeriod(start, end, "en-US", "Present")
// → "Apr 2024 – Mar 2025"（英語）

calculateDuration(start, end, "ヶ月", "年")
// → "(11ヶ月)" または null（endDate なし）
```

新たに日付フォーマットが必要になった場合はこのファイルに追加する。各コンポーネントに独自定義しない。

> **例外**: `Hackathons.astro` は日時まで含む独自フォーマット（短期イベント向け、意図的）

### iconMapper（`src/utils/iconMapper.ts`）

```typescript
import { getIcon } from "../utils/iconMapper";
const Icon = getIcon("GitHub"); // 存在しないアイコン名は Link にフォールバック
```

---

## SEO

### サイトマップ

`@astrojs/sitemap` がビルド時に `dist/sitemap-index.xml` を自動生成する。

### JSON-LD 構造化データ

| ページ | スキーマ | 場所 |
| --- | --- | --- |
| トップページ（`/` および `/en/`） | `Person` | 各 `index.astro` |
| ブログ記事 | `BlogPosting` | `src/layouts/BlogLayout.astro` |
| プロジェクト | `CreativeWork` | `src/layouts/ProjectLayout.astro` |

### hreflang

`Layout.astro` がすべてのページに `/` と `/en/` の hreflang を出力する。

---

## CI/CD

### GitHub Actions ワークフロー（`.github/workflows/deploy.yml`）

`main` ブランチへのプッシュをトリガーに以下が実行される：

1. `sudo apt-get install fonts-noto-cjk`（OGP 画像の日本語フォント）
2. `npm ci` で依存関係インストール
3. `npm run build`（= `astro build && pagefind --site dist`）
4. `dist/` を GitHub Pages にデプロイ

---

## 画像の扱い

- `src/assets/` 以下の画像は Astro の `image()` で WebP に最適化される
- フロントマターでの参照: `image: '@assets/blog/記事名/image.png'`
- `public/` 以下はそのままコピーされる（最適化なし）

### OGP 画像

- ブログ記事・プロジェクトともに `800×450px` の PNG を静的生成
- 生成ロジック: SVG テンプレート → `@resvg/resvg-js` で PNG 変換

---

## 既知の制約

- daisyUI の `@property --radialprogress` に関する CSS 警告はビルド時に表示されるが、機能上の問題はない
- Pagefind 検索は本番ビルド後にのみ動作する（`npm run dev` では使用不可）
