import { test as base } from "@playwright/test";
import { InventoryPage } from "../pages/InventoryPage";
import { LoginPage } from "../pages/LoginPage";

/**
 * Test fixtures scoped to saucedemo.com.
 *
 * A second fixture file, entirely separate from the playwright.dev one. Neither
 * site can see the other's page objects, and neither `test` type grows as more
 * sites are added -- which is the whole point of scoping fixtures per site
 * rather than maintaining one global fixture object.
 */
type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<SauceDemoFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect } from "@playwright/test";
