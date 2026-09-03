/**
 * The fixed account roster Swag Labs publishes on its own login page.
 *
 * These are public demo credentials printed in the page body for anyone to
 * read -- not secrets -- so they belong in version control alongside the tests
 * that need them. Real credentials would come from the environment instead.
 *
 * This site gets a `data/` directory because it has a genuine fixture roster;
 * playwright.dev has none, and does not get one.
 */
export type SauceDemoUser = {
  readonly username: string;
  readonly password: string;
};

const SHARED_PASSWORD = "secret_sauce";

export const users = {
  /** Behaves normally: the baseline for happy-path journeys. */
  standard: { username: "standard_user", password: SHARED_PASSWORD },
  /** Valid credentials, but the account is blocked at sign-in. */
  lockedOut: { username: "locked_out_user", password: SHARED_PASSWORD },
} as const satisfies Record<string, SauceDemoUser>;

/**
 * Exact messages the application renders. Kept beside the accounts that
 * trigger them so a wording change is a single edit.
 */
export const loginErrors = {
  lockedOut: "Epic sadface: Sorry, this user has been locked out.",
  badCredentials:
    "Epic sadface: Username and password do not match any user in this service",
  missingUsername: "Epic sadface: Username is required",
  missingPassword: "Epic sadface: Password is required",
  protectedRoute:
    "Epic sadface: You can only access '/inventory.html' when you are logged in.",
} as const;
