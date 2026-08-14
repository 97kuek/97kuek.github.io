# プロジェクト仕様書

## 概要

Keitaro Ueki のポートフォリオサイト。Astro 5で静的HTMLを生成しCloudflare Pagesへ配信する。問い合わせとコメントはPages Functions + D1で処理する。

- **本番 URL**: <https://97kuek.pages.dev>
- **リポジトリ**: <https://github.com/97kuek/97kuek.github.io>

---

## アーキテクチャ

### 出力形式

`output: "static"` — すべてのページをビルド時に静的 HTML として生成する。
動的処理だけをリポジトリ直下の `functions/` に分離し、静的UIをCloudflare固有APIへ結合しない。

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
| `projects` | `src/content/projects/` | `.mdoc` | title, title_en, description, description_en, role, impact, status, startDate, skills, featured |
| `work` | `src/content/work/` | `.md` | title, subtitle, startDate, endDate, logo, link, skills |
| `education` | `src/content/education/` | `.md` | title, subtitle, startDate, endDate, logo, link |
| `hero` | `src/content/hero/` | `.yaml` | name, title, description, avatar, socialLinks |
| `about` | `src/content/about/` | `.md` | title, photo, link, skills |
| `general` | `src/content/general/` | `.yaml` | トップページのセクション表示フラグ |
| `contact` | `src/content/contact/` | `.md` | icon, linkUrl, footerText |

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
  role?: string;
  role_en?: string;
  impact?: string;
  impact_en?: string;
  status?: string;
  status_en?: string;
  featured?: boolean;       // true のときトップページに表示
  image?: ImageMetadata;
  demoLink?: string;
  sourceLink?: string;
}
```

---

## ユーティリティ

### Zenn / Qiita / note 連携

`src/utils/externalArticles.ts` がビルド時に Zenn / Qiita / note の公開記事を取得し、ホームの Blog セクション、`/blog/`、RSS に外部記事として混在させる。

- デフォルトユーザー名は `src/utils/site.ts` の `zennUsername` / `qiitaUsername` / `noteUsername`（未設定時は取得しない）
- `ZENN_USERNAME` / `QIITA_USERNAME` / `NOTE_USERNAME` 環境変数で上書き可能
- 取得失敗時はビルドを落とさず、ローカル記事のみで継続する

### Pages Functions / D1

| Endpoint | Method | 役割 |
| --- | --- | --- |
| `/api/contact` | `POST` | 問い合わせを検証して `contact_messages` へ保存。任意でWebhook通知 |
| `/api/comments?page=/blog/.../` | `GET` | 指定記事の `approved` コメントだけを返す |
| `/api/comments` | `POST` | 新規コメントを `pending` として保存 |

共通処理は `functions/_lib/` に集約する。POSTは同一origin、honeypot、送信所要時間、文字数、ハッシュ化したクライアント識別子によるレート制限を検証する。生のIPアドレスは保存しない。

- `DB`: D1 binding。スキーマは `migrations/` で管理
- `SPAM_SALT`: クライアント識別子の不可逆化に必須
- `CONTACT_WEBHOOK_URL`: 問い合わせ通知先。未設定でもD1保存は行う
- コメント公開: `comments.status` を `pending` から `approved` に更新

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

### iconMapper（`src/utils/iconMapper.ts`）

```typescript
import { getIcon } from "../utils/iconMapper";
const Icon = getIcon("GitHub"); // 存在しないアイコン名は Link にフォールバック
```

### UI 構成とブラウザ処理

- `src/components/HomePage.astro`: 日英トップの共通編成。ルートは locale だけを渡す。
- `src/config/navigation.ts`: ナビ項目、ホーム URL、セクション／一覧 URL の一次定義。
- `src/components/layout/`: ページ幅と章余白を提供するレイアウト原語。
- `src/scripts/navbar.ts`: 固定ナビのスクロール状態と現在章。
- `src/scripts/reveal.ts`: `data-reveal` の IntersectionObserver 初期化と遷移時 cleanup。
- `src/scripts/pagefind.ts`: Pagefind UI の遅延読込、二重 mount 防止、開発時フォールバック。

---

## SEO

### サイトマップ

`@astrojs/sitemap` がビルド時に `dist/sitemap-index.xml` を自動生成する。

### JSON-LD 構造化データ

| ページ | スキーマ | 場所 |
| --- | --- | --- |
| トップページ（`/` および `/en/`） | `Person` | `src/components/HomePage.astro` |
| ブログ記事 | `BlogPosting` | `src/layouts/BlogLayout.astro` |
| プロジェクト | `CreativeWork` | `src/layouts/ProjectLayout.astro` |

### hreflang

`Layout.astro` がすべてのページに `/` と `/en/` の hreflang を出力する。

---

## Cloudflare Pages運用

`wrangler.jsonc` がPages出力先とD1 bindingの一次設定。静的ファイルとFunctionsを同じデプロイ単位で扱う。
`main` へのpushではGitHub Actionsが品質監査後に `dist/` をデプロイする。デプロイは
`CLOUDFLARE_PAGES_DEPLOY_ENABLED=true` のときだけ実行し、認証情報はGitHub Actions secretsで管理する。

```bash
npm run dev                # build → local migration → Pages dev（localhost:8788）
npm run db:migrate:remote  # 本番D1へ未適用migrationを反映
npm run deploy:cloudflare  # build → distをPagesへ直接デプロイ
```

本番反映前に `npm run check && npm run build`、反映後に代表ページとAPIの疎通を確認する。カスタムドメイン利用時はビルド環境の `SITE_URL` をそのoriginへ設定する。

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
- `npm run dev:astro` ではPages FunctionsとD1を利用できない。APIを含めた確認は `npm run dev` を使う
