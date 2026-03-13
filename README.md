# my-portfolio

Astroベースのポートフォリオ管理・公開システム。コンテンツ管理にKeystaticを採用している。
- [ポートフォリオサイト](https://97kuek.github.io/)

## 開発環境の起動

1.  依存関係のインストール: `npm install`
2.  開発サーバーの起動: `npm run dev`
3.  管理画面 (Keystatic) へのアクセス: `http://localhost:4321/keystatic`

## デプロイについて

GitHub Actions を利用した自動デプロイを構成している。`main` ブランチにファイルをプッシュ（またはマージ）すると、自動的にビルドが実行され、GitHub Pages に成果物が反映される。

## 技術仕様

-   **Framework**: Astro v5
-   **CMS**: Keystatic (Local/GitHub Mode)
-   **Styling**: Tailwind CSS & daisyUI
-   **Utilities**: Expressive Code, KaTeX
-   **Deployment**: GitHub Pages

## ディレクトリ構成

主要なディレクトリとファイルの役割は以下の通り。

```text
.
├── src/
│   ├── content/        # Markdown/Markdocコンテンツ (blog, projects, about等)
│   ├── layouts/        # 共通レイアウトコンポーネント
│   ├── components/     # 再利用可能なUIコンポーネント
│   └── pages/          # ルーティング定義 (.astro)
├── public/             # 静的資産 (画像、favicon等)
├── keystatic.config.ts # Keystaticのスキーマ・管理画面設定
├── astro.config.mjs    # Astroのビルド・統合設定
└── markdoc.config.mjs  # Markdocのレンダリング設定
```

