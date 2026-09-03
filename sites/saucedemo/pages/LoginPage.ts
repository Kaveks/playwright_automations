import { Locator, Page } from "@playwright/test";
import { SauceDemoUser } from "../data/users";
import { byTestId, sauceDemoSite } from "../site.config";

/**
 * The Swag Labs sign-in screen, and the gate every other screen sits behind.
 *
 * `signIn` is the unit the tests actually care about; the individual fields are
 * exposed as well so negative cases can submit a partial form.
 */
export class LoginPage {
  readonly username: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.username = page.locator(byTestId("username"));
    this.password = page.locator(byTestId("password"));
    this.submitButton = page.locator(byTestId("login-button"));
    this.errorMessage = page.locator(byTestId("error"));
  }

  async open(): Promise<void> {
    await this.page.goto(sauceDemoSite.baseURL + sauceDemoSite.routes.login);
  }

  /** Complete the whole sign-in form and submit it. */
  async signIn(user: SauceDemoUser): Promise<void> {
    await this.username.fill(user.username);
    await this.password.fill(user.password);
    await this.submitButton.click();
  }

  /** Submit whatever is currently in the form -- used by negative cases. */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
