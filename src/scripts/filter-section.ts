let cleanupFilters: Array<() => void> = [];

function setExpanded(
  toggle: HTMLElement,
  content: HTMLElement,
  chevron: Element,
  expanded: boolean,
  focusFirst = false,
) {
  toggle.setAttribute("aria-expanded", expanded.toString());
  content.toggleAttribute("inert", !expanded);

  if (expanded) {
    content.hidden = false;
    content.style.maxHeight = `${content.scrollHeight}px`;
    content.style.opacity = "1";
    chevron.classList.remove("-rotate-90");
    if (focusFirst) {
      setTimeout(() => content.querySelector<HTMLElement>(".filter-btn")?.focus(), 200);
    }
    return;
  }

  content.style.maxHeight = "0px";
  content.style.opacity = "0";
  chevron.classList.add("-rotate-90");
  setTimeout(() => {
    if (toggle.getAttribute("aria-expanded") !== "true") {
      content.hidden = true;
    }
  }, 300);
}

function setButtonState(btn: Element, isActive: boolean) {
  const btnTag = btn.getAttribute("data-tag");
  if (btnTag === "all") {
    btn.classList.toggle("btn-primary", isActive);
    btn.classList.toggle("active", isActive);
    btn.classList.toggle("btn-outline", !isActive);
    btn.classList.toggle("btn-ghost", !isActive);
    return;
  }

  btn.classList.toggle("btn-secondary", isActive);
  btn.classList.toggle("active", isActive);
  btn.classList.toggle("btn-outline", !isActive);
  btn.classList.toggle("btn-ghost", !isActive);
}

