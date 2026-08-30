import Theme from "@theme/theme";
import { getHomeActionCardSizeStyles } from "../getHomeActionCardSizeStyles";

describe("getHomeActionCardSizeStyles", () => {
  it.each([
    [
      "sm",
      {
        container: {
          padding: Theme.spacing.sm,
          gap: Theme.spacing.sm,
        },

        iconContainer: {
          width: Theme.sizing.control.sm,
          height: Theme.sizing.control.sm,
        },

        title: {
          fontSize: Theme.typography.size.sm,
          lineHeight: Theme.typography.lineHeight.sm,
        },

        description: {
          fontSize: Theme.typography.size.xs,
          lineHeight: Theme.typography.lineHeight.xs,
        },

        iconSize: Theme.sizing.icon.sm,

        arrowSize: Theme.sizing.icon.xs,
      },
    ],

    [
      "md",
      {
        container: {
          padding: Theme.spacing.md,
          gap: Theme.spacing.md,
        },

        iconContainer: {
          width: Theme.sizing.control.md,
          height: Theme.sizing.control.md,
        },

        title: {
          fontSize: Theme.typography.size.md,
          lineHeight: Theme.typography.lineHeight.md,
        },

        description: {
          fontSize: Theme.typography.size.sm,
          lineHeight: Theme.typography.lineHeight.sm,
        },

        iconSize: Theme.sizing.icon.md,

        arrowSize: Theme.sizing.icon.sm,
      },
    ],

    [
      "lg",
      {
        container: {
          padding: Theme.spacing.lg,
          gap: Theme.spacing.lg,
        },

        iconContainer: {
          width: Theme.sizing.control.lg,
          height: Theme.sizing.control.lg,
        },

        title: {
          fontSize: Theme.typography.size.lg,
          lineHeight: Theme.typography.lineHeight.lg,
        },

        description: {
          fontSize: Theme.typography.size.md,
          lineHeight: Theme.typography.lineHeight.md,
        },

        iconSize: Theme.sizing.icon.lg,

        arrowSize: Theme.sizing.icon.sm,
      },
    ],
  ] as const)(
    "returns the expected styles for %s size",
    (size, expectedStyles) => {
      expect(getHomeActionCardSizeStyles(size)).toEqual(
        expectedStyles,
      );
    },
  );
});
