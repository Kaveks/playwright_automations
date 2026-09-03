/**
 * Everything that is true about saucedemo.com and nothing else.
 *
 * Mirrors the shape of `sites/playwright/site.config.ts` without sharing
 * anything with it: two sites that happen to both need a base URL do not
 * constitute a shared abstraction.
 */
export const sauceDemoSite = {
  baseURL: "https://www.saucedemo.com",

  routes: {
    login: "/",
    inventory: "/inventory.html",
  },
} as const;

/** Absolute URL for a route. See the note in the playwright.dev config. */
export function sauceDemoUrl(route: string): string {
  return new URL(route, sauceDemoSite.baseURL).toString();
}

/**
 * Swag Labs ships purpose-built `data-test` hooks on every element worth
 * automating, which are more stable than roles or visible text.
 *
 * Playwright can map `getByTestId` onto them via `testIdAttribute`, but that
 * setting is global and `data-test` is *this* site's convention -- playwright.dev
 * has no such attribute. Resolving the selector here keeps the convention inside
 * the site that owns it and leaves the shared config untouched.
 */
export function byTestId(id: string): string {
  return `[data-test="${id}"]`;
}
