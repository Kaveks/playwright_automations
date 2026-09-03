Refactor my existing Playwright practice repository into a scalable, maintainable, component-based architecture for AUTOMATING MULTIPLE WEBSITES.

IMPORTANT CONSTRAINTS:

1. DO NOT MODIFY playwright.config.ts.
2. DO NOT MODIFY testDir: "./tests".
3. DO NOT change browser projects, reporters, retries, workers, or any other existing Playwright configuration.
4. DO NOT create another Playwright configuration.
5. DO NOT create another test root outside ./tests.
6. DO NOT duplicate test files simply to accommodate the new structure.
7. Preserve existing tests unless they genuinely need to be moved/refactored.
8. Do not blindly create abstractions. Only introduce Page Objects, Components, Fixtures, Helpers, etc. where they have a clear architectural purpose.
9. The architecture must support adding many different websites later without mixing selectors, page objects, or site-specific logic.
10. Do not solve this by putting everything into one generic "utils" or "helpers" directory.
11. Do not hard-code Playwright-specific site logic into shared/global code.
12. Keep the implementation TypeScript and idiomatic for Playwright Test.

CURRENT REPOSITORY STRUCTURE:

playwright_automations/
├── command.md
├── demo/
│ └── test.ts
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tests/
│ ├── example.spec.ts
│ └── test1.spec.ts
└── sites/
└── playwright/
├── components/
│ ├── Headers.ts
│ └── Navigation.ts
└── pages/
└── playwrightHomePage.ts

CURRENT PLAYWRIGHT CONFIG:

The configuration contains:

testDir: "./tests"

This MUST remain unchanged.

CURRENT PLAYWRIGHT SITE COMPONENT:

sites/playwright/components/Navigation.ts

It currently contains the Playwright.dev navigation locators/actions such as:

- Docs
- Library
- MCP
- CLI
- API
- Python
- Node.js
- Accessibility testing

CURRENT PLAYWRIGHT PAGE OBJECT:

sites/playwright/pages/playwrightHomePage.ts

It currently contains Playwright.dev-specific page interactions such as:

- navigating to https://playwright.dev/
- Playwright logo
- main heading

I also have a Codegen-generated Playwright.dev test sequence containing these interactions:

await page.goto("https://playwright.dev/");
await page.getByRole("link", { name: "Playwright logo Playwright" }).click();
await page.getByRole("heading", { name: "Playwright enables reliable" }).click();
await page.locator("body").press("PageDown");
await page.locator("body").press("PageUp");
await page.getByRole("link", { name: "Docs" }).click();
await page.getByRole("button", { name: "Getting Started" }).click();
await page.getByRole("button", { name: "Getting Started" }).press("ArrowDown");
await page.getByRole("button", { name: "Getting Started" }).press("ArrowUp");
await page.getByRole("link", { name: "Library" }).click();
await page.getByRole("link", { name: "Accessibility testing", exact: true }).click();
await page.getByRole("link", { name: "MCP" }).click();
await page.getByRole("link", { name: "CLI", exact: true }).click();
await page.getByRole("link", { name: "API" }).click();
await page.getByRole("link", { name: "Python" }).click();
await page.getByRole("button", { name: "Python" }).click();
await page.getByRole("link", { name: "Node.js" }).click();

ARCHITECTURAL GOAL:

I want ONE Playwright test root:

tests/

Inside it, organize tests by website:

tests/
├── example.spec.ts
├── test1.spec.ts
└── sites/
└── playwright/
└── navigation.spec.ts

Site-specific implementation should remain outside the test root:

sites/
└── playwright/
├── pages/
├── components/
├── fixtures/
├── data/
└── helpers/

Only create these directories if they are actually needed.

The important architectural rule is:

tests/ = test scenarios/specifications

sites/<site>/ = site-specific automation implementation

A future site should be able to look like:

sites/
├── playwright/
│ ├── pages/
│ ├── components/
│ └── ...
│
├── saucedemo/
│ ├── pages/
│ ├── components/
│ └── ...
│
└── another-site/
├── pages/
├── components/
└── ...

and its tests should live under:

tests/sites/<site>/

DESIGN PRINCIPLES:

1. Tests should express TEST INTENT and BUSINESS/USER BEHAVIOR, not raw selectors.

2. Page Objects should represent meaningful pages/screens.

3. Components should represent meaningful reusable UI components, such as:
   - Header
   - Navigation
   - Sidebar
   - Modal
   - Search
   - Data table
   - Pagination
   - Forms

4. Do NOT create a component merely because Codegen produced a locator.

For example, do NOT create:

- HeadingComponent
- BodyComponent
- ScrollComponent
- LinkComponent

unless there is a genuine reusable behavior that justifies it.

5. Codegen-generated locators should be treated as raw implementation material. Refactor them into meaningful Page Object/Component APIs.

6. Site-specific selectors MUST stay within that site's pages/components unless there is a genuinely shared abstraction.

7. Avoid excessive abstraction and inheritance. Prefer composition.

8. Avoid a giant BasePage containing unrelated site behavior.

9. If a concept is shared across multiple sites, explain why it should be shared before introducing it.

10. The architecture must make it obvious which selectors belong to which website.

TEST DESIGN:

Do NOT simply copy the entire Codegen recording into navigation.spec.ts.

Instead, analyze the Codegen recording and identify meaningful test scenarios.

For example, navigation.spec.ts should contain tests representing behaviors such as:

- navigating from the Playwright home page to Docs
- navigating to Library
- navigating to API documentation
- etc.

However, do not automatically create one test per locator. Determine sensible test boundaries.

Each test should use the appropriate Page Object/Component API rather than directly accessing selectors that are already encapsulated.

Assertions should verify meaningful outcomes.

For example, after navigating to Docs, verify the resulting page/URL/content rather than merely asserting that click() executed successfully.

IMPORTANT:

Do not invent a complicated framework.

First inspect the existing repository and current implementation.

Then:

1. Explain the architectural problems you find.
2. Propose the target structure.
3. Identify which existing files should be changed, moved, renamed, or created.
4. Refactor the repository.
5. Keep playwright.config.ts completely untouched.
6. Preserve existing working functionality.
7. Make imports correct after any moves.
8. Ensure TypeScript compiles.
9. Run the relevant Playwright tests.
10. Report exactly what was changed and why.

Do not modify files unrelated to this refactoring.

The final architecture should make adding a second website straightforward without changing the global Playwright configuration.

Most importantly, I am using this repository as a LEARNING/PRACTICE REPOSITORY. Favor an architecture that teaches proper Playwright automation principles and is understandable to an engineer, rather than an enterprise framework full of unnecessary abstractions.
