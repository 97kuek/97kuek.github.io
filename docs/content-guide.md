# コンテンツ執筆ガイド

## ブログ記事の作成

### ファイル

`src/content/blog/<記事名>.mdoc`（Markdoc 形式）

### フロントマター

```yaml
---
title: "記事タイトル"
description: "説明文（100〜150文字が目安）。OGP と検索スニペットに使われる"
publishDate: "YYYY-MM-DD"
updatedDate: "YYYY-MM-DD"   # 省略可
tags: ["tag1", "tag2"]      # 省略可
image: "@assets/blog/記事名/thumbnail.png"  # 省略可
---
```

必須フィールド: `title`, `description`, `publishDate`

### 追加手順

1. `src/content/blog/<記事名>.mdoc` を作成
2. フロントマターを記述
3. `npm run build` でビルドエラーがないか確認
4. コミット → プッシュ → GitHub Actions で自動デプロイ

---

## 外部記事連携

Zenn / Qiita / note の公開記事はビルド時に取得され、ホームの Blog セクション、`/blog/`、RSS に外部記事カードとして表示される。

- 既定値は `src/utils/site.ts` の `zennUsername` / `qiitaUsername` / `noteUsername`（未設定時は取得しない）
- 環境変数 `ZENN_USERNAME` / `QIITA_USERNAME` / `NOTE_USERNAME` で上書き可能
- 取得できない場合もビルドは失敗せず、ローカル記事だけを表示する

---

## プロジェクトの追加

### プロジェクトファイル

`src/content/projects/<プロジェクト名>.mdoc`（Markdoc 形式）

### プロジェクトフロントマター

```yaml
---
title: "プロジェクト名"
description: "説明文"
startDate: "YYYY-MM-DD"
endDate: "YYYY-MM-DD"       # 省略可（省略すると「進行中」）
updatedDate: "YYYY-MM-DD"   # 省略可
skills: ["TypeScript", "React"]
featured: true              # トップページへの表示
role: "担当領域"            # 省略可。カード/詳細の要約に表示
impact: "成果・効果"        # 省略可。カード/詳細の要約に表示
status: "公開中"            # 省略可。カード/詳細の要約に表示
role_en: "Role"             # 省略可
impact_en: "Outcome"        # 省略可
status_en: "Live"           # 省略可
image: "@assets/projects/プロジェクト名/thumbnail.png"  # 省略可
demoLink: "https://..."     # 省略可
sourceLink: "https://..."   # 省略可
---
```

---

## コードブロックのルール

- **空のコードブロックは禁止**（ビルドエラー）
- 未知の言語識別子を使うとビルドエラー → `text` にフォールバックする
  - 例: `dataview` → `text`
- Markdoc コードブロック内にさらに ```` ``` ```` を含める場合は外側を 4 バッククォートで囲む

````markdown
外側4バッククォートで囲むと内側の ``` をそのまま使える
````

---

## 図解の書き方

**ASCII アート・Mermaid は禁止。** `DiagramFlow` + `DiagramNode` の Markdoc タグを使う。

### DiagramFlow

| 属性 | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `direction` | `"row"` / `"col"` | `"row"` | ノードの並び方向 |
| `title` | `string` | — | 図のキャプション |

### DiagramNode

| 属性 | 型 | 既定値 | 説明 |
| --- | --- | --- | --- |
| `label` | `string` | 必須 | メインラベル |
| `sublabel` | `string` | — | 補足テキスト（薄字） |
| `color` | `string` | — | `primary` / `secondary` / `accent` / `success` / `warning` / `error` |

### 記述例

```markdoc
{% DiagramFlow title="認証フロー" %}
  {% DiagramNode label="クライアント" color="primary" %}{% /DiagramNode %}
  {% DiagramNode label="サーバー" sublabel="JWT 検証" color="secondary" %}{% /DiagramNode %}
  {% DiagramNode label="DB" color="accent" %}{% /DiagramNode %}
{% /DiagramFlow %}
```

縦並びにする場合は `direction="col"` を指定する。

---

## Markdoc カスタムタグ一覧

| タグ | 用途 |
| --- | --- |
| `{% Box color="..." title="..." %}...{% /Box %}` | 情報・警告・成功・エラーの強調ボックス |
| `{% DiagramFlow %}...{% /DiagramFlow %}` | フロー図コンテナ |
| `{% DiagramNode label="..." /%}` | フロー図のノード |
| `{% LinkCard url="..." /%}` | リンクカード |
| `{% Math %}...{% /Math %}` | TeX 数式（ブロック） |
| `{% InlineMath %}...{% /InlineMath %}` | TeX 数式（インライン） |
| `{% YouTube id="..." /%}` / `{% YouTube url="..." /%}` | YouTube 埋め込み |
| `{% SpeakerDeck id="..." /%}` | Speaker Deck スライド埋め込み |
| `{% Carousel interval=4000 %}...{% /Carousel %}` | 画像カルーセル |
| `{% CarouselSlide src="..." alt="..." /%}` | カルーセル内の個別スライド |

### Box の color 値

`info`（青）/ `success`（緑）/ `warning`（黄）/ `error`（赤）

---

## 執筆スタイルガイド

- `description` フィールドは 100〜150 文字で具体的に書く（検索スニペットに使われる）
- 専門用語は初出時に簡単な説明を括弧で補足する
- 冗長な表現は省き、必要十分な記述にとどめる
- 強調（`**太字**`）は `color: primary` で表示される。多用しない
