import { Locator, Page } from "@playwright/test";
import { AppMenu } from "../components/AppMenu";
import { byTestId, sauceDemoSite } from "../site.config";

/**
 * The product catalogue a user lands on after signing in.
 *
 * Composes AppMenu rather than inheriting it, exactly as the playwright.dev
 * pages compose MainNavigation.
 */
export class InventoryPage {
  readonly menu: AppMenu;
  readonly title: Locator;
  readonly products: Locator;

  constructor(private readonly page: Page) {
    this.menu = new AppMenu(page);
    this.title = page.locator(byTestId("title"));
    this.products = page.locator(byTestId("inventory-item"));
  }

  /** Navigate straight here -- used to prove the route is protected. */
  async open(): Promise<void> {
    await this.page.goto(sauceDemoSite.baseURL + sauceDemoSite.routes.inventory);
  }
}
