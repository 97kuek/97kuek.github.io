# コンポーネント一覧

`src/components/` 以下の Astro コンポーネント。

## レイアウト

| ファイル | 役割 |
| --- | --- |
| `layouts/Layout.astro` | 全ページ共通（head・OGP・JSON-LD・hreflang・Navbar） |
| `layouts/BlogLayout.astro` | ブログ記事ページ（TOC・読了時間・前後ナビ・関連記事） |
| `layouts/ProjectLayout.astro` | プロジェクト詳細ページ（期間・スキル・前後ナビ） |

## セクション（トップページ）

| コンポーネント | 役割 |
| --- | --- |
| `Hero.astro` | ヒーローセクション（名前・肩書き・SNS リンク）。高さ `100dvh` で全端末1画面。自己紹介文は LLM 出力風にトークンストリーミング表示＋点滅カーソル（`prefers-reduced-motion` で即表示、CLS ゼロ） |
| `About.astro` | 自己紹介セクション |
| `Projects.astro` | プロジェクト一覧（`featured: true` のみ） |
| `Blog.astro` | ブログ一覧（最新3件、日本語ページのみ表示） |
| `Timeline.astro` | 職務経歴・学歴タイムライン（`collection` prop で切り替え、コンテンツをカード内に直接表示） |
| `Hackathons.astro` | ハッカソン一覧 |
| `Contact.astro` | お問い合わせフォーム付き連絡先セクション（ロケール別エントリを自動読み込み） |

## ナビゲーション

| コンポーネント | 役割 |
| --- | --- |
| `Navbar.astro` | 固定ヘッダー（言語トグル JA/EN・検索ボタン・スクロール連動スタイル） |
| `FabFlower.astro` | デスクトップ用フローティングメニュー |
| `Dock.astro` | モバイル用ドック型ナビ |
| `BackToTop.astro` | トップへ戻るボタン（長押しで目次ポップアップ） |
| `PrevNextNav.astro` | 前後記事ナビゲーション |

## 記事ページ

| コンポーネント | 役割 |
| --- | --- |
| `TableOfContents.astro` | 目次（mobile: 折りたたみ / desktop: sticky サイドバー） |
| `ReadingProgress.astro` | 読了プログレスバー（固定、primary カラー） |
| `RelatedContent.astro` | 関連コンテンツ（タグ一致スコアで選出） |
| `Giscus.astro` | GitHub Discussions コメント欄 |

## カード・UI

| コンポーネント | 役割 |
| --- | --- |
| `BlogCard.astro` | ブログ記事カード（stretched-link、タグリンク・`highlightTag`・`headingLevel` 対応。トップ/一覧/タグページ共通） |
| `ProjectCard.astro` | プロジェクトカード（stretched-link、ロケール別 `title_en`/`description_en` 対応） |
| `SkillBadge.astro` | スキル・タグのバッジ（リンク付き、teal=secondary） |
| `FilterSection.astro` | タグフィルター（AND 絞り込み、URL パラメータ同期、i18n 対応）。タグは件数降順で上位 `initialVisible`（既定10）のみ表示し、残りは「すべてのタグ (+N)」で展開。選択タグは teal（secondary）、「All」は coral（primary） |
| `Terminal.astro` | ターミナルウィンドウ風の枠（信号機ドット＋タイトルバー＋slot）。色は expressive-code のコードブロック（github-dark）と同一パレットで固定。404・検索ページで使用 |
| `ImageLightbox.astro` | 画像クリックで拡大表示 |
| `OgPlaceholder.astro` | 画像なし記事の SVG プレースホルダー（暖色 cream 背景＋coral アクセントバー。OG 画像生成にも使用） |

## Markdoc タグコンポーネント

| コンポーネント | 役割 |
| --- | --- |
| `DiagramFlow.astro` | フロー図コンテナ（`direction`, `title` props） |
| `DiagramNode.astro` | フロー図のノード（`label`, `sublabel`, `color` props） |
| `Box.astro` | コールアウト（`color`: info/warning/success/error、`title`）。ヘアライン枠＋カラー左スパイン＋角丸のフラットカード |
| `DetailsBlock.astro` | 折りたたみ（`label`）。回転シェブロン＋EC コードブロックと同一のダーク配色。コードブロックを包むと連結 |

## 遊び心（AI・情報系モチーフ）

- `pages/404.astro`・`pages/500.astro`：シェルエラー風ターミナル（`cat: … No such file or directory`、実パスを JS で注入）
- `pages/search.astro`・`pages/en/search.astro`：Pagefind を `Terminal.astro` で包んだターミナル検索（プロンプト＋等幅＋ダーク配色。dir パスは teal）
- `Hero.astro`：トークンストリーミング表示（上記参照）
