import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
}

/**
 * The gallery loops by scrolling exactly one pass and wrapping the offset, so a
 * card that is wider than its neighbours — or any dead space in the track —
 * shows up as a stutter or a blank stretch once per lap. Every card must be the
 * same width, every interval the same, and the track no wider than its cards.
 */
async function expectSeamlessGalleryLoop(page: Page) {
  const layout = await page.evaluate(() => {
    const marquee = document.querySelector<HTMLElement>("#projects [data-project-marquee]");
    const track = marquee?.querySelector<HTMLElement>(".project-marquee__track");
    if (!marquee || !track) return null;
    const items = [...track.children].map((item) => {
      const rect = item.getBoundingClientRect();
      return { left: rect.left, width: rect.width };
    });
    return { scrollWidth: marquee.scrollWidth, items };
  });

  expect(layout).not.toBeNull();
  const { scrollWidth, items } = layout!;
  expect(items.length).toBeGreaterThan(1);

  const widths = items.map((item) => item.width);
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);

  const intervals = items.slice(1).map((item, index) => item.left - items[index].left);
  expect(Math.max(...intervals) - Math.min(...intervals)).toBeLessThanOrEqual(1);

  // Nothing scrollable beyond the cards themselves: any surplus is dead space
  // the loop would drift through as a blank stretch.
  const cardsWidth = items[items.length - 1].left + widths[0] - items[0].left;
  expect(scrollWidth - cardsWidth).toBeLessThanOrEqual(intervals[0] - widths[0] + 1);
}

