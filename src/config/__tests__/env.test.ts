import { requiredEnv } from "../env";

describe("requiredEnv", () => {
  it("returns the environment variable value when defined and valid", () => {
    expect(
      requiredEnv("TEST_VAR", "https://example.com"),
    ).toBe("https://example.com");
  });

  it("trims whitespace from environment variable value", () => {
    expect(
      requiredEnv("TEST_VAR", "  https://example.com  "),
    ).toBe("https://example.com");
  });

  it("throws error when environment variable is undefined", () => {
    expect(() =>
      requiredEnv("MISSING_VAR", undefined),
    ).toThrow(
      "Missing required environment variable: MISSING_VAR",
    );
  });

  it("throws error when environment variable is an empty string", () => {
    expect(() => requiredEnv("EMPTY_VAR", "")).toThrow(
      "Missing required environment variable: EMPTY_VAR",
    );
  });

  it("throws error when environment variable is only whitespace", () => {
    expect(() =>
      requiredEnv("WHITESPACE_VAR", "   "),
    ).toThrow(
      "Missing required environment variable: WHITESPACE_VAR",
    );
  });
});
