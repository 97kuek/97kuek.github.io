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

const SCRIPT_SRC = "/pagefind/pagefind-ui.js";
const SCRIPT_SELECTOR = "script[data-pagefind-ui]";

/**
 * Pagefind's UI appends its own markup to the mount point, so mounting twice
 * leaves two search inputs stacked. Every path below therefore funnels through
 * a single in-flight promise and a state flag on the mount point: the script
 * load, `astro:page-load` after a view transition, and the initial module run
 * can all race, but only one instance is ever constructed.
 */
let scriptLoad: Promise<void> | undefined;

function loadPagefindScript(): Promise<void> {
  if (window.PagefindUI) return Promise.resolve();
  if (scriptLoad) return scriptLoad;

  scriptLoad = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(SCRIPT_SELECTOR);
    const script = existing ?? document.createElement("script");

    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load the Pagefind UI bundle.")),
      { once: true },
    );

    if (!existing) {
      script.src = SCRIPT_SRC;
      script.dataset.pagefindUi = "true";
      document.head.appendChild(script);
    }
  });

  // A failed load must not poison later visits (e.g. dev → built preview).
  scriptLoad.catch(() => {
    scriptLoad = undefined;
    document.querySelector(SCRIPT_SELECTOR)?.remove();
  });

  return scriptLoad;
}

function showDevelopmentNotice(element: HTMLElement) {
  const message = element.dataset.devNotice ?? "Search is unavailable in development.";
  const notice = document.createElement("p");
  notice.className = "pagefind-dev-notice";
  notice.textContent = message;
  element.replaceChildren(notice);
}

async function mountSearch() {
  const element = document.querySelector<HTMLElement>("#search");
  // "pending" covers the window between asking for the script and mounting —
  // without it a second call slips through while the bundle is still loading.
  if (!element || element.dataset.searchState) return;
  element.dataset.searchState = "pending";

  try {
    await loadPagefindScript();
  } catch {
    element.dataset.searchState = "error";
    showDevelopmentNotice(element);
    return;
  }

  if (!window.PagefindUI) {
    element.dataset.searchState = "error";
    showDevelopmentNotice(element);
    return;
  }

  // The mount point is emptied first so a stray second mount can never stack
  // two inputs — it replaces the UI instead of appending to it.
  element.replaceChildren();
  new window.PagefindUI({
    element: "#search",
    showImages: false,
    showEmptyFilters: false,
  });
  element.dataset.searchState = "ready";
}

mountSearch();
document.addEventListener("astro:page-load", mountSearch);
