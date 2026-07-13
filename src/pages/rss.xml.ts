import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../utils/site";
import { getExternalArticles } from "../utils/externalArticles";

export async function GET(context: APIContext) {
  const blogPosts = await getCollection("blog");
  const externalArticles = await getExternalArticles();
  const sortedItems = [
    ...blogPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
    })),
    ...externalArticles.map((article) => ({
      title: `[${article.source}] ${article.title}`,
      description: article.description,
      pubDate: article.publishedAt,
      link: article.url,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: `${SITE.ownerName} のブログ`,
    description: "開発、デザイン、テクノロジーに関する考えや学びを記録しています。",
    site: context.site!,
    items: sortedItems,
    customData: `<language>ja</language>`,
  });
}
