import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../utils/site";

export async function GET(context: APIContext) {
  const blogPosts = await getCollection("blog");
  const sortedPosts = [...blogPosts].sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );

  return rss({
    title: `${SITE.ownerName} のブログ`,
    description: "開発、デザイン、テクノロジーに関する考えや学びを記録しています。",
    site: context.site!,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishDate,
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>ja</language>`,
  });
}
