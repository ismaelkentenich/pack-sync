import Theme from "@theme/theme";
import { getButtonColors } from "../getButtonColors";

describe("getButtonColors", () => {
  it.each([
    [
      "primary",
      {
        backgroundColor: Theme.colors.neutral[900],
        borderColor: Theme.colors.neutral[900],
        textColor: Theme.colors.neutral[0],
      },
    ],
    [
      "brand",
      {
        backgroundColor: Theme.colors.primary[500],
        borderColor: Theme.colors.primary[500],
        textColor: Theme.colors.neutral[0],
      },
    ],
    [
      "accent",
      {
        backgroundColor: Theme.colors.secondary[400],
        borderColor: Theme.colors.secondary[400],
        textColor: Theme.colors.neutral[900],
      },
    ],
    [
      "secondary",
      {
        backgroundColor: Theme.colors.neutral[200],
        borderColor: Theme.colors.neutral[200],
        textColor: Theme.colors.neutral[900],
      },
    ],
    [
      "outline",
      {
        backgroundColor: "transparent",
        borderColor: Theme.colors.neutral[900],
        textColor: Theme.colors.neutral[900],
      },
    ],
    [
      "danger",
      {
        backgroundColor: Theme.colors.error[500],
        borderColor: Theme.colors.error[500],
        textColor: Theme.colors.neutral[0],
      },
    ],
  ] as const)(
    "returns the expected colors for %s",
    (variant, expectedColors) => {
      expect(getButtonColors(variant)).toEqual(
        expectedColors,
      );
    },
  );

  it.each([
    "primary",
    "brand",
    "accent",
    "secondary",
    "outline",
    "danger",
  ] as const)(
    "returns disabled colors for %s when disabled",
    (variant) => {
      expect(getButtonColors(variant, true)).toEqual({
        backgroundColor: Theme.colors.neutral[300],
        borderColor: Theme.colors.neutral[300],
        textColor: Theme.colors.neutral[500],
      });
    },
  );
});
