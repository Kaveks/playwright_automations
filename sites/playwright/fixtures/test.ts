import { test as base } from "@playwright/test";
import { DocsPage } from "../pages/DocsPage";
import { PlaywrightHomePage } from "../pages/PlaywrightHomePage";

/**
 * Test fixtures scoped to playwright.dev.
 *
 * Specs under `tests/sites/playwright/` import `test` and `expect` from here
 * instead of from `@playwright/test`, so page objects arrive ready-made and no
 * spec ever contains `new SomePage(page)` wiring.
 *
 * Each site gets its own fixture file. A future `sites/saucedemo/fixtures/test.ts`
 * exports its own `test` with its own page objects -- so the two sites' fixtures
 * can never leak into each other, and there is no ever-growing global fixture.
 */
type PlaywrightSiteFixtures = {
  homePage: PlaywrightHomePage;
  docsPage: DocsPage;
};

export const test = base.extend<PlaywrightSiteFixtures>({
  homePage: async ({ page }, use) => {
    await use(new PlaywrightHomePage(page));
  },

  docsPage: async ({ page }, use) => {
    await use(new DocsPage(page));
  },
});

export { expect } from "@playwright/test";
