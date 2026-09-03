import { expect, test } from "../../../sites/saucedemo/fixtures/test";
import { loginErrors, users } from "../../../sites/saucedemo/data/users";
import { sauceDemoSite, sauceDemoUrl } from "../../../sites/saucedemo/site.config";

const { routes } = sauceDemoSite;

/**
 * Authentication on Swag Labs.
 *
 * The recorded journey was sign in as a standard user, then sign out through
 * the burger menu. That is one scenario; the cases around it -- a blocked
 * account, wrong credentials, an empty form, and whether signing out actually
 * ends the session -- are what make the suite worth running.
 */

test.describe("Signing in", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test("a standard user reaches the product catalogue", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.signIn(users.standard);

    await expect(page).toHaveURL(sauceDemoUrl(routes.inventory));
    await expect(inventoryPage.title).toHaveText("Products");
    await expect(inventoryPage.products).toHaveCount(6);
  });

  test("a locked-out user is told why they were refused", async ({
    page,
    loginPage,
  }) => {
    await loginPage.signIn(users.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(loginErrors.lockedOut);
    await expect(page).toHaveURL(sauceDemoUrl(routes.login));
  });

  test("a wrong password is rejected", async ({ loginPage }) => {
    await loginPage.signIn({
      username: users.standard.username,
      password: "not-the-password",
    });

    await expect(loginPage.errorMessage).toHaveText(loginErrors.badCredentials);
  });

  test("an empty form is rejected field by field", async ({ loginPage }) => {
    await loginPage.submit();
    await expect(loginPage.errorMessage).toHaveText(loginErrors.missingUsername);

    await loginPage.username.fill(users.standard.username);
    await loginPage.submit();
    await expect(loginPage.errorMessage).toHaveText(loginErrors.missingPassword);
  });
});

test.describe("Signing out", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.signIn(users.standard);
  });

  test("a signed-in user can sign out from the burger menu", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await inventoryPage.menu.open();
    await expect(inventoryPage.menu.logoutLink).toBeVisible();

    await inventoryPage.menu.logoutLink.click();

    await expect(page).toHaveURL(sauceDemoUrl(routes.login));
    await expect(loginPage.submitButton).toBeVisible();
  });

  test("signing out ends the session, not just the page", async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await inventoryPage.menu.logout();
    await expect(page).toHaveURL(sauceDemoUrl(routes.login));

    // The catalogue must stay unreachable by direct navigation afterwards.
    await inventoryPage.open();

    await expect(loginPage.errorMessage).toHaveText(loginErrors.protectedRoute);
    await expect(page).toHaveURL(sauceDemoUrl(routes.login));
  });
});
