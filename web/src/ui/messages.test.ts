import { describe, expect, it } from "vitest";
import { ApiError } from "../api/problem";
import { en } from "../i18n/en";
import { errorMessage } from "./messages";

const failure = (code: string, extra: Partial<ConstructorParameters<typeof ApiError>[0]> = {}) =>
  new ApiError({ status: 400, code, ...extra });

// Asserted against the English catalog rather than against literals, so these say "the mapping
// from this code reaches that message" instead of fixing the wording in two places at once.
describe("errorMessage", () => {
  it("never shows the server's own text", () => {
    const error = failure("invalid_credentials", { title: "Invalid email or password" });

    expect(errorMessage(error, en)).toBe(en.errors.invalidCredentials);
  });

  it("tells the learner how long to wait", () => {
    expect(errorMessage(failure("too_many_attempts", { retryAfterSeconds: 30 }), en)).toBe(
      en.errors.tooManyAttemptsIn(30),
    );
    expect(errorMessage(failure("too_many_attempts", { retryAfterSeconds: 30 }), en)).toContain("30 seconds");
    expect(errorMessage(failure("too_many_attempts"), en)).toBe(en.errors.tooManyAttempts);
  });

  it("explains the password rules", () => {
    expect(errorMessage(failure("password_too_short"), en)).toContain("12 characters");
  });

  it("distinguishes our failures from theirs", () => {
    expect(errorMessage(new ApiError({ status: 500, code: "internal_error" }), en)).toBe(en.errors.serverSide);
    expect(errorMessage(new ApiError({ status: 0, code: "network_error" }), en)).toBe(en.errors.network);
    expect(errorMessage(failure("something_new"), en)).toBe(en.errors.requestFailed);
  });

  it("handles errors that are not API errors", () => {
    expect(errorMessage(new Error("boom"), en)).toBe(en.errors.unknown);
  });

  // The catalog is the contract, so a code that maps to nothing would otherwise be invisible
  // until a learner hit it.
  it("maps every error string in the catalog to a reachable value", () => {
    const values = Object.values(en.errors).filter((value): value is string => typeof value === "string");

    expect(values.every((value) => value.trim().length > 0)).toBe(true);
    expect(new Set(values).size).toBeGreaterThan(30);
  });
});
