import { Locator, Page } from "@playwright/test";
import { DocsLanguage } from "../site.config";

/**
 * The fixed top navigation bar, present on every playwright.dev page.
 *
 * This is a genuine component: the same widget with the same behaviour is
 * reused across the home page, the docs, the API reference and the MCP/CLI
 * sections, so it is modelled once and composed into each page object.
 *
 * Every locator is scoped to the component root, so a "Docs" or "API" link in
 * page *content* can never be mistaken for the navigation link.
 */
export class MainNavigation {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("navigation", { name: "Main" });
  }

  readonly brand = () => this.root.getByRole("link", { name: /Playwright logo/ });

  /** Return to the home page via the logo. */
  async goToHome(): Promise<void> {
    await this.brand().click();
  }

  async goToDocs(): Promise<void> {
    await this.link("Docs").click();
  }

  async goToMcp(): Promise<void> {
    await this.link("MCP").click();
  }

  async goToCli(): Promise<void> {
    await this.link("CLI").click();
  }

  async goToApi(): Promise<void> {
    await this.link("API").click();
  }

  /**
   * The language switcher renders its *current* selection as the trigger
   * label, so the accessible name is not a stable handle. The dropdown
   * container is addressed by class instead -- a site-specific detail that
   * belongs here, inside this site's component, and nowhere else.
   */
  private readonly languageMenu = () => this.root.locator(".navbar__item.dropdown");

  /** The language the docs are currently being shown in. */
  currentLanguage(): Locator {
    return this.languageMenu().getByRole("button");
  }

  async switchLanguageTo(language: DocsLanguage): Promise<void> {
    await this.languageMenu().hover();
    await this.languageMenu()
      .getByRole("link", { name: language, exact: true })
      .click();
  }

  private link(name: string): Locator {
    return this.root.getByRole("link", { name, exact: true });
  }
}
