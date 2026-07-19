# デザインシステム

このサイトの見た目と動きの一次リファレンス。配色トークンの定義は `src/styles/global.css`、運用ルールの要約は [AGENTS.md](../AGENTS.md) にもある。方向性は Apple の Human Interface / WWDC 由来のモーション・マテリアル原則を warm-editorial 配色に載せたもの。

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

## モーション

原則: **即時フィードバック・低刺激・reduced-motion で必ず代替**。

- **スクロール reveal**: セクションのコンテナに `data-reveal` を付けると、ビューポート進入時にフェード + 浮き上がり。仕組みは `Layout.astro` のインラインスクリプト(IntersectionObserver)+ `global.css`。JS 無効時・`prefers-reduced-motion` 時は最初から表示される。
- **押下フィードバック**: `.btn:active` で即時 `scale(0.97)`(pointer-down で反応、release 待ちにしない)。`-webkit-tap-highlight-color` は無効化済み。
- **ポップオーバーの origin**: `.dropdown-end .dropdown-content` は `transform-origin: top right`。メニューは開いたボタン側から出現させる。
- **Hero のストリーミング表示**: 自己紹介文を LLM 出力風に語単位で表示。日本語は `Intl.Segmenter`(word)でトークン化、非対応環境は空白区切りにフォールバック。reduced-motion では即時表示。

## タイポグラフィ

- 見出し(h1–h4)はマイナストラッキング(大きい文字ほど詰める)。h1–h3 は `text-wrap: balance`。
- **改行位置**: h1–h3・`.card-title`・`.phrase-wrap` に `word-break: auto-phrase`(Chromium のみの progressive enhancement。日本語を文節単位で折り返す)。単独テキストで変な位置の折り返しを防ぎたいときは `.phrase-wrap` を付ける。
- 段落は `text-wrap: pretty`(孤立行の抑制)。
- Hero の肩書きのように「 / 」区切りの並記は、区切り単位で `inline-block` の span に分割し、語中改行を構造的に防ぐ(`Hero.astro` 参照)。
- 本文フォントは BIZ UDPGothic、コードは JetBrains Mono。

## 角丸・レイアウト

- `--radius-field` 8px(ボタン・入力)/ `--radius-box` 16px(カード)。
- セクションの縦余白は `py-20 md:py-28` を基準に、余白で区切る(背景色の帯は使わない)。
- ナビバーは半透明ガラスチローム(`bg-base-100/60` + `backdrop-blur-xl`)。ボーダーは引かず、スクロール時に不透明度と shadow を少し上げる。ナビのボタン類は枠で囲わず ghost + 濃いめの文字色で示す。

## 変更時のチェック

- 色を変えたら `node tools/contrast.mjs` で WCAG AA を再検算。`OgPlaceholder.astro` のハードコード色も更新。
- UI 変更後は `npm run build` → `npm run audit:ui`、`npx playwright test tools/site-quality.spec.ts --project=desktop`。
