# CLAUDE.md

## プロジェクト概要

Keitaro Ueki のポートフォリオサイト。Astro 5 + Markdoc + TailwindCSS 4 + daisyUI 5 の静的サイト。GitHub Pages にホスト。

詳細仕様 → [docs/spec.md](docs/spec.md)

---

## コマンド

```bash
npm run dev      # 開発サーバー（localhost:4321）
npm run build    # 本番ビルド（Pagefind インデックス生成含む）
npm run preview  # ビルド結果プレビュー
```

---

## デザイン規則（必ず守る）

### カード

shadow 禁止（フローティングボタン・ドロップダウン等の UI 要素は除く）。フラットカードが基本:

```html
class="card bg-base-100 border border-base-200 hover:border-primary/20 transition-colors duration-200"
```

### セクションヘッダー

pill バッジ・グラデーション下線禁止。統一パターン:

```html
<p class="text-sm font-bold tracking-widest text-primary uppercase mb-3">SECTION NAME</p>
<p class="text-base text-base-content/60">サブテキスト（任意）</p>
```

### カード全体のリンク化（2パターン）

- **`<a>` ラップ**: カード内リンクが1つの場合
- **stretched-link**: カード内に複数リンクがある場合（ProjectCard）。タイトル `<a>` に `after:absolute after:inset-0 after:content-['']`、card に `relative`、追加ボタンに `relative z-10`

### prose の strong

`color: var(--color-primary)` のみ。背景ハイライト禁止（`global.css` 定義済み）。

### 図解

ASCII アート・Mermaid 禁止。`DiagramFlow` + `DiagramNode` を使う → [docs/content-guide.md](docs/content-guide.md#図解の書き方)

---

## 重要な制約

- **Primary カラー**（`#4a5568`）は `src/styles/global.css` と `src/components/OgPlaceholder.astro` の両方に定義。変更時は両方更新する
- **コードブロック**は空・未知の言語識別子でビルドエラー。不明な言語は `text` を使う
- **日付フォーマット**は必ず `src/utils/formatDate.ts` の関数を使う。各コンポーネントに独自定義しない
  - 例外: `Hackathons.astro` は日時まで含む独自フォーマット（短期イベント向け、意図的）
  - 例外: `ProjectLayout.astro` の `calculateElapsed` はロケール非依存の日本語専用
- **画像パス**はフロントマターで `@assets/...` 形式を使う（`src/assets/` 以下）
- `public/` 以下はそのままコピーされる（最適化なし）
- `backup/` は旧コンテンツのバックアップ。編集不要

---

## 多言語（i18n）

- `/` → 日本語（デフォルト）、`/en/` → 英語
- UI 文字列は `src/i18n/ui.ts` の `useTranslations(locale)` で取得
- コンポーネント内では `Astro.currentLocale` でロケールを判定

### コンテンツファイルの命名規則

| コレクション種別 | 日本語ファイル | 英語ファイル |
| --- | --- | --- |
| シングルトン（hero, about, contact） | `index.yaml` / `index.md` | `en.yaml` / `en.md` |
| コレクション（work, education） | `neoai.md` | `neoai-en.md`（`-en` サフィックス） |
| projects | 共通ファイル + `title_en` / `description_en` フィールド | — |

---

## ドキュメント

| ファイル | 内容 |
| --- | --- |
| [docs/spec.md](docs/spec.md) | アーキテクチャ・スキーマ・CI/CD・ユーティリティ・SEO |
| [docs/components.md](docs/components.md) | コンポーネント一覧・役割 |
| [docs/content-guide.md](docs/content-guide.md) | コンテンツ執筆ガイド・Markdoc タグ・図解の書き方 |
| [docs/git-conventions.md](docs/git-conventions.md) | ブランチ戦略・コミット規約 |
