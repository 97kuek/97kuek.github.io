let revealObserver: IntersectionObserver | undefined;

function initializeReveal() {
  revealObserver?.disconnect();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.documentElement.classList.remove("reveal-ready");
    return;
  }

  document.documentElement.classList.add("reveal-ready");
  const elements = document.querySelectorAll<HTMLElement>(
    "[data-reveal]:not(.is-revealed)",
  );
  if (elements.length === 0) return;

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  elements.forEach((element) => revealObserver?.observe(element));
}

initializeReveal();
document.addEventListener("astro:page-load", initializeReveal);
document.addEventListener("astro:before-swap", () => revealObserver?.disconnect());

