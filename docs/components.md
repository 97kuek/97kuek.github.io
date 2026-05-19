# コンポーネント一覧

`src/components/` 以下の Astro コンポーネント。

## レイアウト

| ファイル | 役割 |
| --- | --- |
| `layouts/Layout.astro` | 全ページ共通（head・OGP・JSON-LD・Navbar） |
| `layouts/BlogLayout.astro` | ブログ記事ページ（TOC・読了時間・前後ナビ・関連記事） |
| `layouts/ProjectLayout.astro` | プロジェクト詳細ページ（期間・スキル・前後ナビ） |

## セクション（トップページ）

| コンポーネント | 役割 |
| --- | --- |
| `Hero.astro` | ヒーローセクション（名前・肩書き・SNS リンク） |
| `About.astro` | 自己紹介セクション |
| `Projects.astro` | プロジェクト一覧（`featured: true` のみ） |
| `Blog.astro` | ブログ一覧（最新3件） |
| `Timeline.astro` | 職務経歴・学歴タイムライン（`collection` prop で切り替え） |
| `Hackathons.astro` | ハッカソン一覧 |
| `Contact.astro` | 連絡先セクション |

## ナビゲーション

| コンポーネント | 役割 |
| --- | --- |
| `Navbar.astro` | 固定ヘッダー（スクロールで shadow 強化・検索ボタン） |
| `FabFlower.astro` | デスクトップ用フローティングメニュー |
| `Dock.astro` | モバイル用ドック型ナビ |
| `BackToTop.astro` | トップへ戻るボタン |
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
| `BlogCard.astro` | ブログ記事カード（`<a>` ラップ、カード全体がリンク） |
| `ProjectCard.astro` | プロジェクトカード（stretched-link） |
| `SkillBadge.astro` | スキル・タグのバッジ（リンク付き） |
| `FilterSection.astro` | タグフィルター（AND 絞り込み、URL パラメータ同期） |
| `ImageLightbox.astro` | 画像クリックで拡大表示 |
| `OgPlaceholder.astro` | 画像なし記事の SVG プレースホルダー（Primary カラー固定） |

## Markdoc タグコンポーネント

| コンポーネント | 役割 |
| --- | --- |
| `DiagramFlow.astro` | フロー図コンテナ（`direction`, `title` props） |
| `DiagramNode.astro` | フロー図のノード（`label`, `sublabel`, `color` props） |