function initFilter(root: HTMLElement) {
  const containerId = root.dataset.filterContainerId;
  const itemsSuffix = root.dataset.itemsSuffix ?? "";
  const defaultSort = root.dataset.defaultSort ?? "newest";
  if (!containerId) return undefined;

  const filterSection = document.getElementById(`filter-${containerId}`);
  const container = document.getElementById(containerId);
  const countDisplay = document.getElementById(`results-count-${containerId}`);
  const noResults = document.getElementById(`no-results-${containerId}`);
  const toggle = document.getElementById(`filter-toggle-${containerId}`);
  const content = document.getElementById(`filter-content-${containerId}`);
  const chevron = toggle?.querySelector(".chevron");
  if (!filterSection || !container || !countDisplay || !noResults || !toggle || !content || !chevron) {
    return undefined;
  }

  const cleanups: Array<() => void> = [];
  const buttons = Array.from(filterSection.querySelectorAll(".filter-btn"));
  const items = Array.from(container.querySelectorAll<HTMLElement>("[data-filter-tags]"));
  const searchInput = root.querySelector<HTMLInputElement>("[data-filter-search]");
  const sortSelect = root.querySelector<HTMLSelectElement>("[data-filter-sort]");
  const prefersCollapsed = window.matchMedia("(max-width: 767px)");
  const activeTags = new Set<string>();
  let query = "";
  let sort = defaultSort;

  const resizeContent = () => {
    if (toggle.getAttribute("aria-expanded") === "true") {
      content.style.maxHeight = `${content.scrollHeight}px`;
    }
  };

  const setOverflowTagsVisible = (visible: boolean) => {
    filterSection
      .querySelectorAll(".filter-tag-extra")
      .forEach((el) => el.classList.toggle("hidden", !visible));
    root.querySelector<HTMLElement>(".toggle-more-tags")?.replaceChildren(
      document.createTextNode(
        visible
          ? root.querySelector<HTMLElement>(".toggle-more-tags")?.dataset.lessLabel ?? ""
          : root.querySelector<HTMLElement>(".toggle-more-tags")?.dataset.moreLabel ?? "",
      ),
    );
    resizeContent();
  };

  const updateUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    url.searchParams.delete("q");
    url.searchParams.delete("sort");
    if (query) url.searchParams.set("q", query);
    if (sort !== defaultSort) url.searchParams.set("sort", sort);
    activeTags.forEach((tag) => url.searchParams.append("tag", tag));
    if (url.toString() !== window.location.href) {
      window.history.pushState({ tags: Array.from(activeTags), q: query, sort }, "", url);
    }
  };

  const updateUI = (shouldUpdateUrl = true) => {
    let visibleCount = 0;

    buttons.forEach((btn) => {
      const btnTag = btn.getAttribute("data-tag");
      setButtonState(btn, btnTag === "all" ? activeTags.size === 0 : activeTags.has(btnTag ?? ""));
    });

    items.forEach((item) => {
      const itemTags = (item.getAttribute("data-filter-tags") ?? "")
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      const searchable = [
        item.getAttribute("data-filter-title"),
        item.getAttribute("data-filter-description"),
        item.getAttribute("data-filter-tags"),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const isVisible =
        (activeTags.size === 0 || Array.from(activeTags).every((tag) => itemTags.includes(tag))) &&
        (!query || searchable.includes(query));

      item.style.display = isVisible ? "" : "none";
      if (isVisible) visibleCount++;
    });

    const sortedItems = [...items].sort((a, b) => {
      if (sort === "title") {
        return (a.dataset.filterTitle ?? "").localeCompare(b.dataset.filterTitle ?? "");
      }

      const aDate = Number(a.dataset.filterDate ?? 0);
      const bDate = Number(b.dataset.filterDate ?? 0);
      return sort === "oldest" ? aDate - bDate : bDate - aDate;
    });
    sortedItems.forEach((item) => container.appendChild(item));

    countDisplay.textContent = `${visibleCount}${itemsSuffix}`;
    noResults.classList.toggle("hidden", visibleCount > 0);
    container.classList.toggle("hidden", visibleCount === 0);
    resizeContent();
    if (shouldUpdateUrl) updateUrl();
  };

  const toggleTag = (tag: string | null) => {
    if (!tag || tag === "all") {
      activeTags.clear();
    } else if (activeTags.has(tag)) {
      activeTags.delete(tag);
    } else {
      activeTags.add(tag);
    }
    updateUI();
  };

  const syncFromUrl = () => {
    activeTags.clear();
    const params = new URLSearchParams(window.location.search);
    query = (params.get("q") ?? "").trim().toLowerCase();
    sort = params.get("sort") ?? defaultSort;
    if (!["newest", "oldest", "title"].includes(sort)) sort = defaultSort;
    if (searchInput) searchInput.value = query;
    if (sortSelect) sortSelect.value = sort;

    params.getAll("tag").forEach((tag) => {
      const lowerTag = tag.toLowerCase();
      if (buttons.some((btn) => btn.getAttribute("data-tag") === lowerTag)) {
        activeTags.add(lowerTag);
      }
    });

    const anyHiddenActive = Array.from(activeTags).some((tag) => {
      const btn = buttons.find((button) => button.getAttribute("data-tag") === tag);
      return btn?.classList.contains("filter-tag-extra");
    });
    if (anyHiddenActive) setOverflowTagsVisible(true);
    updateUI(false);
  };

  setExpanded(toggle, content, chevron, !prefersCollapsed.matches);

  const onToggleClick = () => {
    const isExpanded = toggle.getAttribute("aria-expanded") === "true";
    setExpanded(toggle, content, chevron, !isExpanded, !isExpanded);
  };
  toggle.addEventListener("click", onToggleClick);
  cleanups.push(() => toggle.removeEventListener("click", onToggleClick));

  const onMediaChange = (event: MediaQueryListEvent) => setExpanded(toggle, content, chevron, !event.matches);
  prefersCollapsed.addEventListener("change", onMediaChange);
  cleanups.push(() => prefersCollapsed.removeEventListener("change", onMediaChange));

  const moreBtn = root.querySelector<HTMLElement>(".toggle-more-tags");
  if (moreBtn) {
    const onMoreClick = () => {
      const firstExtra = filterSection.querySelector(".filter-tag-extra");
      setOverflowTagsVisible(!!firstExtra?.classList.contains("hidden"));
    };
    moreBtn.addEventListener("click", onMoreClick);
    cleanups.push(() => moreBtn.removeEventListener("click", onMoreClick));
  }

  buttons.forEach((button) => {
    const onButtonClick = () => toggleTag(button.getAttribute("data-tag"));
    button.addEventListener("click", onButtonClick);
    cleanups.push(() => button.removeEventListener("click", onButtonClick));
  });

  if (searchInput) {
    const onSearch = () => {
      query = searchInput.value.trim().toLowerCase();
      updateUI();
    };
    searchInput.addEventListener("input", onSearch);
    cleanups.push(() => searchInput.removeEventListener("input", onSearch));
  }

  if (sortSelect) {
    sortSelect.value = sort;
    const onSort = () => {
      sort = sortSelect.value;
      updateUI();
    };
    sortSelect.addEventListener("change", onSort);
    cleanups.push(() => sortSelect.removeEventListener("change", onSort));
  }

  const resetBtn = root.querySelector(".reset-filters");
  if (resetBtn) {
    const onResetClick = () => {
      activeTags.clear();
      query = "";
      sort = defaultSort;
      if (searchInput) searchInput.value = "";
      if (sortSelect) sortSelect.value = defaultSort;
      updateUI();
    };
    resetBtn.addEventListener("click", onResetClick);
    cleanups.push(() => resetBtn.removeEventListener("click", onResetClick));
  }

  const onPopState = () => syncFromUrl();
  window.addEventListener("popstate", onPopState);
  cleanups.push(() => window.removeEventListener("popstate", onPopState));

  syncFromUrl();
  return () => cleanups.forEach((cleanup) => cleanup());
}

export function initFilterSections() {
  cleanupFilterSections();
  cleanupFilters = Array.from(document.querySelectorAll<HTMLElement>("[data-filter-root]"))
    .map(initFilter)
    .filter((cleanup): cleanup is () => void => Boolean(cleanup));
}

export function cleanupFilterSections() {
  cleanupFilters.forEach((cleanup) => cleanup());
  cleanupFilters = [];
}