test.describe("portfolio UI audit", () => {
  test("home hero and primary navigation are usable", async ({ page }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Keitaro Ueki" })).toBeVisible();

    const projectsLink = testInfo.project.name === "desktop"
      ? page.locator("#site-navbar").getByRole("link", { name: "プロジェクト" })
      : page.getByRole("link", { name: "プロジェクトを見る", exact: true });
    await expect(projectsLink).toBeVisible();

    await expect(page.locator("#site-navbar").getByRole("link", { name: /検索|Search/ })).toBeVisible();
    await expect(page.locator("#about .about-layout")).toBeVisible();
    await expect(page.locator("#about .profile-panel--ink")).toHaveCount(0);
    await expect(page.locator("#projects [data-project-marquee]")).toBeVisible();
    const primaryProjectGallery = page.locator(
      "#projects .project-marquee__item:not([data-marquee-clone])",
    );
    const galleryCount = await primaryProjectGallery.count();
    expect(galleryCount).toBeGreaterThan(0);
    // The pass is duplicated so the scroll offset can wrap onto an identical frame.
    await expect(
      page.locator("#projects .project-marquee__item[data-marquee-clone]"),
    ).toHaveCount(galleryCount);
    await expect(primaryProjectGallery.locator(".project-card--gallery")).toHaveCount(galleryCount);
    await expect(primaryProjectGallery.locator(".project-card__stack")).toHaveCount(galleryCount);
    await expect(primaryProjectGallery.locator("time, dl, .card-actions")).toHaveCount(0);
    await expectSeamlessGalleryLoop(page);

    if (testInfo.project.name === "mobile") {
      const galleryBox = await page.locator("#projects [data-project-marquee]").boundingBox();
      expect(galleryBox).not.toBeNull();
      expect(Math.abs(galleryBox!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(galleryBox!.width - page.viewportSize()!.width)).toBeLessThanOrEqual(1);
    }
    await expectNoHorizontalOverflow(page);
  });

  test("project discovery filters reflect query, tags, sort, and URL state", async ({ page }, testInfo) => {
    await page.goto("/projects/");
    const toggle = page.getByRole("button", { name: "Tags" });
    // The count moves whenever a project is added, so match the tag, not the tally.
    const typescriptTag = page.getByRole("button", { name: /^TypeScript \(\d+\)$/ });

    if (testInfo.project.name === "desktop") {
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await typescriptTag.click();
      await expect(page).toHaveURL(/tag=typescript/);
      await page.getByRole("searchbox", { name: "キーワード検索" }).fill("ホテル");
      await expect(page).toHaveURL(/q=/);
      await expect(page.getByText("1件")).toBeVisible();
      await expect(page.getByRole("link", { name: /HRS - ホテル予約管理システム/ })).toBeVisible();
      await page.getByRole("combobox", { name: "並び替え" }).selectOption("title");
      await expect(page).toHaveURL(/sort=title/);
    } else {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(typescriptTag).toBeHidden();
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(typescriptTag).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);
  });

  test("blog discovery restores URL search and tag state", async ({ page }, testInfo) => {
    await page.goto("/blog/?q=transformer&tag=transformer&sort=title");
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Tags", exact: true }).click();
    }
    await expect(page.getByRole("searchbox", { name: "キーワード検索" })).toHaveValue("transformer");
    await expect(page.getByRole("combobox", { name: "並び替え" })).toHaveValue("title");
    await expect(page.getByRole("button", { name: "Transformer (1)" })).toHaveClass(/active/);
    await expect(page.getByText("1件")).toBeVisible();
    await expect(page.getByRole("link", { name: /Transformerの設計意図/ })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("article page starts with one readable header and mobile TOC", async ({ page }, testInfo) => {
    await page.goto("/blog/transformer/");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText("Transformerの設計意図");
    await expect(page.getByText(/読了目安: 約\d+分/)).toBeVisible();

    if (testInfo.project.name === "mobile") {
      await expect(page.getByRole("navigation").filter({ hasText: "目次" })).toBeVisible();
      await expect(page.getByRole("button", { name: "トップへ戻る" })).toBeHidden();
    }

    await expectNoHorizontalOverflow(page);
  });

  test("transformer article renders KaTeX without errors", async ({ page }) => {
    await page.goto("/blog/transformer/");

    await expect(page.locator(".katex-error")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: /Transformerとは/ }),
    ).toBeVisible();
    await expect(page.locator(".katex-block").first()).toBeVisible();

    await expectNoHorizontalOverflow(page);
  });

  test("search page mounts exactly one Pagefind input", async ({ page }) => {
    await page.goto("/search/");
    await expect(page.getByRole("heading", { level: 1, name: "検索" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "検索" })).toBeVisible();
    await expect(page.locator("#search .pagefind-ui__form")).toHaveCount(1);
    await expect(page.locator("#search")).toHaveAttribute("data-search-state", "ready");

    // Arriving through a client-side navigation re-runs the mount path on a
    // fresh mount point — it must replace the UI, never stack a second one.
    await page.goto("/");
    await page.locator("#site-navbar").getByRole("link", { name: /検索|Search/ }).click();
    await expect(page.getByRole("textbox", { name: "検索" })).toBeVisible();
    await expect(page.locator("#search .pagefind-ui__form")).toHaveCount(1);

    await expectNoHorizontalOverflow(page);
  });

  test("contact uses the first-party backend and keeps a direct email fallback", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("[data-contact-form]");
    await expect(form).toHaveCount(1);
    await expect(form).toHaveAttribute("data-endpoint", "/api/contact");
    await expect(form.getByLabel("お名前")).toBeAttached();
    await expect(form.getByLabel("メールアドレス")).toBeAttached();
    await expect(form.getByLabel("お問い合わせ内容")).toBeAttached();
    await expect(page.getByRole("link", { name: /keitaro\.ueki@/ })).toHaveAttribute("href", /^mailto:/);
    await expectNoHorizontalOverflow(page);
  });

  test("article comments use the first-party form", async ({ page }) => {
    await page.goto("/blog/transformer/");

    await expect(page.locator("[data-comments-root]")).toHaveCount(1);
    await expect(page.locator("[data-comments-form]").getByLabel("お名前")).toBeAttached();
    await expect(page.locator("[data-comments-form]").getByLabel("コメント")).toBeAttached();
    await expectNoHorizontalOverflow(page);
  });

  test("english home keeps localized navigation and CTA", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.getByRole("link", { name: "View projects" })).toBeVisible();
    await expect(page.getByRole("link", { name: "日本語に切り替え" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("english projects expose localized discovery controls", async ({ page }, testInfo) => {
    await page.goto("/en/projects/?q=hotel&sort=title");
    await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
    if (testInfo.project.name === "mobile") {
      await page.getByRole("button", { name: "Tags", exact: true }).click();
    }
    await expect(page.getByRole("searchbox", { name: "Keyword search" })).toHaveValue("hotel");
    await expect(page.getByRole("combobox", { name: "Sort" })).toHaveValue("title");
    await expect(page.getByText("1 items")).toBeVisible();
    await expect(page.getByRole("link", { name: /Hotel Reservation System/ })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
