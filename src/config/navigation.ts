import type { Lang } from "../i18n/ui";

export interface NavigationItem {
  key: "about" | "projects" | "blog" | "work" | "contact";
  labelKey:
    | "nav.about"
    | "nav.projects"
    | "nav.blog"
    | "nav.work"
    | "nav.contact";
  sectionId: string;
  path?: string;
  locales?: Lang[];
}

export const PRIMARY_NAVIGATION: readonly NavigationItem[] = [
  { key: "about", labelKey: "nav.about", sectionId: "about" },
  { key: "projects", labelKey: "nav.projects", sectionId: "projects", path: "projects/" },
  { key: "blog", labelKey: "nav.blog", sectionId: "blog", path: "blog/", locales: ["ja"] },
  { key: "work", labelKey: "nav.work", sectionId: "work" },
  { key: "contact", labelKey: "nav.contact", sectionId: "contact" },
] as const;

export function withBase(base: string, path = "") {
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return `${normalizedBase}${path.replace(/^\//, "")}`;
}

export function getHomeUrl(locale: Lang, base: string) {
  return locale === "en" ? withBase(base, "en/") : withBase(base);
}

export function getNavigationHref(
  item: NavigationItem,
  locale: Lang,
  base: string,
  isHome: boolean,
) {
  if (isHome) return `#${item.sectionId}`;
  if (item.path) {
    return withBase(base, locale === "en" ? `en/${item.path}` : item.path);
  }
  return `${getHomeUrl(locale, base)}#${item.sectionId}`;
}

