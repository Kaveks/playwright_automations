/**
 * Everything that is true about *this website* and nothing else.
 *
 * Each site under `sites/` owns its own config. There is deliberately no global
 * `baseURL` in playwright.config.ts, because a repository that automates many
 * different websites has no single base URL to share.
 */
export const playwrightSite = {
  baseURL: "https://playwright.dev",

  /**
   * Named routes. Tests assert against these instead of pasting URL strings,
   * so a site restructure is a one-line change here.
   */
  routes: {
    home: "/",
    docsIntro: "/docs/intro",
    library: "/docs/library",
    accessibilityTesting: "/docs/accessibility-testing",
    api: "/docs/api/class-playwright",
    mcp: "/mcp/introduction",
    cli: "/agent-cli/introduction",
    python: "/python/",
  },
} as const;

export type PlaywrightRoute =
  (typeof playwrightSite.routes)[keyof typeof playwrightSite.routes];

/**
 * Absolute URL for a route.
 *
 * `expect(page).toHaveURL('/docs/intro')` only resolves relative paths when a
 * `baseURL` is set in the Playwright config -- which it intentionally is not.
 * This keeps the joining logic in one place instead of in every assertion.
 */
export function playwrightUrl(route: string): string {
  return new URL(route, playwrightSite.baseURL).toString();
}

/** Documentation languages offered by the navbar switcher. */
export const docsLanguages = ["Node.js", "Python", "Java", ".NET"] as const;
export type DocsLanguage = (typeof docsLanguages)[number];
