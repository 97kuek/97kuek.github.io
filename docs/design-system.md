# デザインシステム

このサイトの見た目と動きの一次リファレンス。配色トークンとレイアウト原語の定義は `src/styles/global.css`、運用ルールの要約は [AGENTS.md](../AGENTS.md) にもある。方向性はwarm-editorial配色を土台に、ポートレート、抑制した見出し、広い余白で構成するminimal editorial portfolio。

## テーマ

- **ライト(warm cream)のみ**。ダークモードは意図的に廃止済み(テーマトグルも存在しない)。
- canvas は cream(`base-100` ~#faf8f1)、テキストは warm ink。純白・クールグレーは使わない。
- coral(primary)= ブランド/CTA・セクション見出し、teal(secondary)= 本文リンク、amber(accent)= 稀なアクセント。

## マテリアル(すりガラス)

Apple 風の半透明マテリアル。トークンは `global.css` の `--glass-*`(light テーマ内)。

| クラス | 用途 | 特徴 |
| --- | --- | --- |
| `.glass-card` | 通常のカード(プロジェクト・ブログ・職歴など) | `base-100` 62% + blur(20px) + 上端ハイライト + ソフトシャドウ |
| `.glass-popover` | メニュー・ポップオーバー(ナビのドロップダウン等) | `base-100` 92% とほぼ不透明。浮遊面ほど厚い素材にする |

- 共通クラスは `src/utils/classes.ts` の `GLASS_CARD_CLASS`(hover で 2px 浮く)。
- ガラスが透かす背景として、ホームの `<main>` に `.ambient-bg`(coral/teal/amber の淡い radial wash)を敷く。
- glass のソフトシャドウはマテリアルの一部として許可。それ以外の装飾的 shadow は禁止(ドロップダウン等の UI 要素は除く)。
- フォールバック: `prefers-reduced-transparency` で不透明化、`prefers-contrast: more` で実線ボーダー。定義済みなので個別対応は不要。

## ページ原語

| 原語 | 実装 | 用途 |
| --- | --- | --- |
| `.site-container` | `layout/SectionShell.astro`, `layout/PageShell.astro` | reading / content / wide の3段階の最大幅と共通 gutter |
| `.home-section` | `layout/SectionShell.astro` | 章単位の縦余白、境界線、スクロール位置 |
| `.section-heading` | `SectionHeader.astro` | 見出し・補足文 |
| `.page-shell` | `layout/PageShell.astro` | 一覧・検索・記事ページの共通外枠 |
| `.page-heading` | `PageHeader.astro` | 一覧ページの大見出し |

- トップは1画面に無理に内容を収めず、`min-height` と十分な余白で章として見せる。
- デスクトップは画像と本文、見出しと補足を分割し、モバイルは1カラムへ落とす。
- ページ固有の `max-w-*` と `py-*` の組み合わせを増やさず、幅と tone を props で選ぶ。

## モーション

原則: **即時フィードバック・低刺激・reduced-motion で必ず代替**。

- **スクロール reveal**: セクションのコンテナに `data-reveal` を付けると、ビューポート進入時にフェード + 浮き上がり。仕組みは `Layout.astro` のインラインスクリプト(IntersectionObserver)+ `global.css`。JS 無効時・`prefers-reduced-motion` 時は最初から表示される。
- **押下フィードバック**: `.btn:active` で即時 `scale(0.97)`(pointer-down で反応、release 待ちにしない)。`-webkit-tap-highlight-color` は無効化済み。
- **ポップオーバーの origin**: `.dropdown-end .dropdown-content` は `transform-origin: top right`。メニューは開いたボタン側から出現させる。
- **Hero**: JavaScript 演出を持たない。縦長ポートレートと本文を静的に描画し、初期表示と保守性を優先する。

## タイポグラフィ

- 本文と見出しはセルフホストした可変フォント `Noto Sans JP Variable` を使う。コードだけJetBrains Mono系を使う。
- 見出し(h1–h4)は控えめなマイナストラッキング。h1–h3 は `text-wrap: balance`。
- 装飾目的の小さな英大文字ラベルや章番号を置かない。補助情報が必要なら通常の文として読めるサイズと表記にする。
- **改行位置**: h1–h3・`.card-title`・`.phrase-wrap` に `word-break: auto-phrase`(Chromium のみの progressive enhancement。日本語を文節単位で折り返す)。単独テキストで変な位置の折り返しを防ぎたいときは `.phrase-wrap` を付ける。
- 段落は `text-wrap: pretty`(孤立行の抑制)。
- Hero の肩書きのように「 / 」区切りの並記は、区切り単位で span に分割し、語中改行を構造的に防ぐ(`Hero.astro` 参照)。

## 角丸・レイアウト

- `--radius-field` 8px(ボタン・入力)/ `--radius-box` 16px(カード)。
- セクションの縦余白は `--section-space`、ページ幅は `--site-width-*`、gutter は `--site-gutter` を使う。
- ナビバーは半透明の固定ヘッダー。スクロール時のみ下境界線を表示し、現在章を coral の2pxラインで示す。

## 変更時のチェック

- 色を変えたら `node tools/contrast.mjs` で WCAG AA を再検算。`OgPlaceholder.astro` のハードコード色も更新。
- UI 変更後は `npm run build` → `npm run audit:ui`、`npx playwright test tools/site-quality.spec.ts --project=desktop`。
