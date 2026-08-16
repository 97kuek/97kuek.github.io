import { PROJECT_MARQUEE_SPEED_PX_PER_SEC } from "../utils/constants";

/** How long the drift stays paused after the visitor stops swiping. */
const RESUME_DELAY_MS = 1600;
/** Cap the per-frame delta so a backgrounded tab does not jump on return. */
const MAX_FRAME_MS = 100;

let cleanupMarquees: (() => void) | undefined;

function initializeMarquee(marquee: HTMLElement): () => void {
  const track = marquee.querySelector<HTMLElement>(".project-marquee__track");
  if (!track) return () => {};

  const speed = Number(marquee.dataset.marqueeSpeed) || PROJECT_MARQUEE_SPEED_PX_PER_SEC;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const disposers: Array<() => void> = [];

  let position = marquee.scrollLeft;
  let lastFrame = 0;
  let frame = 0;
  let resumeTimer = 0;
  let pointerHeld = false;
  let hovered = false;
  let visible = true;

  // The clone is aria-hidden, so its links must leave the tab order — but they
  // stay clickable, because the clone is on screen half of every loop.
  marquee
    .querySelectorAll<HTMLElement>("[data-marquee-clone] a, [data-marquee-clone] button")
    .forEach((element) => element.setAttribute("tabindex", "-1"));

  // The cards are laid out twice, so scrolling by exactly one pass lands on an
  // identical frame — that distance is where the offset wraps, which is what
  // makes the loop endless with no visible reset.
  //
  // It is read off the first clone's own position rather than derived from
  // scrollWidth or a wrapper's width: those depend on the engine's intrinsic
  // sizing, and WebKit measures them larger than the cards actually occupy.
  let cycle = 0;

  const measure = () => {
    const first = track.firstElementChild as HTMLElement | null;
    const firstClone = track.querySelector<HTMLElement>("[data-marquee-clone]");
    cycle = first && firstClone ? firstClone.offsetLeft - first.offsetLeft : 0;
  };

  measure();

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(track);
  disposers.push(() => resizeObserver.disconnect());

  const isPaused = () => pointerHeld || hovered || !visible || document.hidden;

  const step = (now: number) => {
    frame = requestAnimationFrame(step);

    const elapsed = lastFrame === 0 ? 0 : Math.min(now - lastFrame, MAX_FRAME_MS);
    lastFrame = now;

    if (cycle <= 0) return;

    // A hand swipe moves scrollLeft behind our back — adopt it as the new truth.
    if (Math.abs(marquee.scrollLeft - position) > 1) position = marquee.scrollLeft;

    const drifting = !isPaused() && !reduceMotion.matches;
    if (drifting) position += (speed * elapsed) / 1000;

    let wrapped = position;
    while (wrapped >= cycle) wrapped -= cycle;
    while (wrapped < 0) wrapped += cycle;

    const jumped = wrapped !== position;
    position = wrapped;

    // Never write scrollLeft mid-swipe unless we have to wrap — touch drags
    // fight programmatic scrolling.
    if (drifting || jumped) marquee.scrollLeft = position;
  };

  const pause = () => {
    pointerHeld = true;
    window.clearTimeout(resumeTimer);
  };

  const scheduleResume = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      pointerHeld = false;
    }, RESUME_DELAY_MS);
  };

  const on = <K extends keyof HTMLElementEventMap>(
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ) => {
    marquee.addEventListener(type, handler, { passive: true });
    disposers.push(() => marquee.removeEventListener(type, handler));
  };

  on("pointerdown", pause);
  on("pointerup", scheduleResume);
  on("pointercancel", scheduleResume);
  on("touchstart", pause);
  on("touchend", scheduleResume);
  on("touchcancel", scheduleResume);
  on("wheel", () => {
    pause();
    scheduleResume();
  });
  on("pointerenter", () => {
    hovered = true;
  });
  on("pointerleave", () => {
    hovered = false;
  });
  on("focusin", () => {
    hovered = true;
  });
  on("focusout", () => {
    hovered = false;
  });

  // Off-screen sections should not burn frames.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) visible = entry.isIntersecting;
    },
    { threshold: 0 },
  );
  observer.observe(marquee);
  disposers.push(() => observer.disconnect());

  frame = requestAnimationFrame(step);
  disposers.push(() => cancelAnimationFrame(frame));
  disposers.push(() => window.clearTimeout(resumeTimer));

  return () => disposers.forEach((dispose) => dispose());
}

function initializeProjectMarquees() {
  cleanupMarquees?.();

  const disposers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-project-marquee]"),
  ).map(initializeMarquee);

  cleanupMarquees = () => disposers.forEach((dispose) => dispose());
}

initializeProjectMarquees();
document.addEventListener("astro:page-load", initializeProjectMarquees);
document.addEventListener("astro:before-swap", () => cleanupMarquees?.());
