let cleanupNavbar: (() => void) | undefined;

function initializeNavbar() {
  cleanupNavbar?.();

  const navbar = document.querySelector<HTMLElement>("#site-navbar");
  if (!navbar) return;

  const scrollThreshold = Number(navbar.dataset.scrollThreshold ?? "10");
  const sectionOffset = Number(navbar.dataset.sectionOffset ?? "120");
  const disposers: Array<() => void> = [];

  const updateChrome = () => {
    navbar.toggleAttribute("data-scrolled", window.scrollY > scrollThreshold);
  };

  window.addEventListener("scroll", updateChrome, { passive: true });
  disposers.push(() => window.removeEventListener("scroll", updateChrome));
  updateChrome();

  const sectionLinks = Array.from(
    navbar.querySelectorAll<HTMLAnchorElement>("[data-section-link]"),
  );

  if (navbar.dataset.home === "true" && sectionLinks.length > 0) {
    const updateActiveSection = () => {
      const y = window.scrollY + sectionOffset;
      let activeId = "";

      for (const link of sectionLinks) {
        const id = link.dataset.sectionLink;
        const section = id ? document.getElementById(id) : null;
        if (id && section && section.offsetTop <= y) activeId = id;
      }

      sectionLinks.forEach((link) => {
        const isActive = link.dataset.sectionLink === activeId;
        link.toggleAttribute("data-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    disposers.push(() => window.removeEventListener("scroll", updateActiveSection));
    updateActiveSection();
  }

  navbar.querySelectorAll<HTMLAnchorElement>(".dropdown a").forEach((link) => {
    link.addEventListener("click", () => {
      (document.activeElement as HTMLElement | null)?.blur();
    });
  });

  cleanupNavbar = () => disposers.forEach((dispose) => dispose());
}

initializeNavbar();
document.addEventListener("astro:page-load", initializeNavbar);
document.addEventListener("astro:before-swap", () => cleanupNavbar?.());
