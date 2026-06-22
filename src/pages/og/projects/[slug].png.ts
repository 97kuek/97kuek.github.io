import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { buildCollectionOgSvg, renderPngResponse } from "../../../utils/ogImage";

export const prerender = true;

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return projects.map((p) => ({
    params: { slug: p.id },
    props: { title: p.data.title, tags: p.data.skills ?? [] },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { title, tags } = props as { title: string; tags: string[] };
  return renderPngResponse(buildCollectionOgSvg({ label: "PROJECT", title, tags }));
};
