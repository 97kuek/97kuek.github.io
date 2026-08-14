import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth - root.clientWidth;
  });
  expect(overflow).toBeLessThanOrEqual(1);
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
    await expect(page.locator("#projects .project-marquee__group")).toHaveCount(2);
    const primaryProjectGallery = page.locator("#projects .project-marquee__group").first();
    await expect(primaryProjectGallery.locator(".project-card--gallery")).toHaveCount(4);
    await expect(primaryProjectGallery.locator(".project-card__stack")).toHaveCount(4);
    await expect(primaryProjectGallery.locator("time, dl, .card-actions")).toHaveCount(0);

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

    if (testInfo.project.name === "desktop") {
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.getByRole("button", { name: "TypeScript (2)" }).click();
      await expect(page).toHaveURL(/tag=typescript/);
      await expect(page.getByText("2件")).toBeVisible();
      await page.getByRole("searchbox", { name: "キーワード検索" }).fill("ホテル");
      await expect(page).toHaveURL(/q=/);
      await expect(page.getByText("1件")).toBeVisible();
      await expect(page.getByRole("link", { name: /HRS - ホテル予約管理システム/ })).toBeVisible();
      await page.getByRole("combobox", { name: "並び替え" }).selectOption("title");
      await expect(page).toHaveURL(/sort=title/);
    } else {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByRole("button", { name: "TypeScript (2)" })).toBeHidden();
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("button", { name: "TypeScript (2)" })).toBeVisible();
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

  test("search page exposes Pagefind input", async ({ page }) => {
    await page.goto("/search/");
    await expect(page.getByRole("heading", { level: 1, name: "検索" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "検索" })).toBeVisible();
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
