# Review Article

指定した記事ファイルの添削・レビューを行います。

**使い方:**
```
/review-article <ファイル名 or フルパス>
```

ファイル名だけでも可（拡張子あり・なし両対応）。`src/content/` 以下を検索して自動で特定します。

**例:**
```
/review-article transformer.mdoc
/review-article transformer
/review-article src/content/blog/transformer.mdoc
/review-article src/content/projects/katekyo.mdoc
```

---

## 実行内容

引数のファイル名またはパスをもとに `src/content/` 以下を検索してファイルを特定し、読み込んだうえで以下の観点でレビューしてください。

1. **フロントマター**
   - 必須フィールドの確認（blog: `title`, `description`, `publishDate` / projects: `title`, `description`, `startDate`）
   - `tags` / `skills` の適切さ
   - `image` パスが正しいか（`@assets/...` 形式か）

2. **文章・内容**
   - 日本語の表現・文体の統一性
   - 誤字・脱字・不自然な表現
   - 技術的な正確さ（明らかな誤りがあれば指摘）
   - 読者にとっての分かりやすさ
   - 平易な表現

3. **図解・フロー表現** — ASCII アートや Mermaid は使わず、必ず `DiagramFlow` + `DiagramNode` タグで表現する。フロー・構成図・データの流れなど視覚的に示せる箇所があれば積極的に提案する。
4. **Markdoc 記法** — コードブロックの言語指定が適切か、`DiagramFlow` / `DiagramNode` タグの正しい使い方、内側に ` ``` ` を含むコードブロックは 4 バッククォートで囲まれているか。
5. **構造・フォーマット** — 見出し階層（h2 → h3 の順序）、画像の alt テキスト、冗長な表現・重複説明は削除し必要十分な記述にとどめる。
6. **専門用語の説明** — 一般読者が知らない可能性のある概念・略語には初出時に簡単な説明を加える。ただし自明な用語（HTML、API など）は説明不要。

### DiagramFlow の記法例

```markdoc
{% DiagramFlow title="Encoder–Decoder データフロー" %}
  {% DiagramNode label="原文" sublabel="Yo tengo gatos" color="accent" /%}
  {% DiagramNode label="Encoder × 6層" sublabel="文脈ベクトル (3, 512)" color="primary" /%}
  {% DiagramNode label="Cross-Attention" sublabel="K, V: Encoder出力 / Q: Decoder前層" color="secondary" /%}
  {% DiagramNode label="Decoder × 6層" sublabel="Masked Self-Attention + Cross-Attention" color="primary" /%}
  {% DiagramNode label="翻訳文" sublabel="I have cats" color="success" /%}
{% /DiagramFlow %}
```

レビュー結果は「修正すべき点」と「良い点」に分けて、具体的な改善案つきで提示してください。

---

$ARGUMENTS
