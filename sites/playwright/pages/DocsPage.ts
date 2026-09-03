import { Locator, Page } from "@playwright/test";
import { DocsSidebar } from "../components/DocsSidebar";
import { MainNavigation } from "../components/MainNavigation";
import { playwrightSite } from "../site.config";

/**
 * Any documentation article on playwright.dev.
 *
 * One page object covers the whole docs section rather than one per article,
 * because every article shares the same layout -- navbar, sidebar, and a single
 * article heading. Modelling each article separately would produce hundreds of
 * identical classes.
 */
export class DocsPage {
  readonly nav: MainNavigation;
  readonly sidebar: DocsSidebar;
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.nav = new MainNavigation(page);
    this.sidebar = new DocsSidebar(page);
    this.heading = page.getByRole("main").getByRole("heading", { level: 1 });
  }

  async open(route: string = playwrightSite.routes.docsIntro): Promise<void> {
    await this.page.goto(playwrightSite.baseURL + route);
  }
}
