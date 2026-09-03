import { Locator, Page } from "@playwright/test";

/**
 * The collapsible article tree shown alongside every documentation page.
 *
 * Justified as a component because it is shared by the whole docs section and
 * has behaviour of its own (categories expand and collapse, one article is
 * marked current) rather than being a single link.
 *
 * Article and category names are passed in by the caller: modelling ~200
 * sidebar entries as ~200 methods would be noise, and the label is the same
 * thing a human reader sees, so tests still read as intent.
 */
export class DocsSidebar {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("navigation", { name: "Docs sidebar" });
  }

  async goToArticle(name: string): Promise<void> {
    await this.article(name).click();
  }

  article(name: string): Locator {
    return this.root.getByRole("link", { name, exact: true });
  }

  /** The article the reader is currently on. */
  currentArticle(): Locator {
    return this.root.locator('a[aria-current="page"]');
  }

  category(name: string): Locator {
    return this.root.getByRole("button", { name, exact: true });
  }

  async toggleCategory(name: string): Promise<void> {
    await this.category(name).click();
  }
}
