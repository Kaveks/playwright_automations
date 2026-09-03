import {
  playwrightSite,
  playwrightUrl,
} from "../../../sites/playwright/site.config";
import { expect, test } from "../../../sites/playwright/fixtures/test";

const { routes } = playwrightSite;

/**
 * Navigation behaviour on playwright.dev.
 *
 * These specs describe what a *visitor* does. Every selector lives in the page
 * objects and components under `sites/playwright/`; nothing here knows that the
 * navbar is a `<nav aria-label="Main">`.
 */

test.describe("Top navigation", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.open();
  });

  test("a visitor can reach the getting-started guide from the navbar", async ({
    page,
    docsPage,
    homePage,
  }) => {
    await homePage.nav.goToDocs();

    await expect(page).toHaveURL(playwrightUrl(routes.docsIntro));
    await expect(docsPage.heading).toHaveText("Installation");
  });

  test("a visitor can reach the API reference", async ({
    page,
    docsPage,
    homePage,
  }) => {
    await homePage.nav.goToApi();

    await expect(page).toHaveURL(playwrightUrl(routes.api));
    await expect(docsPage.heading).toHaveText("Playwright Library");
  });

  test("a visitor can reach the MCP documentation", async ({
    page,
    docsPage,
    homePage,
  }) => {
    await homePage.nav.goToMcp();

    await expect(page).toHaveURL(playwrightUrl(routes.mcp));
    await expect(docsPage.heading).toHaveText("Playwright MCP");
  });

  test("a visitor can reach the CLI documentation", async ({
    page,
    docsPage,
    homePage,
  }) => {
    await homePage.nav.goToCli();

    await expect(page).toHaveURL(playwrightUrl(routes.cli));
    await expect(docsPage.heading).toHaveText("Playwright CLI");
  });

  test("the logo returns a visitor to the home page from anywhere", async ({
    page,
    homePage,
  }) => {
    await homePage.nav.goToDocs();
    await expect(page).toHaveURL(playwrightUrl(routes.docsIntro));

    await homePage.nav.goToHome();

    await expect(page).toHaveURL(playwrightUrl(routes.home));
    await expect(homePage.heroHeading).toContainText(
      "Playwright enables reliable"
    );
  });
});

test.describe("Documentation sidebar", () => {
  test.beforeEach(async ({ docsPage }) => {
    await docsPage.open(routes.docsIntro);
  });

  test("a reader can move between guides using the sidebar", async ({
    page,
    docsPage,
  }) => {
    await docsPage.sidebar.goToArticle("Library");

    await expect(page).toHaveURL(playwrightUrl(routes.library));
    await expect(docsPage.heading).toHaveText("Library");
    await expect(docsPage.sidebar.currentArticle()).toHaveText("Library");
  });

  test("a reader can drill into a nested guide", async ({ page, docsPage }) => {
    await docsPage.sidebar.goToArticle("Accessibility testing");

    await expect(page).toHaveURL(playwrightUrl(routes.accessibilityTesting));
    await expect(docsPage.heading).toHaveText("Accessibility testing");
  });

  test("sidebar categories collapse and expand", async ({ docsPage }) => {
    const gettingStarted = docsPage.sidebar.category("Getting Started");
    await expect(gettingStarted).toHaveAttribute("aria-expanded", "true");
    await expect(docsPage.sidebar.article("Installation")).toBeVisible();

    await docsPage.sidebar.toggleCategory("Getting Started");

    await expect(gettingStarted).toHaveAttribute("aria-expanded", "false");
    await expect(docsPage.sidebar.article("Installation")).toBeHidden();

    await docsPage.sidebar.toggleCategory("Getting Started");

    await expect(gettingStarted).toHaveAttribute("aria-expanded", "true");
    await expect(docsPage.sidebar.article("Installation")).toBeVisible();
  });
});

test.describe("Language switcher", () => {
  test("a visitor can read the docs in another language", async ({
    page,
    homePage,
  }) => {
    await homePage.open();
    await expect(homePage.nav.currentLanguage()).toHaveText("Node.js");

    await homePage.nav.switchLanguageTo("Python");

    await expect(page).toHaveURL(playwrightUrl(routes.python));
    await expect(homePage.nav.currentLanguage()).toHaveText("Python");
  });
});
