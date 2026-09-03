import path from "node:path";
import dotenv from "dotenv";

/**
 * Accounts used to sign in to Swag Labs.
 *
 * Credentials are read from the environment, never checked in. Locally they
 * come from a git-ignored `.env` at the repository root (copy `.env.example`);
 * in CI the same variable names are supplied from the repository's Actions
 * secrets, so no file is needed there.
 *
 * The `.env` is loaded here rather than in `playwright.config.ts` because these
 * credentials belong to *this* site. playwright.dev needs no sign-in and should
 * not inherit an environment requirement from a sibling site -- the same reason
 * each site owns its own config and fixtures.
 *
 * This site gets a `data/` directory because it has a genuine fixture roster;
 * playwright.dev has none, and does not get one.
 */
dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
  quiet: true,
});

export type SauceDemoUser = {
  readonly username: string;
  readonly password: string;
};

/**
 * Read a required variable, failing loudly at load time.
 *
 * Without this a missing secret would silently fill the form with `undefined`
 * and surface as a confusing "Username is required" assertion failure, rather
 * than as the configuration problem it actually is.
 */
function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}.\n` +
        `  Locally: copy .env.example to .env and fill it in.\n` +
        `  In CI:   add ${name} to the repository's Actions secrets.`
    );
  }

  return value;
}

const password = requireEnv("SAUCEDEMO_PASSWORD");

export const users = {
  /** Behaves normally: the baseline for happy-path journeys. */
  standard: {
    username: requireEnv("SAUCEDEMO_USER"),
    password,
  },

  /**
   * Valid credentials, but the account is blocked at sign-in.
   *
   * Swag Labs shares one password across every demo account, so this reuses the
   * same secret. The username is a fixture identifier rather than a credential,
   * so it defaults sensibly and needs no CI secret of its own.
   */
  lockedOut: {
    username: process.env.SAUCEDEMO_LOCKED_OUT_USER?.trim() || "locked_out_user",
    password,
  },
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
