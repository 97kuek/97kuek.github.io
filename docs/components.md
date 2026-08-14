# コンポーネント一覧

`src/components/` 以下の Astro コンポーネント。

## レイアウト

| ファイル | 役割 |
| --- | --- |
| `layouts/Layout.astro` | 全ページ共通（head・OGP・JSON-LD・hreflang・Navbar）。`data-reveal` 要素のスクロール reveal もここで初期化 |
| `layouts/BlogLayout.astro` | ブログ記事ページ（TOC・読了時間・前後ナビ・関連記事） |
| `layouts/ProjectLayout.astro` | プロジェクト詳細ページ（期間・スキル・前後ナビ） |
| `components/HomePage.astro` | 日英トップ共通のページ編成・コンテンツ取得・Person JSON-LD |
| `components/layout/SectionShell.astro` | トップページ章の共通外枠（幅・tone） |
| `components/layout/PageShell.astro` | 一覧・検索・記事ページの共通外枠 |

## セクション（トップページ）

| コンポーネント | 役割 |
| --- | --- |
| `Hero.astro` | 縦長ポートレート、名前、肩書き、CTA、SNS を左右分割した静的 Hero。モバイルは1カラム |
| `About.astro` | 自己紹介セクション。スキルは Content Collection の配列から共通 chip で描画 |
| `Projects.astro` | プロジェクト一覧（`featured: true` のみ） |
| `Blog.astro` | ブログ一覧（最新3件。自サイト/Zenn/Qiita/note 記事を同じカード体系で表示） |
| `Timeline.astro` | 職務経歴・学歴タイムライン（`collection` prop で切り替え、コンテンツをカード内に直接表示） |
| `Contact.astro` | `/api/contact`へ送信する問い合わせフォームとメールリンク |

## ナビゲーション

| コンポーネント | 役割 |
| --- | --- |
| `Navbar.astro` | 固定ヘッダー（章ナビ・JA/EN・検索・モバイルメニュー）。項目と URL は `config/navigation.ts`、動作は `scripts/navbar.ts` |
| `BackToTop.astro` | トップへ戻るボタン（長押しで目次ポップアップ） |
| `PrevNextNav.astro` | 前後記事ナビゲーション |

## 記事ページ

| コンポーネント | 役割 |
| --- | --- |
| `TableOfContents.astro` | 目次（mobile: 折りたたみ / desktop: sticky サイドバー） |
| `ReadingProgress.astro` | 読了プログレスバー（固定、primary カラー） |
| `RelatedContent.astro` | 関連コンテンツ（タグ一致スコアで選出） |
| `Comments.astro` | 承認済みコメントの取得と、承認待ちコメントの送信欄 |

## カード・UI

| コンポーネント | 役割 |
| --- | --- |
| `BlogCard.astro` | ブログ記事カード（自サイト/Zenn/Qiita/note の出典バッジ、外部リンク、タグリンク、`highlightTag`・`headingLevel` 対応） |
| `ProjectCard.astro` | プロジェクトカード（stretched-link、ロケール別タイトル/説明、役割・成果・状態の短い要約に対応） |
| `SkillBadge.astro` | スキル・タグのバッジ（リンク付き、ニュートラル背景＋本文色、hover で primary） |
| `FilterSection.astro` | 一覧ページの検索・タグフィルター・ソート（AND 絞り込み、`q`/`tag`/`sort` の URL パラメータ同期、i18n 対応）。タグは件数降順で上位 `initialVisible`（既定10）のみ表示し、残りは「すべてのタグ (+N)」で展開。選択タグと「All」は coral（primary） |
| `Terminal.astro` | ターミナルウィンドウ風の枠（信号機ドット＋タイトルバー＋slot）。色は expressive-code のコードブロック（github-dark）と同一パレットで固定。404・検索ページで使用 |
| `ImageLightbox.astro` | 画像クリックで拡大表示 |
| `OgPlaceholder.astro` | 画像なし記事・プロジェクトの SVG プレースホルダー（カード上では warm ink 背景、OG 画像生成にも使用） |

## Markdoc タグコンポーネント

| コンポーネント | 役割 |
| --- | --- |
| `DiagramFlow.astro` | フロー図コンテナ（`direction`, `title` props） |
| `DiagramNode.astro` | フロー図のノード（`label`, `sublabel`, `color` props） |
| `Box.astro` | コールアウト（`color`: info/warning/success/error、`title`）。枠線全体にセマンティック色を反映するフラットカード |
| `DetailsBlock.astro` | 折りたたみ（`label`）。回転シェブロン＋EC コードブロックと同一のダーク配色。コードブロックを包むと連結 |

## 遊び心（AI・情報系モチーフ）

- `pages/404.astro`・`pages/500.astro`：シェルエラー風ターミナル（`cat: … No such file or directory`、実パスを JS で注入）
- `pages/search.astro`・`pages/en/search.astro`：Pagefind を `Terminal.astro` で包んだターミナル検索（プロンプト＋等幅＋ダーク配色。dir パスは teal）
- `Hero.astro`：写真と抑制した見出しを組み合わせたeditorial構成
