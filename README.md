# 97kuek's Portfolio

[![Deploy to GitHub Pages](https://github.com/97kuek/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/97kuek/my-portfolio/actions/workflows/deploy.yml)
[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![DaisyUI](https://img.shields.io/badge/DaisyUI-5.x-5A0EF8?logo=daisyui&logoColor=white)](https://daisyui.com)

🌐 **公開URL:** https://97kuek.github.io/my-portfolio/

[Bloomfolio](https://github.com/lauroguedes/bloomfolio) テンプレートをベースに作成したポートフォリオサイトです。

---

## 🛠️ 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| [Astro](https://astro.build) | 5.x | 静的サイトジェネレーター |
| [Tailwind CSS](https://tailwindcss.com) | 4.x | スタイリング |
| [DaisyUI](https://daisyui.com) | 5.x | UIコンポーネント |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | 型安全な開発 |
| [Markdoc](https://markdoc.dev/) | - | リッチなコンテンツ記述 |

---

## 🚀 ローカルでの開発

### 前提条件

- Node.js 18 以上
- Git

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/97kuek/my-portfolio.git
cd my-portfolio

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:4321 を開くとサイトが確認できます。

### よく使うコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:4321） |
| `npm run build` | 本番用ビルド（`dist/` に出力） |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run astro check` | TypeScript・Astroの型チェック |

> [!NOTE]
> `astro.config.mjs` でviteのプラグイン型に関するIDEエラーが表示されることがありますが、`@tailwindcss/vite` と Astro が内包するviteのバージョン差異によるものです。**ビルドには影響しません。**

---

## ✏️ コンテンツの編集方法

すべてのコンテンツは `src/content/` 以下のMarkdownファイルで管理します。  
編集後に `main` ブランチへプッシュすると、GitHub Actionsが自動でデプロイします。

### ディレクトリ構成

```
src/content/
├── hero/         # トップページのプロフィール情報（index.yaml）
├── about/        # 自己紹介文（index.md）
├── projects/     # ポートフォリオのプロジェクト（.md ファイル）
├── work/         # 職歴・インターン経験（.md ファイル）
├── education/    # 学歴（.md ファイル）
├── blog/         # ブログ記事（.md / .mdoc ファイル）
└── hackathons/   # ハッカソン参加歴（.md ファイル）
```

---

### プロフィール（Hero）を編集する

`src/content/hero/index.yaml` を編集します。

```yaml
name: 97kuek
title: Your Professional Title
description: Brief description
avatar: "./avatar.png"        # src/content/hero/ に画像を置く
location: "🇯🇵 Japan"
githubUrl: https://github.com/97kuek
linkedinUrl: https://linkedin.com/in/yourname   # 不要なら削除
```

---

### 自己紹介（About）を編集する

`src/content/about/index.md` の本文を編集します。

```markdown
---
title: "About Me"
photo: "./photo.png"    # src/content/about/ に画像を置く
---

ここに自己紹介文を書く（Markdownが使えます）。
```

---

### プロジェクトを追加する

`src/content/projects/` に `.md` ファイルを作成します。

```markdown
---
featured: true              # true にするとトップページに最大3件表示される
title: "プロジェクト名"
description: "概要"
image: "./screenshot.png"   # スクリーンショット画像
startDate: "2024-04-01"
endDate: "2024-08-31"       # 継続中の場合は省略
skills: ["Python", "React", "PostgreSQL"]
demoLink: "https://demo.example.com"             # 任意
sourceLink: "https://github.com/97kuek/project"  # 任意
---

プロジェクトの詳細説明をここに書く。
```

---

### 職歴を追加する

`src/content/work/` に `.md` ファイルを作成します。

```markdown
---
title: "会社名"
subtitle: "役職 / インターン"
location: "東京, 日本"
startDate: "2024-04-01"
endDate: "2024-09-30"    # 現在も継続中なら省略
logo: "https://company.com/logo.png"  # 任意
link: "https://company.com"           # 任意
skills: ["TypeScript", "AWS"]         # 任意
---

業務内容・実績を書く。
```

---

### 学歴を追加する

`src/content/education/` に `.md` ファイルを作成します。

```markdown
---
title: "大学名"
subtitle: "学部 / 学科"
startDate: "2022-04-01"
endDate: "2026-03-31"
logo: "https://university.ac.jp/logo.png"  # 任意
link: "https://university.ac.jp"           # 任意
---

授業や研究内容などを書く。
```

---

### ブログ記事を書く

`src/content/blog/` に `.md` または `.mdoc` ファイルを作成します。

```markdown
---
title: "記事タイトル"
description: "概要（SEO用）"
image: "./cover.png"
publishDate: "2025-01-01"
tags: ["Astro", "ポートフォリオ"]
---

記事本文をここに書く。
```

> [!TIP]
> Spotify・YouTube・Twitterを埋め込みたい場合は `.mdoc` 拡張子にして以下の記法を使います：
> ```
> {% Spotify url="https://open.spotify.com/track/..." /%}
> {% YouTube url="https://youtube.com/watch?v=..." /%}
> ```

---

### テーマを変更する

`src/content/general/index.yaml` で利用テーマを切り替えられます。

利用可能なテーマ: `light` / `dark` / `synthwave` / `retro` / `valentine` / `dim`

---

## 📦 デプロイの仕組み

`main` ブランチへのプッシュをトリガーに、**GitHub Actions** が自動でビルド・デプロイを行います。

```
push to main
   ↓
.github/workflows/deploy.yml が起動
   ↓
npm install → npm run build → dist/ を GitHub Pages へアップロード
   ↓
https://97kuek.github.io/my-portfolio/ に反映（約1分）
```

Actions の実行状況は [こちら](https://github.com/97kuek/my-portfolio/actions) で確認できます。

---

## 📁 プロジェクト構成（抜粋）

```
my-portfolio/
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages 自動デプロイ設定
├── public/                 # 静的ファイル（favicon等）
├── src/
│   ├── assets/             # 画像・メディア
│   ├── components/         # Astroコンポーネント
│   ├── content/            # コンテンツ（ここを主に編集する）
│   ├── layouts/            # レイアウトテンプレート
│   ├── pages/              # ページ（ルーティング）
│   └── styles/             # グローバルCSS
├── astro.config.mjs        # Astro設定（site/base設定済み）
└── package.json
```

---

## 🔧 テンプレートからの変更点

元の [Bloomfolio](https://github.com/lauroguedes/bloomfolio) テンプレートから以下の変更を加えています：

| ファイル | 変更内容 |
|---------|---------|
| `astro.config.mjs` | `site`・`base` を GitHub Pages 用に設定、`output: "static"` に変更、Vercel adapter・Keystatic を削除 |
| `src/pages/blog/[...slug].astro` | 静的ビルド用に `getStaticPaths()` を追加 |
| `src/pages/projects/[...slug].astro` | 静的ビルド用に `getStaticPaths()` を追加 |
| `.github/workflows/deploy.yml` | GitHub Pages 自動デプロイワークフローを新規作成 |

---

## 📄 ライセンス

テンプレート部分は [MIT License](LICENSE)（© Lauro Guedes）。  
コンテンツ（文章・画像等）は 97kuek が著作権を保有します。
