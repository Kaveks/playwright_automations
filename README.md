# Playwright Automations

End-to-end UI automation built with [Playwright Test](https://playwright.dev) and TypeScript.

The repository is structured to automate **many independent websites** from a single
Playwright configuration, without their selectors, page objects or fixtures ever
mixing. It doubles as a reference for component-based Playwright architecture, so the
code favours clarity over framework machinery.

---

## Architecture

One rule governs the whole repository:

> **`tests/` describes _what_ is being tested. `sites/` describes _how_ a particular
> website is driven.**

A spec reads like a description of user behaviour. It never contains a CSS selector, a
role name or a URL string. All of that lives in the site's own page objects and
components, so it is always obvious which selectors belong to which website.

```
Spec  ──uses──▶  Fixture  ──provides──▶  Page Object  ──composes──▶  Component
(intent)         (wiring)                (a screen)                  (a widget)
```

### Layers

| Layer           | Location                      | Responsibility                                                             |
| --------------- | ----------------------------- | -------------------------------------------------------------------------- |
| **Spec**        | `tests/sites/<site>/`         | Scenarios and assertions. Business language only.                          |
| **Fixture**     | `sites/<site>/fixtures/`      | Site-scoped `test` object that injects ready-made page objects.            |
| **Page object** | `sites/<site>/pages/`         | One meaningful screen. Owns what is unique to that screen.                 |
| **Component**   | `sites/<site>/components/`    | A reusable widget shared by several pages — navbar, sidebar, modal, table. |
| **Site config** | `sites/<site>/site.config.ts` | Base URL, named routes, site-level constants.                              |

### Directory layout

The tree below is the tracked project; files excluded by `.gitignore`
(`node_modules/`, `test-results/`, `playwright-report/`, local scratch specs) are
omitted.

```
playwright_automations/
├── .github/                           GitHub metadata
│   └── workflows/
│       └── playwright.yml             CI: runs the full suite on push and pull request
├── docs/
│   └── guide.md                       Architecture brief this structure was built from
├── sites/                             ── SITE IMPLEMENTATION: how each site is driven ──
│   └── playwright/                    Everything specific to playwright.dev
│       ├── components/                Reusable widgets shared across this site's pages
│       │   ├── DocsSidebar.ts         Collapsible documentation article tree
│       │   └── MainNavigation.ts      Top navbar: Docs · MCP · CLI · API · languages
│       ├── fixtures/
│       │   └── test.ts                Site-scoped `test`/`expect` injecting page objects
│       ├── pages/                     One class per meaningful screen
│       │   ├── DocsPage.ts            Any documentation article (shared docs layout)
│       │   └── PlaywrightHomePage.ts  Landing page: hero and primary call to action
│       └── site.config.ts             baseURL, named routes, playwrightUrl(), languages
├── tests/                             ── TEST SCENARIOS: what is being tested ──
│   ├── sites/                         Specs grouped by the site under test
│   │   └── playwright/
│   │       └── navigation.spec.ts     Navbar, docs sidebar and language switching
│   └── example.spec.ts                Plain-Playwright starter specs, kept as a reference
├── .gitignore                         Dependencies, reports and local scratch specs
├── README.md                          This file
├── command.md                         Personal Playwright CLI notes
├── package.json                       Dependencies and the test / typecheck scripts
├── package-lock.json                  Locked dependency graph
├── playwright.config.ts               Single Playwright config — testDir: "./tests"
└── tsconfig.json                      Strict type-checking for tests and site code
```

There is exactly **one** Playwright config and **one** test root. Adding a website never
touches either.

---

## Getting started

**Requirements** — Node.js 18 or later (developed on Node 22.22.2 ).

```bash
npm install
npx playwright install --with-deps
```

### Run the suite

```bash
npm test                                  # all specs, all browsers
npm run typecheck                         # tsc --noEmit, no tests executed
```

The suite runs against **Chromium, Firefox and WebKit** as configured in
`playwright.config.ts`.

### Everyday commands

| Command                                          | Purpose                                          |
| ------------------------------------------------ | ------------------------------------------------ |
| `npx playwright test`                            | Run every spec on every browser project          |
| `npx playwright test --ui`                       | Interactive UI mode — best for developing a test |
| `npx playwright test --headed`                   | Watch the browser as it runs                     |
| `npx playwright test --debug`                    | Step through with the Playwright Inspector       |
| `npx playwright test --project=chromium`         | Restrict to one browser                          |
| `npx playwright test tests/sites/playwright`     | Run one directory                                |
| `npx playwright test navigation`                 | Run specs whose filename matches `navigation`    |
| `npx playwright test -g "language switcher"`     | Run tests whose title matches                    |
| `npx playwright test tests/example.spec.ts:10`   | Run the test starting at line 10                 |
| `npx playwright test --workers=3`                | Control parallelism                              |
| `npx playwright show-report`                     | Open the HTML report from the last run           |
| `npx playwright codegen https://playwright.dev/` | Record interactions to harvest locators          |

Flags combine, so debugging a single test in one browser is:

```bash
npx playwright test --debug --project=chromium -g "reach the API reference"
```

---

## Writing a test

Specs import `test` and `expect` from **their site's fixture**, never from
`@playwright/test` directly. The page objects arrive already constructed.

```ts
import { expect, test } from "../../../sites/playwright/fixtures/test";
import {
  playwrightSite,
  playwrightUrl,
} from "../../../sites/playwright/site.config";

const { routes } = playwrightSite;

test("a visitor can reach the API reference", async ({
  page,
  homePage,
  docsPage,
}) => {
  await homePage.open();

  await homePage.nav.goToApi();

  await expect(page).toHaveURL(playwrightUrl(routes.api));
  await expect(docsPage.heading).toHaveText("Playwright Library");
});
```

Note what the spec does **not** contain: no `page.goto`, no `getByRole`, no literal URL.
It also asserts a real outcome — the destination page rendered — rather than merely that
a click was dispatched.

### Components own their scope

Every component is anchored to a root locator, so a link in page content can never be
confused with a link in the navigation:

```ts
export class MainNavigation {
  private readonly root: Locator;

  constructor(page: Page) {
    this.root = page.getByRole("navigation", { name: "Main" });
  }

  async goToApi(): Promise<void> {
    await this.link("API").click();
  }

  private link(name: string): Locator {
    return this.root.getByRole("link", { name, exact: true });
  }
}
```

### Working from Codegen

`npx playwright codegen` output is **raw material, not a test**. Recordings contain
scroll events, stray clicks and keyboard noise that assert nothing. Harvest the locators,
place them in the right page object or component, then write the scenario by hand around
a meaningful assertion.

---

## Adding a new website

Nothing global changes — no edit to `playwright.config.ts`, no second config, no new test
root. Using `saucedemo` as an example:

**1. Create the site implementation.**

```
sites/saucedemo/
├── site.config.ts
├── components/
├── pages/
└── fixtures/test.ts
```

**2. Define the site's config.**

```ts
export const sauceDemoSite = {
  baseURL: "https://www.saucedemo.com",
  routes: { login: "/", inventory: "/inventory.html" },
} as const;
```

**3. Export a site-scoped fixture.**

```ts
import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from "@playwright/test";
```

**4. Add specs under `tests/sites/saucedemo/`.**

Each site exports its _own_ `test`, so fixtures can never leak between sites and no single
global fixture object grows without bound.

---

## Conventions

These are the rules the existing code follows. They exist to keep the repository readable
as it grows, not to add ceremony.

1. **Specs express intent.** No selectors, no URLs, no `new SomePage(page)` wiring.
2. **Model real components only.** A navbar, sidebar, modal, table or form earns a class.
   A heading or a single link does not — a locator on the page object is enough.
3. **Prefer composition to inheritance.** Pages _hold_ components. There is deliberately
   no `BasePage`: a landing page and a docs page share almost no structure.
4. **Scope locators to a component root** so page content cannot collide with chrome.
5. **Prefer role- and text-based locators.** Reach for a CSS class only when no accessible
   handle is stable, and leave a comment explaining why — see the language switcher in
   `MainNavigation.ts`, whose trigger is labelled with the _current_ language.
6. **Site-specific detail stays inside that site.** There is no shared `utils/` bucket.
   Introduce a shared abstraction only once two sites genuinely need it, and justify it.
7. **Assert outcomes, not actions.** Verify the resulting URL, heading or state — never
   that a click merely executed.
8. **Name routes in `site.config.ts`** so a site restructure is a one-line change.

---

## Continuous integration

`.github/workflows/playwright.yml` runs the full suite on every push and pull request
against `main`/`master`, and uploads the HTML report as a build artifact with 30-day
retention.

---

## Reference

- [Playwright documentation](https://playwright.dev/docs/intro)
- [Locators](https://playwright.dev/docs/locators) · [Assertions](https://playwright.dev/docs/test-assertions) · [Fixtures](https://playwright.dev/docs/test-fixtures) · [Page object models](https://playwright.dev/docs/pom)
