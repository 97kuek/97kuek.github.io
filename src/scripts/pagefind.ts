type PagefindUIConstructor = new (options: {
  element: string;
  showImages: boolean;
  showEmptyFilters: boolean;
}) => unknown;

export {};

declare global {
  interface Window {
    PagefindUI?: PagefindUIConstructor;
  }
}

function showDevelopmentNotice(element: HTMLElement) {
  const message = element.dataset.devNotice ?? "Search is unavailable in development.";
  const notice = document.createElement("p");
  notice.className = "pagefind-dev-notice";
  notice.textContent = message;
  element.replaceChildren(notice);
}

function mountSearch() {
  const element = document.querySelector<HTMLElement>("#search");
  if (!element || element.dataset.mounted === "true") return;

  const mount = () => {
    if (!window.PagefindUI) return;
    element.dataset.mounted = "true";
    new window.PagefindUI({
      element: "#search",
      showImages: false,
      showEmptyFilters: false,
    });
  };

  if (window.PagefindUI) {
    mount();
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>("script[data-pagefind-ui]");
  if (existing) {
    existing.addEventListener("load", mount, { once: true });
    existing.addEventListener("error", () => showDevelopmentNotice(element), { once: true });
    return;
  }

  const script = document.createElement("script");
  script.src = "/pagefind/pagefind-ui.js";
  script.dataset.pagefindUi = "true";
  script.addEventListener("load", mount, { once: true });
  script.addEventListener("error", () => showDevelopmentNotice(element), { once: true });
  document.head.appendChild(script);
}

mountSearch();
document.addEventListener("astro:page-load", mountSearch);
