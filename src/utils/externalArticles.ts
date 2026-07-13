import { SITE } from "./site";

export type ExternalArticleSource = "Zenn" | "Qiita";

export interface ExternalArticle {
  id: string;
  source: ExternalArticleSource;
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  updatedAt?: Date;
  tags: string[];
  readingTime?: number;
}

interface QiitaItem {
  id: string;
  title: string;
  url: string;
  created_at: string;
  updated_at?: string;
  body?: string;
  rendered_body?: string;
  tags?: Array<{ name: string }>;
}

interface ZennArticle {
  id?: number;
  slug: string;
  title: string;
  path?: string;
  emoji?: string;
  article_type?: string;
  published_at?: string;
  body_letters_count?: number;
}

interface ZennResponse {
  articles?: ZennArticle[];
}

const DEFAULT_EXTERNAL_LIMIT = 12;
let externalArticlesCache: Promise<ExternalArticle[]> | undefined;

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function summarize(value: string, fallback: string): string {
  const text = stripHtml(value);
  if (!text) return fallback;
  return text.length > 120 ? `${text.slice(0, 119)}...` : text;
}

async function fetchJson<T>(url: string, source: ExternalArticleSource): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": `${SITE.repository} portfolio build`,
      },
    });

    if (!response.ok) {
      console.warn(`[externalArticles] ${source} fetch failed: ${response.status} ${response.statusText}`);
      return undefined;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[externalArticles] ${source} fetch failed`, error);
    return undefined;
  }
}

function getConfiguredUsername(envKey: "ZENN_USERNAME" | "QIITA_USERNAME", fallback: string): string {
  return String(import.meta.env[envKey] || fallback || "").trim();
}

export async function getQiitaArticles(limit = DEFAULT_EXTERNAL_LIMIT): Promise<ExternalArticle[]> {
  const username = getConfiguredUsername("QIITA_USERNAME", SITE.qiitaUsername);
  if (!username) return [];

  const url = new URL(`https://qiita.com/api/v2/users/${encodeURIComponent(username)}/items`);
  url.searchParams.set("page", "1");
  url.searchParams.set("per_page", String(limit));

  const items = await fetchJson<QiitaItem[]>(url.toString(), "Qiita");
  if (!items) return [];

  return items.map((item) => ({
    id: `qiita-${item.id}`,
    source: "Qiita",
    title: item.title,
    description: summarize(item.rendered_body ?? item.body ?? "", "Qiita に投稿した記事です。"),
    url: item.url,
    publishedAt: new Date(item.created_at),
    updatedAt: item.updated_at ? new Date(item.updated_at) : undefined,
    tags: ["Qiita", ...(item.tags ?? []).map((tag) => tag.name)].filter(Boolean),
  }));
}

export async function getZennArticles(limit = DEFAULT_EXTERNAL_LIMIT): Promise<ExternalArticle[]> {
  const username = getConfiguredUsername("ZENN_USERNAME", SITE.zennUsername);
  if (!username) return [];

  const url = new URL("https://zenn.dev/api/articles");
  url.searchParams.set("username", username);
  url.searchParams.set("order", "latest");

  const data = await fetchJson<ZennResponse>(url.toString(), "Zenn");
  if (!data?.articles) return [];

  return data.articles.slice(0, limit).map((article) => {
    const articleUrl = article.path
      ? `https://zenn.dev${article.path}`
      : `https://zenn.dev/${username}/articles/${article.slug}`;
    const articleType = article.article_type ? [article.article_type] : [];
    const publishedAt = article.published_at ? new Date(article.published_at) : new Date(0);
    const readingTime = article.body_letters_count
      ? Math.max(1, Math.ceil(article.body_letters_count / 600))
      : undefined;

    return {
      id: `zenn-${article.id ?? article.slug}`,
      source: "Zenn",
      title: article.title,
      description: `${article.emoji ? `${article.emoji} ` : ""}Zenn に投稿した記事です。`,
      url: articleUrl,
      publishedAt,
      tags: ["Zenn", ...articleType],
      readingTime,
    };
  });
}

export async function getExternalArticles(limit = DEFAULT_EXTERNAL_LIMIT): Promise<ExternalArticle[]> {
  externalArticlesCache ??= Promise.all([
    getZennArticles(limit),
    getQiitaArticles(limit),
  ]).then(([zennArticles, qiitaArticles]) =>
    [...zennArticles, ...qiitaArticles]
      .filter((article) => !Number.isNaN(article.publishedAt.getTime()))
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()),
  );

  return (await externalArticlesCache).slice(0, limit * 2);
}
