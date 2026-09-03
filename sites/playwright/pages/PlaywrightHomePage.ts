import { Locator, Page } from "@playwright/test";
import { MainNavigation } from "../components/MainNavigation";
import { playwrightSite } from "../site.config";

/**
 * https://playwright.dev/ -- the marketing landing page.
 *
 * The page object owns the parts unique to this screen (the hero) and
 * *composes* the shared navigation rather than inheriting it. No BasePage: the
 * home page and a docs page have almost nothing structurally in common beyond
 * the navbar, and the navbar is already a component.
 */
export class PlaywrightHomePage {
  readonly nav: MainNavigation;
  readonly heroHeading: Locator;
  readonly getStartedLink: Locator;

  constructor(private readonly page: Page) {
    this.nav = new MainNavigation(page);
    this.heroHeading = page.getByRole("heading", { level: 1 });
    this.getStartedLink = page.getByRole("link", { name: "Get started" });
  }

  async open(): Promise<void> {
    await this.page.goto(playwrightSite.baseURL + playwrightSite.routes.home);
  }

  /** Follow the primary call to action into the tutorial. */
  async startTutorial(): Promise<void> {
    await this.getStartedLink.click();
  }
}
