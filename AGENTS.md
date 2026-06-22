# AGENTS.md

## プロジェクト概要

Keitaro Ueki のポートフォリオサイト。Astro 5 + Markdoc + TailwindCSS 4 + daisyUI 5 の静的サイト。GitHub Pages にホスト。

詳細仕様 → [docs/spec.md](docs/spec.md)

---

## コマンド

```bash
npm run dev      # 開発サーバー（localhost:4321）
npm run build    # 本番ビルド（Pagefind インデックス生成含む）
npm run preview  # ビルド結果プレビュー
npm run audit:ui # Playwright による代表画面の UI 監査（事前に npm run build）
```

依存関係のインストールは `npm install`。CI 相当の確認は `npm run build`。

---

## デザイン規則（必ず守る）

### 配色（パレット）

warm-editorial 配色。[docs/DESIGN.md](docs/DESIGN.md)（Claude.com のデザイン記述）に着想を得ているが、まるかぶりを避けるため値は独自にずらしている。定義は `src/styles/global.css` の `[data-theme="light"]` / `[data-theme="dark"]`。

- **デフォルトテーマはライト（cream）**。ダークは warm-ink の第2テーマ（`Layout.astro` で `localStorage` 優先、無ければ `light`）。
- **canvas = cream**（`base-100` ~#faf8f1）、**text = warm ink**（`base-content`）。純白・クールグレーは使わない。
- **役割分担**: **coral（primary）= ブランド/CTA・セクション見出し・`prose strong`・アバターのリング等**。**teal（secondary）= タグ・バッジ・リンク等インタラクティブ**（`prose a`・SkillBadge・BlogCard タグ・フィルタ選択タグ・検索結果リンク）。
- **amber（accent）** は稀なアクセント（FabFlower の FAB、DiagramNode）。3アクセントを乱用しない。
- **セマンティック色**（info=teal 系 / success / warning / error）は cream と両立するよう暖色寄りに調整済み（Box で使用）。
- **radius** は `--radius-field` 8px（ボタン・入力）/ `--radius-box` 12px（カード）のスクエア寄り。
- **コントラスト**: ライトの coral/teal は本文で WCAG AA(4.5:1) を満たす値にしてある（coral 4.87 / teal 4.65）。色を変える際は `node tools/contrast.mjs` で再検算する。
- ブランド記号として Anthropic の spike-mark（アスタリスク）や Copernicus セリフは**使わない**。識別性はターミナル/ストリーミング Hero のモチーフが担う。

### カード

shadow 禁止（フローティングボタン・ドロップダウン等の UI 要素は除く）。フラットカードが基本:

```html
class="card bg-base-100 border border-base-200 hover:border-primary/20 transition-colors duration-200"
```

### セクションヘッダー

pill バッジ・グラデーション下線禁止。統一パターン:

```html
<h2 class="text-base font-bold tracking-widest text-primary uppercase mb-3">SECTION NAME</h2>
<p class="text-base text-base-content/60">サブテキスト（任意）</p>
```

### カード全体のリンク化（2パターン）

- **`<a>` ラップ**: カード内リンクが1つの場合
- **stretched-link**: カード内に複数リンクがある場合（ProjectCard）。タイトル `<a>` に `after:absolute after:inset-0 after:content-['']`、card に `relative`、追加ボタンに `relative z-10`

### prose の strong / リンク

`strong` は `color: var(--color-primary)`（coral）のみ。背景ハイライト禁止。`prose a` は `var(--color-secondary)`（teal）。いずれも `global.css` 定義済み。

### 図解

ASCII アート・Mermaid 禁止。`DiagramFlow` + `DiagramNode` を使う → [docs/content-guide.md](docs/content-guide.md#図解の書き方)

---

## 重要な制約

- **配色トークン**は `src/styles/global.css` が一次定義（→ 上記「配色（パレット）」）。`src/components/OgPlaceholder.astro` は coral アクセント（`#cf7551`）と cream 背景を **ハードコード**しているので、パレット変更時は両方更新する
- **コードブロック**は空・未知の言語識別子でビルドエラー。不明な言語は `text` を使う
- **日付フォーマット**は必ず `src/utils/formatDate.ts` の関数を使う。各コンポーネントに独自定義しない
  - 例外: `Hackathons.astro` は日時まで含む独自フォーマット（短期イベント向け、意図的）
  - 例外: `ProjectLayout.astro` の `calculateDuration` は進行中案件も含む経過期間表示用（ロケール対応、意図的にローカル定義）
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

## AI エージェント向け運用

- Codex はこの `AGENTS.md` をプロジェクト指示として読む
- Claude Code は `CLAUDE.md` からこの `AGENTS.md` を参照する
- ルールを更新するときはこのファイルを一次情報として更新し、必要に応じて `README.md` や `docs/` も合わせて直す
- Claude Code 専用のカスタムコマンドは `.claude/commands/` 配下にある。Codex 用の恒久ルールはこのファイルに書く
- UI 変更時は Playwright MCP で `/`, `/projects/`, 代表的な記事ページ、`/search/`, `/en/` を desktop と mobile の両方で確認する
- UI 変更時は `npm run build` 後に `npm run audit:ui` も実行する
- Windows PowerShell で `npm` が実行ポリシーにより止まる場合は `npm.cmd` を使う

---

## ドキュメント

| ファイル | 内容 |
| --- | --- |
| [docs/spec.md](docs/spec.md) | アーキテクチャ・スキーマ・CI/CD・ユーティリティ・SEO |
| [docs/components.md](docs/components.md) | コンポーネント一覧・役割 |
| [docs/content-guide.md](docs/content-guide.md) | コンテンツ執筆ガイド・Markdoc タグ・図解の書き方 |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | ブランチ戦略・コミット規約 |
