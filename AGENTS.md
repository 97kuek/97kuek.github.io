# AGENTS.md

## プロジェクト概要

Keitaro Ueki のポートフォリオサイト。Astro 5 + Markdoc + TailwindCSS 4 + daisyUI 5 の静的サイトをCloudflare Pagesで配信し、Pages Functions + D1でフォームとコメントを処理する。

詳細仕様 → [docs/spec.md](docs/spec.md)

---

## コマンド

```bash
npm run dev      # Functions + ローカルD1を含む開発サーバー（localhost:8788）
npm run dev:astro # UIだけのAstro開発サーバー（localhost:4321）
npm run check    # Astro + Functionsの型チェック
npm run build    # 本番ビルド（Pagefind インデックス生成含む）
npm run preview  # ビルド結果プレビュー
npm run audit:ui # Playwright による代表画面の UI 監査（事前に npm run build）
```

依存関係のインストールは `npm install`。CI相当の確認は `npm run check && npm run build`。

---

## デザイン規則（必ず守る）

### 配色（パレット）

warm-editorial 配色。[docs/DESIGN.md](docs/DESIGN.md)（Claude.com のデザイン記述）に着想を得ているが、まるかぶりを避けるため値は独自にずらしている。定義は `src/styles/global.css` の `[data-theme="light"]`。

- **テーマはライト（cream）のみ**。ダークモードは意図的に廃止済み（テーマトグルも無い）。
- **canvas = cream**（`base-100` ~#faf8f1）、**text = warm ink**（`base-content`）。純白・クールグレーは使わない。
- **役割分担**: **coral（primary）= ブランド/CTA・セクション見出し・`prose strong`・アバターのリング・選択中タグ等**。**teal（secondary）= 本文リンク等の補助インタラクティブ**（`prose a`・検索結果リンク）。タグ・バッジは同系色の背景/文字を避け、ニュートラル背景＋本文色を基本にする。
- **amber（accent）** は稀なアクセント（DiagramNode など）。3アクセントを乱用しない。
- **セマンティック色**（info=teal 系 / success / warning / error）は cream と両立するよう暖色寄りに調整済み（Box で使用）。
- **radius** は `--radius-field` 8px（ボタン・入力）/ `--radius-box` 16px（カード。ガラスマテリアルに合わせ丸め）。
- **コントラスト**: ライトの coral/teal は本文で WCAG AA(4.5:1) を満たす値にしてある（coral 4.87 / teal 4.65）。色を変える際は `node tools/contrast.mjs` で再検算する。
- ブランド記号として Anthropic の spike-mark（アスタリスク）や Copernicus セリフは**使わない**。識別性は縦長ポートレート、抑制したサンセリフ見出し、ターミナル UI の組み合わせが担う。

### カード

すりガラス（Apple 風 glass）マテリアルが基本。`global.css` の `.glass-card`（半透明背景 + backdrop-blur + 上端ハイライト + ソフトシャドウ、`--glass-*` トークンで両テーマ定義）を使う。共通クラスは `src/utils/classes.ts` の `GLASS_CARD_CLASS`:

```html
class="card glass-card transition-all duration-300 hover:-translate-y-0.5"
```

- glass のソフトシャドウはマテリアルの一部として許可。それ以外の装飾的 shadow は引き続き禁止（フローティングボタン・ドロップダウン等の UI 要素は除く）
- メニュー・ポップオーバーは `.glass-popover`（ほぼ不透明の厚い素材）。透けすぎて読みにくい glass-card を流用しない
- `prefers-reduced-transparency` / `prefers-contrast` では不透明サーフェスにフォールバックする（`global.css` 定義済み）
- ホームの `<main>` には `.ambient-bg`（coral/teal/amber の淡い radial wash）を敷き、ガラスが拾う背景を作る

### モーション・タイポグラフィ

詳細 → [docs/design-system.md](docs/design-system.md)。要点:

- セクションのスクロール reveal は `data-reveal` を付けるだけ（`Layout.astro` + `global.css` が処理。reduced-motion / no-JS 安全）
- 本文・見出しはセルフホストした `Noto Sans JP Variable` を使う。巨大な見出しや、装飾目的の小さな英大文字ラベルは追加しない
- 日本語の改行は `word-break: auto-phrase`（h1–h3・`.card-title`・`.phrase-wrap`）で文節単位に。「 / 」並記は `inline-block` span に分割して語中改行を防ぐ（`Hero.astro` 参照）
- ナビのボタン類は枠・背景で囲わない（ghost + 濃いめ文字色）。ドロップダウンは `.glass-popover`

### セクションとヘッダー

- トップページの章は `components/layout/SectionShell.astro` を使い、幅・背景トーンをpropsで切り替える。個別に `max-w-*` / `py-*` を複製しない。
- 見出しは `SectionHeader.astro` を使う。簡潔なサンセリフ見出し＋補足文が統一パターン。
- 一覧・検索・記事ページの外枠は `components/layout/PageShell.astro` を使う。
- pill 見出し・グラデーション下線は禁止。

```astro
<SectionShell id="projects" width="wide" tone="wash">
  <SectionHeader label="Projects" subtitle="代表作" />
</SectionShell>
```

### 構造と依存関係

- 日英トップの編成は `components/HomePage.astro` に集約する。ルートページには編成ロジックを複製しない。
- ナビ項目と URL 生成は `src/config/navigation.ts` が一次定義。Navbar に配列やパス組み立てを直書きしない。
- ブラウザ処理は `src/scripts/` に分離し、コンポーネント内には import と data 属性だけを置く。複数ページ遷移で二重初期化されない設計にする。
- コンテンツとして変更される値は Content Collections に置く。外部画像サービスを UI 部品として依存させない。

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
  - 例外: `ProjectLayout.astro` の `calculateDuration` は進行中案件も含む経過期間表示用（ロケール対応、意図的にローカル定義）
- **画像パス**はフロントマターで `@assets/...` 形式を使う（`src/assets/` 以下）
- `public/` 以下はそのままコピーされる（最適化なし）
- お問い合わせとコメントは `functions/api/` のPages Functionsで処理しD1へ保存する。外部フォームサービスやGitHub Discussionsに依存させない
- D1スキーマ変更は既存ファイルを書き換えず、`migrations/` に連番で追加する
- `SPAM_SALT` は `.dev.vars` またはCloudflare secretで管理し、コミットしない

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
| [docs/design-system.md](docs/design-system.md) | マテリアル（glass）・モーション・タイポグラフィの一次リファレンス |
| [docs/components.md](docs/components.md) | コンポーネント一覧・役割 |
| [docs/content-guide.md](docs/content-guide.md) | コンテンツ執筆ガイド・Markdoc タグ・図解の書き方 |
| [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) | ブランチ戦略・コミット規約 |
