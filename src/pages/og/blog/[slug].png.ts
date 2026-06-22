import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildCollectionOgSvg, renderPngResponse } from "../../../utils/ogImage";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title, tags: post.data.tags ?? [] },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, tags } = props as { title: string; tags: string[] };
  return renderPngResponse(buildCollectionOgSvg({ label: "BLOG", title, tags }));
};
