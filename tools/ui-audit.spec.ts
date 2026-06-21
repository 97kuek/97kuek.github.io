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
      ? page.locator("#site-navbar").getByRole("link", { name: "Projects" })
      : page.getByRole("link", { name: "プロジェクトを見る", exact: true });
    await expect(projectsLink).toBeVisible();

    await expect(page.locator("#site-navbar").getByRole("link", { name: /検索|Search/ })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("project filters reflect expanded state and URL state", async ({ page }, testInfo) => {
    await page.goto("/projects/");
    const toggle = page.getByRole("button", { name: "Tags" });

    if (testInfo.project.name === "desktop") {
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await page.getByRole("button", { name: "Python (4)" }).click();
      await expect(page).toHaveURL(/tag=python/);
      await expect(page.getByText("4件")).toBeVisible();
    } else {
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(page.getByRole("button", { name: "Python (4)" })).toBeHidden();
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(page.getByRole("button", { name: "Python (4)" })).toBeVisible();
    }

    await expectNoHorizontalOverflow(page);
  });

  test("article page starts with one readable header and mobile TOC", async ({ page }, testInfo) => {
    await page.goto("/blog/slide-generator/");
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator("main h1")).toContainText("GitHub Issues");
    await expect(page.getByText("読了目安: 約14分")).toBeVisible();

    if (testInfo.project.name === "mobile") {
      await expect(page.getByRole("navigation").filter({ hasText: "目次" })).toBeVisible();
      await expect(page.getByRole("button", { name: "トップへ戻る" })).toBeHidden();
    }

    await expectNoHorizontalOverflow(page);
  });

  test("search page exposes Pagefind input", async ({ page }) => {
    await page.goto("/search/");
    await expect(page.getByRole("heading", { level: 1, name: "検索" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "検索" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test("english home keeps localized navigation and CTA", async ({ page }) => {
    await page.goto("/en/");
    await expect(page.getByRole("link", { name: "View projects" })).toBeVisible();
    await expect(page.getByRole("link", { name: "日本語に切り替え" })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
