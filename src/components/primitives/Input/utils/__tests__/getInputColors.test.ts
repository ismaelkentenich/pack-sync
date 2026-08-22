import Theme from "@theme/theme";
import { getInputColors } from "../getInputColors";

describe("getInputColors", () => {
  it("returns default colors", () => {
    expect(getInputColors("default")).toEqual({
      backgroundColor: Theme.colors.neutral[50],
      borderColor: Theme.colors.neutral[300],
      textColor: Theme.colors.neutral[900],
      placeholderColor: Theme.colors.neutral[400],
      labelColor: Theme.colors.neutral[700],
    });
  });

  it("returns focused colors", () => {
    expect(getInputColors("focused")).toEqual({
      backgroundColor: Theme.colors.neutral[50],
      borderColor: Theme.colors.primary[500],
      textColor: Theme.colors.neutral[900],
      placeholderColor: Theme.colors.neutral[400],
      labelColor: Theme.colors.neutral[800],
    });
  });

  it("returns error colors", () => {
    expect(getInputColors("error")).toEqual({
      backgroundColor: Theme.colors.neutral[50],
      borderColor: Theme.colors.error[500],
      textColor: Theme.colors.neutral[900],
      placeholderColor: Theme.colors.neutral[400],
      labelColor: Theme.colors.error[500],
    });
  });

  it("returns disabled colors", () => {
    expect(getInputColors("disabled")).toEqual({
      backgroundColor: Theme.colors.neutral[100],
      borderColor: Theme.colors.neutral[200],
      textColor: Theme.colors.neutral[500],
      placeholderColor: Theme.colors.neutral[400],
      labelColor: Theme.colors.neutral[500],
    });
  });
});
