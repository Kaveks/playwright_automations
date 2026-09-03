import { Locator, Page } from "@playwright/test";
import { byTestId } from "../site.config";

/**
 * The burger menu in the application header.
 *
 * A genuine component: it appears on every authenticated screen -- inventory,
 * cart, item detail -- and carries the session-level actions (sign out, reset
 * state) rather than being a single link on one page.
 *
 * It is also stateful. The menu must be opened before its items can be used,
 * which is behaviour worth owning in one place instead of repeating the
 * open-then-click pair in every spec that signs a user out.
 */
export class AppMenu {
  private readonly root: Locator;
  readonly openButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.root = page.locator(byTestId("primary-header"));
    this.openButton = this.root.getByRole("button", { name: "Open Menu" });
    this.logoutLink = this.root.locator(byTestId("logout-sidebar-link"));
  }

  async open(): Promise<void> {
    await this.openButton.click();
  }

  /** Open the menu and sign the current user out. */
  async logout(): Promise<void> {
    await this.open();
    await this.logoutLink.click();
  }
}
