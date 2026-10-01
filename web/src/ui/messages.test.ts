import { describe, expect, it } from "vitest";
import { ApiError } from "../api/problem";
import { errorMessage } from "./messages";

const failure = (code: string, extra: Partial<ConstructorParameters<typeof ApiError>[0]> = {}) =>
  new ApiError({ status: 400, code, ...extra });

describe("errorMessage", () => {
  it("never shows the server's own text", () => {
    const error = failure("invalid_credentials", { title: "Invalid email or password" });

    expect(errorMessage(error)).toBe("The email or password is incorrect.");
  });

  it("tells the learner how long to wait", () => {
    expect(errorMessage(failure("too_many_attempts", { retryAfterSeconds: 30 }))).toContain("30 seconds");
    expect(errorMessage(failure("too_many_attempts"))).toContain("Wait a little");
  });

  it("explains the password rules", () => {
    expect(errorMessage(failure("password_too_short"))).toContain("12 characters");
  });

  it("distinguishes our failures from theirs", () => {
    expect(errorMessage(new ApiError({ status: 500, code: "internal_error" }))).toContain("our side");
    expect(errorMessage(new ApiError({ status: 0, code: "network_error" }))).toContain("cannot be reached");
    expect(errorMessage(failure("something_new"))).toBe("The request could not be completed.");
  });

  it("handles errors that are not API errors", () => {
    expect(errorMessage(new Error("boom"))).toBe("Something went wrong. Please try again.");
  });
});
