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
| `general` | `src/content/general/` | `.yaml` | セクション表示フラグ |
| `contact` | `src/content/contact/` | `.md` | icon, linkUrl, footerText |

### ルーティング

| URL | ファイル |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/blog/` | `src/pages/blog/index.astro` |
| `/blog/[slug]/` | `src/pages/blog/[...slug].astro` |
| `/projects/` | `src/pages/projects/index.astro` |
| `/projects/[slug]/` | `src/pages/projects/[...slug].astro` |
| `/404` | `src/pages/404.astro` |
| `/500` | `src/pages/500.astro` |

---

## コンテンツ仕様

### ブログ記事（.mdoc）

Markdoc 形式で記述する。フロントマタースキーマ：

```typescript
{
  title: string;          // 必須
  description: string;    // 必須（OGP description にも使用）
  publishDate: Date;      // 必須（YYYY-MM-DD）
  updatedDate?: Date;     // 省略可
  image?: ImageMetadata;  // サムネイル（省略可）
  tags?: string[];        // タグ（省略可）
}
```

#### コードブロックのルール

- `astro-expressive-code`（Shiki ベース）でハイライトされる
- **空のコードブロックは禁止**（ビルドエラーになる）
- サポート外の言語識別子はビルドエラー。`dataview` → `sql`、未知の言語 → `text` を使う
- Markdoc コードブロック内にさらに ```` ``` ```` を含める場合は外側を 4 バッククォートで囲む

#### 数式

`$...$`（インライン）、`$$...$$`（ブロック）で KaTeX レンダリングされる。

### プロジェクト（.md）

```typescript
{
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  updatedDate?: Date;
  skills: string[];
  featured?: boolean;     // トップページへの表示
  image?: ImageMetadata;
  demoLink?: string;
  sourceLink?: string;
}
```

---

## CI/CD

### GitHub Actions ワークフロー

`main` ブランチへのプッシュをトリガーに以下が実行される：

1. `npm ci` で依存関係インストール
2. `npm run build` でビルド
3. `dist/` を GitHub Pages にデプロイ

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

---

## 既知の制約

- `daisyUI` の `@property --radialprogress` に関する CSS 警告はビルド時に表示されるが、機能上の問題はない
- Keystatic CMS は現在ローカル編集のサポートのみ。管理画面: `localhost:4321/keystatic`
