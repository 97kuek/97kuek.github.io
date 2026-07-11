import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";
import { FEATURED_PROJECT_LIMIT } from "./constants";

export interface NavEntry {
  title: string;
  description: string;
  url: string;
}

export function getLocalizedProject(project: CollectionEntry<"projects">, locale: Lang) {
  return {
    title:
      locale === "en" && project.data.title_en
        ? project.data.title_en
        : project.data.title,
    description:
      locale === "en" && project.data.description_en
        ? project.data.description_en
        : project.data.description,
  };
}

export function getHomeUrl(locale: Lang) {
  return locale === "en" ? `${import.meta.env.BASE_URL}en/` : import.meta.env.BASE_URL;
}

export function getProjectsUrl(locale: Lang) {
  return locale === "en"
    ? `${import.meta.env.BASE_URL}en/projects`
    : `${import.meta.env.BASE_URL}projects`;
}

export function getProjectDetailUrl(projectId: string, locale: Lang) {
  return `${getProjectsUrl(locale)}/${projectId}`;
}

export function sortProjectsByDisplayDate(projects: CollectionEntry<"projects">[]) {
  return [...projects].sort((a, b) => {
    const aTime = a.data.endDate ? a.data.endDate.getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.data.endDate ? b.data.endDate.getTime() : Number.MAX_SAFE_INTEGER;
    return bTime - aTime;
  });
}

export function getFeaturedProjects(
  projects: CollectionEntry<"projects">[],
  limit = FEATURED_PROJECT_LIMIT,
) {
  return sortProjectsByDisplayDate(projects)
    .filter((project) => project.data.featured === true)
    .slice(0, limit);
}

export function getTagSummary<T>(
  items: T[],
  getTags: (item: T) => string[] | undefined,
) {
  const tagCounts = items.reduce(
    (acc, item) => {
      (getTags(item) ?? []).forEach((tag) => {
        acc[tag] = (acc[tag] ?? 0) + 1;
      });
      return acc;
    },
    {} as Record<string, number>,
  );

  const tags = [...new Set(items.flatMap((item) => getTags(item) ?? []))].sort(
    (a, b) => (tagCounts[b] - tagCounts[a]) || a.localeCompare(b),
  );

  return { tags, tagCounts };
}

export function getProjectNav(
  projects: CollectionEntry<"projects">[],
  currentId: string,
  locale: Lang,
) {
  const sorted = [...projects].sort(
    (a, b) => b.data.startDate.getTime() - a.data.startDate.getTime(),
  );
  const currentIndex = sorted.findIndex((entry) => entry.id === currentId);
  if (currentIndex === -1) {
    return { prev: undefined, next: undefined };
  }

  const toNavEntry = (entry: CollectionEntry<"projects"> | undefined): NavEntry | undefined => {
    if (!entry) return undefined;
    const localized = getLocalizedProject(entry, locale);
    return {
      ...localized,
      url: getProjectDetailUrl(entry.id, locale),
    };
  };

  return {
    prev: toNavEntry(sorted[currentIndex + 1]),
    next: toNavEntry(sorted[currentIndex - 1]),
  };
}
