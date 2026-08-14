import { expect, test, type Page } from "@playwright/test";

const representativePaths = [
  "/",
  "/projects/",
  "/blog/",
  "/blog/welcome-post/",
  "/blog/transformer/",
  "/search/",
  "/en/",
  "/en/projects/",
];

async function collectInternalLinks(page: Page) {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"))
      .map((anchor) => anchor.href)
      .filter((href) => {
        const url = new URL(href);
        return (
          url.origin === window.location.origin &&
          !url.pathname.startsWith("/_astro/") &&
          !url.pathname.startsWith("/pagefind/")
        );
      }),
  );
}

test.describe("site quality audit", () => {
  for (const path of representativePaths) {
    test(`${path} exposes required SEO metadata`, async ({ page, request }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(page.locator("main")).toHaveCount(1);
      await expect.poll(() => page.title()).not.toBe("");
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /.+/);
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /.+/);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(ogImage).toBeTruthy();
      const ogImageUrl = new URL(ogImage!);
      const response = await request.get(`${ogImageUrl.pathname}${ogImageUrl.search}`);
      expect(response.ok()).toBeTruthy();
      expect(response.headers()["content-type"]).toContain("image/");
    });

    test(`${path} has accessible page structure`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });

      await expect(page.locator("html")).toHaveAttribute("lang", /^(ja|en)$/);
      await expect(page.getByRole("link", { name: /本文へスキップ|Skip to content/ })).toBeAttached();
      await expect(page.locator("main h1")).toHaveCount(1);

      const imagesWithoutAlt = await page.locator("img:not([alt])").count();
      expect(imagesWithoutAlt).toBe(0);
    });
  }

  test("representative pages do not expose broken internal links", async ({ page, request }) => {
    test.setTimeout(90_000);
    const links = new Set<string>();

    for (const path of representativePaths) {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      for (const href of await collectInternalLinks(page)) {
        links.add(href);
      }
    }

    const targets = new Set<string>();
    const hashesByTarget = new Map<string, Set<string>>();

    for (const href of links) {
      const url = new URL(href);
      const target = `${url.pathname}${url.search}`;
      targets.add(target);

      if (!url.hash) {
        continue;
      }

      const hashes = hashesByTarget.get(target) ?? new Set<string>();
      hashes.add(url.hash);
      hashesByTarget.set(target, hashes);
    }

    for (const target of targets) {
      const response = await request.get(target);
      expect(response.status(), `${target} should resolve`).toBeLessThan(400);
    }

    for (const [target, hashes] of hashesByTarget) {
      await page.goto(target, { waitUntil: "domcontentloaded" });

      for (const hash of hashes) {
        const hashTargetExists = await page.evaluate((hash) => {
          const id = decodeURIComponent(hash.slice(1));
          return Boolean(document.getElementById(id));
        }, hash);
        expect(hashTargetExists, `${target}${hash} hash target should exist`).toBe(true);
      }
    }
  });
});
