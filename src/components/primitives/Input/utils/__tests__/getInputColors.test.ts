import Theme from "@theme/theme";
import { getInputColors } from "../getInputColors";

describe("getInputColors", () => {
  it.each([
    [
      "default",
      {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.neutral[400],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[700],
        iconColor: Theme.colors.neutral[500],
        supportingTextColor: Theme.colors.neutral[600],
      },
    ],

    [
      "focused",
      {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.primary[600],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.primary[600],
        iconColor: Theme.colors.primary[600],
        supportingTextColor: Theme.colors.neutral[600],
      },
    ],

    [
      "error",
      {
        backgroundColor: Theme.colors.neutral[50],
        borderColor: Theme.colors.error[500],
        textColor: Theme.colors.neutral[900],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.error[500],
        iconColor: Theme.colors.error[500],
        supportingTextColor: Theme.colors.error[500],
      },
    ],

    [
      "disabled",
      {
        backgroundColor: Theme.colors.neutral[100],
        borderColor: Theme.colors.neutral[200],
        textColor: Theme.colors.neutral[500],
        placeholderColor: Theme.colors.neutral[400],
        labelColor: Theme.colors.neutral[500],
        iconColor: Theme.colors.neutral[400],
        supportingTextColor: Theme.colors.neutral[500],
      },
    ],
  ] as const)(
    "returns the expected colors for %s state",
    (state, expectedColors) => {
      expect(getInputColors(state)).toEqual(expectedColors);
    },
  );
});
